import crypto from 'node:crypto';
import {createMemory} from '../memory.mjs';
import {KoderError} from '../errors.mjs';

export async function run(ctx) {
  const [action='show',...args]=ctx.positionals;
  let key;
  try { key=ctx.findProvider()?.record?.apiKey; } catch {}
  const memory=createMemory({workspace:ctx.workspace(),env:ctx.env,name:ctx.opts.session||'default',secrets:[key].filter(Boolean)});
  const out=line=>ctx.stdout.write(`${line}\n`);
  if(action==='add'){
    const text=args.join(' ').trim();
    if(!text||text.length>4096)throw new Error('记忆内容应为 1–4096 个字符。');
    const id=crypto.randomUUID();
    memory.transact(data=>{if(data.notes.length>=32)throw new Error('最多保存 32 条明确记忆，请先删除过期条目。');return memory.write({...data,notes:[...data.notes,{id,text,at:Date.now()}]});});
    out(`${ctx.lang==='en'?'Memory saved':'记忆已保存'}: ${id}`);return 0;
  }
  if(action==='remove'){
    const id=args[0];
    memory.transact(data=>{if(!data.notes.some(n=>n.id===id))throw new Error('找不到这条记忆。');return memory.write({...data,notes:data.notes.filter(n=>n.id!==id)});});
    out(ctx.lang==='en'?'Memory removed.':'记忆已移除。');return 0;
  }
  if(action==='clear'){
    memory.transact(data=>memory.reset(data));out(ctx.lang==='en'?'Started a new conversation. Explicit notes retained.':'已开始新会话，明确保存的记忆仍保留。');return 0;
  }
  if(action==='forget'){memory.transact(data=>memory.forget(data));out(ctx.lang==='en'?'Saved history, notes and archives deleted for this session.':'已删除此会话的历史、明确记忆和归档。');return 0;}
  const data=memory.read();
  if(action==='search'){
    const query=args.join(' ').trim();if(!query)throw new Error('请提供要检索的内容。');
    const matches=[...data.notes.map(note=>({role:'note',content:note.text,id:note.id})),...(data.conversation?.messages||[])].map((m,index)=>({...m,index:index+1})).filter(m=>m.content.toLowerCase().includes(query.toLowerCase()));
    out(ctx.opts.json?JSON.stringify(matches):matches.map(m=>`[${m.index} ${m.role}] ${m.content}`).join('\n')||(ctx.lang==='en'?'No matches.':'没有匹配记录。'));return 0;
  }
  if(action==='show'){
    const result={session:memory.identity.name,workspace:memory.identity.workspace,file:memory.file,conversationId:data.conversation?.id||null,messages:data.conversation?.messages.length||0,interrupted:data.interrupted,notes:data.notes};
    out(ctx.opts.json?JSON.stringify(result):`${ctx.lang==='en'?'Session':'会话'}: ${result.session}\n${ctx.lang==='en'?'Saved messages':'已保存消息'}: ${result.messages}\n${ctx.lang==='en'?'Notes':'明确记忆'}: ${result.notes.length}\n${result.notes.map(n=>`${n.id} ${n.text}`).join('\n')}\n${result.file}`);return 0;
  }
  throw new KoderError('err.unknownCommand',{name:`memory ${action}`});
}
