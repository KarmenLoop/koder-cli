import { importKernel } from './agent.mjs';
import { diagnosticFetch } from './turn.mjs';
import { modelEndpoint, transportOptions, withModelEndpoint } from './model-http.mjs';

export function connectionHint(failure, lang = 'zh') {
  const en=lang==='en';
  const status=failure?.status;
  if(status===401)return en?'Check API key.':'请检查 API 密钥。';
  if(status===403)return en?'Check model permissions and region.':'请检查模型权限和服务地区。';
  if(status===404)return en?'Check base URL, endpoint and model name.':'请检查接口地址、路径和模型名。';
  if(status===429)return en?'Rate limit or exhausted quota; check provider quota.':'请求限流或额度不足，请检查服务商额度。';
  if(status===400 || status===422)return en?'Check protocol, model and supported request parameters.':'请检查协议、模型和参数支持情况。';
  if(status>=500)return en?'Provider unavailable after bounded retries.':'服务商暂时不可用，已完成有限重试。';
  if(failure?.error==='API_TLS_ERROR')return en?'Check certificate chain, trusted CA and proxy.':'请检查证书链、受信任 CA 和代理。';
  if(failure?.error==='API_DNS_ERROR')return en?'Check DNS and API hostname.':'请检查 DNS 和 API 域名。';
  if(failure?.error==='API_INVALID_RESPONSE')return en?'Endpoint returned HTML; check API path and proxy.':'接口返回网页，请检查 API 路径和代理。';
  if(/TIMEOUT/.test(failure?.error || ''))return en?'Response stalled or exceeded its deadline; check provider and network.':'响应等待超时或中途停滞，请检查服务商和网络。';
  return en?'Check network, API URL and proxy; run koder model test.':'请检查网络、API 地址和代理；可运行 koder model test。';
}
export async function checkModel(ctx, record) {
  const diagnostic=diagnosticFetch(ctx.io.fetchImpl || globalThis.fetch,{env:ctx.env});
  const {createProvider}=await importKernel('harness/providers.mjs',ctx.env);
  const provider=createProvider({provider:{...record,id:'cli-check',maxOutput:Math.min(record.maxOutput || 1024,1024)},fetchImpl:withModelEndpoint(diagnostic.fetch,record)});
  const started=Date.now();
  try {
    await provider.complete({messages:[{role:'user',content:'Reply with the single word ready.'}],tools:[]});
    return {ok:true,host:new URL(modelEndpoint(record)).host,elapsedMs:Date.now()-started};
  }catch(error){
    return {ok:false,host:new URL(modelEndpoint(record)).host,elapsedMs:Date.now()-started,failure:diagnostic.state.last || {error:error?.code==='MODEL_PROTOCOL'?'API_INVALID_RESPONSE':'API_MODEL_RESPONSE'}};
  }
}
export async function printModelCheck(ctx, record) {
  const result=await checkModel(ctx,record);
  if(result.ok)ctx.stdout.write(`${ctx.lang==='en'?'API connected (validated model reply)':'API 已连接（已验证模型回复）'} · ${result.host} · ${result.elapsedMs} ms\n`);
  else {
    const detail=result.failure.status?`HTTP ${result.failure.status}`:result.failure.error;
    ctx.stderr.write(`${ctx.lang==='en'?'API check failed':'API 连接检测失败'} (${detail} · ${result.host}) ${connectionHint(result.failure,ctx.lang)}\n`);
  }
  return result.ok?0:2;
}
export function transportSummary(env, lang) {
  const config=transportOptions(env);
  return `${lang==='en'?'API transport':'API 连接策略'}: ${lang==='en'?'retries':'最多重试'} ${config.retries}; ${lang==='en'?'headers/idle/total':'响应头/空闲/总超时'} ${config.connectTimeoutMs}/${config.idleTimeoutMs}/${config.timeoutMs} ms`;
}
