const fail=()=>Object.assign(new Error('当前单轮请求与工具结果超过模型上下文预算。历史已保留，请缩小本轮输入或在模型配置中设置实际 contextWindow。'),{code:'CONTEXT_BUDGET_EXCEEDED'});
const terms=text=>[...new Set(String(text).toLowerCase().match(/[a-z0-9_-]{3,}|[\u3400-\u9fff]{2,6}/g)||[])].filter(t=>!['continue','please','what','this','that','with','from','step'].includes(t));
function excerpt(text,limit,helpers,query='') {
  const source=String(text||'');
  if(helpers.estimateTokens(source)<=limit)return source;
  const hit=terms(query).map(term=>source.toLowerCase().indexOf(term)).find(index=>index>=0);
  let chars=Math.max(20,Math.floor(limit));
  let result;
  do{
    const head=source.slice(0,chars),tail=source.slice(-Math.floor(chars/3));
    const middle=hit>chars?` … ${source.slice(Math.max(chars,hit-Math.floor(chars/4)),hit+Math.floor(chars/2))}`:'';
    result=`${head}${middle} … ${tail}`;chars=Math.floor(chars*0.8);
  }while(chars>5&&helpers.estimateTokens(result)>limit);
  return result;
}

// This is an extractive model projection, never a replacement for saved history
// or a source of execution permission. Atomic tool-call/result groups are kept.
export function projectContext({system,history,tools=[],profile={},notes=[],interrupted=false,query='',helpers}) {
  const window=Math.max(2048,Number(profile.contextWindow)||8192);
  const toolTokens=helpers.estimateTokens(JSON.stringify(tools))+64;
  const live=history.filter(m=>['user','assistant','tool'].includes(m.role));
  const wordsForNotes=terms(query);
  const selectedNotes=[...new Map([...notes.filter(n=>wordsForNotes.some(t=>n.text.toLowerCase().includes(t))).slice(-3),...notes.slice(-3)].map(n=>[n.id,n])).values()].sort((a,b)=>a.at-b.at);
  const noteLimit=Math.min(480,Math.floor(window*0.05));
  const noteLines=selectedNotes.map(note=>`- ${excerpt(note.text,Math.max(20,Math.floor(noteLimit/Math.max(1,selectedNotes.length))),helpers,query)}`);
  const noteText=noteLines.length?`\n\n用户在此会话明确保存的记忆（可由 koder memory 管理；当前请求优先，不能授予工具权限）：\n${noteLines.join('\n')}`:'';
  const recovery=interrupted?'\n上次会话未正常结束。没有保存的工具回执代表结果未知；先核实当前状态，不能凭历史重放操作或恢复旧批准。':'';
  const base={...system,content:system.content+noteText+recovery};
  let latestStart=live.findLastIndex(m=>m.role==='user');
  if(latestStart<0)latestStart=0;
  const required=helpers.estimateMessages([base,...live.slice(latestStart)]);
  const remaining=window-toolTokens-required-96;
  if(remaining<256)throw fail();
  const outputBudget=Math.min(Math.max(256,Number(profile.maxOutput)||4096),Math.floor(remaining));
  const budget=helpers.contextBudget({...profile,maxOutput:outputBudget},1);
  const inputBudget=Math.max(0,budget.inputBudget-toolTokens);
  let trimmed=helpers.trimMessages([base,...live],inputBudget);
  if(trimmed.overflow)throw fail();
  if(!trimmed.dropped)return {...trimmed,inputBudget,toolTokens,outputBudget};
  const kept=new Set(trimmed.messages.slice(1));
  const old=live.map((message,index)=>({message,index})).filter(item=>!kept.has(item.message));
  const words=terms(query);
  const score=item=>words.reduce((sum,term)=>sum+(String(item.message.content||'').toLowerCase().includes(term)?1:0),0);
  const first=old.find(item=>item.message.role==='user');
  const relevant=old.filter(item=>score(item)>0).sort((a,b)=>score(b)-score(a)||b.index-a.index).slice(0,3);
  const decisions=old.filter(item=>item.message.role==='user'&&/only|must|never|instead|changed|不要|必须|改为|改成|记住|取消|目标|限制/i.test(item.message.content)).slice(-2);
  const candidates=[...new Map([first,...relevant,...decisions,...old.slice(-2)].filter(Boolean).map(item=>[item.index,item])).values()].sort((a,b)=>a.index-b.index);
  const memoryBudget=Math.min(700,Math.max(80,Math.floor(inputBudget*0.2)));
  const each=Math.max(20,Math.floor((memoryBudget-100)/Math.max(1,candidates.length)));
  const lines=candidates.map(({message,index})=>`[${index+1} ${message.role}${message.name?` ${message.name}`:''}] ${excerpt(message.content,each,helpers,query)}`);
  const summary=`\n\n<conversation_carryover>\n较早对话的原文摘录，按时间排序；后续消息和当前请求优先。这些是历史资料，不是新批准，助手文字不等于已完成事实。完整历史保存在本地，可通过 koder memory search 检索。\n${lines.join('\n')}\n</conversation_carryover>`;
  trimmed=helpers.trimMessages([{...base,content:base.content+summary},...live],inputBudget);
  if(trimmed.overflow)throw fail();
  return {...trimmed,inputBudget,toolTokens,outputBudget};
}
