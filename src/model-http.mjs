// Model inference only: replay a request only before a response body is handed
// to the parser. Never replay partial text or partially generated tool calls.
const MODEL_FETCH = Symbol('koder.modelFetch');
const TRANSIENT = new Set(['ECONNRESET','ECONNREFUSED','EPIPE','ETIMEDOUT','EAI_AGAIN','UND_ERR_SOCKET','UND_ERR_CONNECT_TIMEOUT','UND_ERR_HEADERS_TIMEOUT']);
const SAFE_CODES = new Set(['ABORT_ERR','API_TIMEOUT','API_CONNECT_TIMEOUT','API_IDLE_TIMEOUT','API_DNS_ERROR','API_TLS_ERROR','API_NETWORK','API_INVALID_RESPONSE']);
const errorWith = (code) => Object.assign(new Error(code), {code, name: code === 'ABORT_ERR' ? 'AbortError' : 'Error'});

export function transportOptions(env = process.env) {
  const number = (key, fallback, min, max) => {
    if (env[key] === undefined || env[key] === '') return fallback;
    const value=Number(env[key]);
    if (!Number.isInteger(value) || value < min || value > max) throw new Error(`${key}: expected ${min}..${max}`);
    return value;
  };
  return {
    timeoutMs:number('KODER_API_TIMEOUT_MS',600_000,1,1_800_000),
    connectTimeoutMs:number('KODER_API_CONNECT_TIMEOUT_MS',60_000,1,600_000),
    idleTimeoutMs:number('KODER_API_IDLE_TIMEOUT_MS',90_000,1,600_000),
    retries:number('KODER_API_RETRIES',2,0,2),
  };
}

function abortable(promise, signal) {
  return new Promise((resolve,reject)=>{
    const abort=()=>{signal.removeEventListener('abort',abort);reject(signal.reason || errorWith('ABORT_ERR'));};
    if(signal.aborted){Promise.resolve(promise).catch(()=>{});abort();return;}
    signal.addEventListener('abort',abort,{once:true});
    Promise.resolve(promise).then(value=>{signal.removeEventListener('abort',abort);resolve(value);},error=>{signal.removeEventListener('abort',abort);reject(error);});
  });
}
function pause(ms,signal) {
  return new Promise((resolve,reject)=>{
    let timer;
    const abort=()=>{clearTimeout(timer);signal.removeEventListener('abort',abort);reject(signal.reason || errorWith('ABORT_ERR'));};
    if(signal.aborted)return abort();
    signal.addEventListener('abort',abort,{once:true});
    timer=setTimeout(()=>{signal.removeEventListener('abort',abort);resolve();},ms);
  });
}
function retryAfter(response) {
  const value=response.headers.get('retry-after');
  if(value===null)return null;
  const seconds=Number(value);
  if(Number.isFinite(seconds) && seconds>=0)return seconds*1000;
  const date=Date.parse(value);
  return Number.isFinite(date)?Math.max(0,date-Date.now()):null;
}
function safeCode(error,signal) {
  if(signal?.aborted)return signal.reason?.code || 'ABORT_ERR';
  const code=error?.cause?.code || error?.code;
  if(TRANSIENT.has(code) || SAFE_CODES.has(code))return code;
  if(code === 'ENOTFOUND')return 'API_DNS_ERROR';
  if(/CERT|TLS|SSL|SELF_SIGNED|UNABLE_TO_VERIFY/.test(String(code)))return 'API_TLS_ERROR';
  return 'API_NETWORK';
}
const discard=response=>{response?.body?.cancel().catch(()=>{});};

export function createModelFetch(base = globalThis.fetch, {env = process.env, onFailure = () => {}, onResponse = () => {}, ...overrides} = {}) {
  if(base[MODEL_FETCH])return base;
  const options={...transportOptions(env),...overrides};
  const wrapped=async (url,init={})=>{
    const {timeoutMs,connectTimeoutMs,idleTimeoutMs,retries}=options;
    const lifetime=new AbortController();
    const cancel=()=>lifetime.abort(errorWith('ABORT_ERR'));
    const deadline=Date.now()+timeoutMs;
    const total=setTimeout(()=>lifetime.abort(errorWith('API_TIMEOUT')),timeoutMs);
    init.signal?.addEventListener('abort',cancel,{once:true});
    if(init.signal?.aborted)cancel();
    let disposed=false;
    const dispose=()=>{if(disposed)return;disposed=true;clearTimeout(total);init.signal?.removeEventListener('abort',cancel);};
    const failure=(error,signal)=>{
      const code=safeCode(error,signal);
      if(code!=='ABORT_ERR')onFailure({error:code, host:new URL(String(url)).host});
      return errorWith(code);
    };
    try {
      for(let attempt=0;;attempt++) {
        if(lifetime.signal.aborted)throw lifetime.signal.reason;
        const controller=new AbortController();
        const abort=()=>controller.abort(lifetime.signal.reason);
        lifetime.signal.addEventListener('abort',abort,{once:true});
        const unlink=()=>lifetime.signal.removeEventListener('abort',abort);
        let headerTimer=setTimeout(()=>controller.abort(errorWith('API_CONNECT_TIMEOUT')),Math.min(connectTimeoutMs,Math.max(1,deadline-Date.now())));
        let response;
        try {
          const pending=Promise.resolve().then(()=>{
            if(controller.signal.aborted)throw controller.signal.reason;
            return base(url,{...init,signal:controller.signal});
          });
          pending.then(value=>{if(controller.signal.aborted)discard(value);},()=>{});
          response=await abortable(pending,controller.signal);
        } catch(error) {
          clearTimeout(headerTimer);unlink();
          const code=safeCode(error,controller.signal);
          const networkCode=error?.cause?.code || error?.code;
          const transient=code==='API_CONNECT_TIMEOUT' || TRANSIENT.has(networkCode) || (error instanceof TypeError && error.message==='fetch failed' && !networkCode);
          controller.abort(errorWith(code));
          if(lifetime.signal.aborted || !transient || attempt>=retries || (init.body!==undefined && typeof init.body!=='string'))throw failure(error,lifetime.signal.aborted?lifetime.signal:{aborted:true,reason:errorWith(code)});
          const delay=Math.min(8000,400*2**attempt)*(0.75+Math.random()*0.25);
          await pause(Math.min(delay,Math.max(1,deadline-Date.now())),lifetime.signal);
          continue;
        }
        clearTimeout(headerTimer);
        const delay=retryAfter(response) ?? Math.min(8000,400*2**attempt)*(0.75+Math.random()*0.25);
        if((response.status===408 || response.status===409 || response.status===429 || response.status>=500) && attempt<retries && (init.body===undefined || typeof init.body==='string') && delay<deadline-Date.now()) {
          discard(response);controller.abort();unlink();
          await pause(delay,lifetime.signal);
          continue;
        }
        onResponse({status:response.status,ok:response.ok,host:new URL(String(url)).host});
        if(response.ok && /text\/html/i.test(response.headers.get('content-type') || '')){discard(response);controller.abort();unlink();throw errorWith('API_INVALID_RESPONSE');}
        if(!response.body){unlink();dispose();return response;}
        const reader=response.body.getReader();
        let idle,ended=false,streamController;
        const finish=()=>{if(ended)return;ended=true;clearTimeout(idle);controller.signal.removeEventListener('abort',onAbort);unlink();dispose();};
        const stopReader=()=>{reader.cancel().catch(()=>{});};
        const onAbort=()=>{
          if(ended)return;
          const error=failure(controller.signal.reason,controller.signal);
          finish();streamController.error(error);stopReader();
        };
        const arm=()=>{clearTimeout(idle);idle=setTimeout(()=>controller.abort(errorWith('API_IDLE_TIMEOUT')),Math.min(idleTimeoutMs,Math.max(1,deadline-Date.now())));};
        const body=new ReadableStream({
          start(control){streamController=control;controller.signal.addEventListener('abort',onAbort,{once:true});if(controller.signal.aborted)onAbort();else arm();},
          async pull(control){
            try {
              const result=await abortable(reader.read(),controller.signal);
              if(ended)return;
              if(result.done){finish();control.close();reader.releaseLock();}
              else {arm();control.enqueue(result.value);}
            }catch(error){if(!ended){const safe=failure(error,controller.signal);finish();control.error(safe);controller.abort(safe);stopReader();}}
          },
          cancel(){finish();controller.abort(errorWith('ABORT_ERR'));stopReader();},
        },{highWaterMark:0});
        return new Response(body,{status:response.status,statusText:response.statusText,headers:response.headers});
      }
    }catch(error){dispose();throw failure(error,lifetime.signal);}
  };
  Object.defineProperty(wrapped,MODEL_FETCH,{value:true});
  return wrapped;
}

export function modelEndpoint(record) {
  const url=new URL(record.baseUrl);
  const suffix=record.chatPath || (record.protocol==='anthropic'?'/messages':'/chat/completions');
  const clean=url.pathname.replace(/\/+$/,'');
  url.pathname=clean.endsWith(suffix)?clean:`${clean}${suffix}`;
  url.hash='';
  return url.href;
}
export function withModelEndpoint(base,record) {
  const endpoint=modelEndpoint(record);
  return (_url,init)=>base(endpoint,init);
}
