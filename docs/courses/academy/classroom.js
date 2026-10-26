(function(){
 'use strict';
 const data=window.KODER_ACADEMY,S=window.AcademyState,N=window.AcademyNavigation,$=id=>document.getElementById(id);
 const total=data.lessons.length,indexed=N.index(data.lessons),modules=new Map(data.modules.map(m=>[m.id,m]));
 const esc=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const paragraphs=text=>String(text).split(/\n\n+/).filter(Boolean).map(p=>'<p class="prose">'+esc(p)+'</p>').join('');
 let storage;try{storage=window.localStorage;}catch{storage=null;}
 const loaded=S.load(storage);
 let state=loaded.state,current=1,navPage=1,persistent=loaded.persistent;
 const status=t=>{$('status').textContent=t+(!persistent&&!/导出/.test(t)?' 当前环境无法持久保存，请导出记录。':'');};
 function updateTotals(){
  const x=S.summary(state);
  const scored=data.lessons.filter(l=>l.quiz.mode!=='self-check'&&state.lessons[l.number]?.quiz).length;
  $('readcount').textContent=x.read;$('quizcount').textContent=scored;$('labcount').textContent=x.lab;
  $('progressfill').style.width=(x.read/total*100)+'%';$('progressbar').setAttribute('aria-valuenow',String(x.read));
 }
 function persist(){persistent=S.save(storage,state);if(!persistent)status('当前环境无法持久保存，请用“导出进度与笔记”保存到文件。');updateTotals();}
 function entry(n){return state.lessons[n]||(state.lessons[n]={read:false,quiz:false,lab:false,note:''});}
 function matching(){return N.select(indexed,{query:$('search').value,filter:$('filter').value,module:$('module-filter').value,progress:state.lessons});}
 function nav(followCurrent=false){
  const matches=matching();
  if(followCurrent)navPage=N.pageContaining(matches,current)||navPage;
  const p=N.page(matches,navPage);navPage=p.page;
  let previousModule=null;
  $('course-nav').innerHTML=p.items.map(l=>{
   const m=modules.get(l.module),heading=l.module!==previousModule?'<h2>'+esc(m.title)+'</h2>':'';
   previousModule=l.module;
   return heading+'<a href="#lesson-'+l.number+'" '+(l.number===current?'aria-current="page"':'')+'><span class="n">'+String(l.number).padStart(3,'0')+'</span>'+(state.lessons[l.number]?.read?'✓ ':'')+esc(l.title)+'</a>';
  }).join('')||'<p>没有匹配课程，请换关键词或筛选条件。</p>';
  $('searchcount').textContent='找到 '+p.total+' / '+total+' 课 · 当前显示 '+p.start+'–'+p.end;
  $('nav-position').textContent='目录 '+p.page+' / '+p.pages+' 页';
  $('nav-prev').disabled=p.page===1;$('nav-next').disabled=p.page===p.pages;
 }
 function quizMarkup(l,e){
  if(l.quiz.mode==='self-check')return '<section class="lessonpart"><h2>课堂自测 · 人工自查</h2>'+paragraphs(l.quiz.question)+'<p class="notice">'+esc(l.quiz.grading)+'</p><details class="answer"><summary>写出自己的结果后，再展开参考与核对依据</summary>'+paragraphs(l.quiz.explanation)+'</details></section>';
  return '<section class="lessonpart"><h2>课堂自测</h2>'+paragraphs(l.quiz.question)+'<div class="quiz-options">'+l.quiz.options.map((x,i)=>'<button type="button" data-option="'+i+'" aria-pressed="false">'+('ABC'[i])+'. '+esc(x)+'</button>').join('')+'</div><p id="quiz-feedback" role="status" aria-live="polite">'+(e.quiz?'这道自测已有正确作答记录，可再次练习。':'选一项查看解释；答对自测不会标记实操作业完成。')+'</p></section>';
 }
 function practiceMarkup(l){
  if(!window.AcademyPractice)return '';
  const p=window.AcademyPractice.plan(l),d=p.domain;
  return '<section class="lessonpart hands-on"><h2>从文件开始跟做</h2><p>工作目录：<code>Koder Projects/'+esc(p.name)+'</code>。交件：'+esc(p.deliverable)+'。</p><div class="actions"><button id="download-workbook" type="button">下载本课工作簿</button><button id="copy-coaching" type="button">复制分步辅导提示词</button><a href="PRACTICE-GUIDE.zh.html#domain-'+d.number+'">查看本专题实操指南</a></div><p class="small">工作簿不预填答案。复制提示词不会发送任务；自行提交到 Koder 后可能产生模型费用。</p><details class="answer"><summary>按文件走完本课：四段跟做与核对点</summary><ol>'+d.route.map(s=>'<li class="step"><h3>'+esc(s[0])+'</h3>'+paragraphs(s[1])+'<div class="expected"><strong>检查点：</strong>'+esc(s[2])+'</div></li>').join('')+'</ol><p>本课任务：'+esc(p.task)+'</p><p>独立变式：'+esc(p.variant)+'</p></details><details class="answer"><summary>交件自评表：每项 0–2 分，逐项写依据</summary><p>0：缺失或与输入矛盾；1：有结果但缺依据；2：结果、依据和复做记录齐全。自评不等于自动认证。</p><ol>'+d.criteria.map(c=>'<li>'+esc(c)+'</li>').join('')+'</ol><p>基准、变式、失败排查与交件分别记录，再与本课参考对照。</p></details></section>';
 }
 function render(number,focus=false){
  const n=N.number(number,total);if(n===null){status('课号应为 1–'+total+' 的整数。');return false;}
  current=n;state.last=n;
  const l=data.lessons[n-1],m=modules.get(l.module),e=entry(n);persist();
  const lineage=l.baseNumber?'原第 <a href="#lesson-'+l.baseNumber+'">'+l.baseNumber+' 课</a> · 第 '+(l.stage+1)+' 个独立案例':n<=30?'原基础教练保留':'原专题课保留并增加补充讲解';
  const parts=[
   '<div class="eyebrow">UNIT '+String(m.id).padStart(2,'0')+' / LESSON '+String(n).padStart(3,'0')+'</div>',
   '<h1 id="lesson-title" tabindex="-1">'+esc(l.title)+'</h1>',
   '<p class="meta">建议 '+l.minutes+' 分钟，含自行练习 · 前置：'+(l.prerequisite.map(k=>'<a href="#lesson-'+k+'">第'+k+'课</a>').join('、')||'无需前置')+' · '+lineage+'</p>',
   '<div class="objective"><strong>学完这一课，你应能</strong>'+paragraphs(l.goal)+'</div>',
   '<section class="lessonpart"><h2>先把原理讲清楚</h2>'+paragraphs(l.explain)+'<details class="answer"><summary>本单元贯穿项目</summary>'+paragraphs(m.description)+'<p>单元交件：'+esc(m.project)+'</p></details></section>',
   '<section class="lessonpart"><h2>开始前准备</h2>'+paragraphs(l.prepare)+'<p class="notice">教材与 '+esc(data.version)+' 源码配套。查看本机 koder --version 和 koder help，核对实际可用命令。阅读和复制示例不会执行操作。</p></section>',
   practiceMarkup(l),
   '<section class="lessonpart"><h2>'+(l.input?'合成输入与示例':'示例与解读')+'</h2><div class="codebox"><pre id="example-code">'+esc(l.input||l.example)+'</pre><button class="copy" id="copy-example">'+(l.program?'复制 case.mjs 程序':'复制本课输入')+'</button></div><p class="codehint">先读输入说明。代码、配置、状态记录与写作素材各有用途；涉及占位路径或地址时，请按本课步骤替换。</p>'+(l.operation?'<h3>本课任务</h3>'+paragraphs(l.operation):'')+paragraphs(l.result)+'</section>',
   '<section class="lessonpart hands-on"><h2>手把手操作</h2><ol>'+l.steps.map(s=>'<li class="step"><div class="step-action">'+esc(s.action)+'</div><div class="expected"><strong>应看到：</strong>'+esc(s.expected)+'</div>'+(s.why?'<div class="why"><strong>为什么：</strong>'+esc(s.why)+'</div>':'')+'</li>').join('')+'</ol><h3>常见问题与恢复</h3>'+l.issues.map(x=>'<details class="answer"><summary>'+esc(x.symptom)+'</summary>'+paragraphs(x.recovery)+'</details>').join('')+'</section>',
   '<section class="lessonpart developer"><h2>开发者课堂</h2>'+paragraphs(l.developer)+'</section>',
   quizMarkup(l,e),
   '<section class="lessonpart"><h2>作业与自查</h2>'+paragraphs(l.exercise)+'<details class="answer"><summary>展开参考答案与验收</summary>'+paragraphs(l.answer)+'</details><p class="notice">'+esc(l.evidenceBoundary||'分别记录实际操作、合成演练与未验部分。教材答案不替代你自己的输出；真实账号、模型、设备和发布需另有实际证据。')+'</p>'+(l.deepLessons?'<p>继续本主题的九个独立案例：'+l.deepLessons.map(k=>'<a href="#lesson-'+k+'">第'+k+'课</a>').join(' · ')+'</p>':'')+'<p><a href="../tutorial-labs/acceptance-template.md">验收模板</a> · <a href="lessons/'+String(n).padStart(3,'0')+'.md" download>下载本课讲义</a></p></section>',
   '<section class="lessonpart note-area"><h2>我的课堂笔记</h2><label for="note">记录关键认识、实际输出、问题与下一步（只在本浏览器保存，勿填密码或 Key）</label><textarea id="note" maxlength="10000" placeholder="我实际完成了……&#10;证据在……&#10;还不确定……"></textarea><div class="toggles"><label><input id="mark-read" type="checkbox" '+(e.read?'checked':'')+'> 已阅读本课</label><label><input id="mark-lab" type="checkbox" '+(e.lab?'checked':'')+'> 我已完成并自查实操作业</label></div><p class="small">阅读、自测、实操分别统计。打开课程不自动标记完成；浏览器记录不写入 CLI 配置。</p></section>',
   '<section><h2>进一步查阅</h2><ul>'+l.refs.map(f=>'<li><a href="../'+esc(f)+'">'+esc(f)+'</a></li>').join('')+'</ul><p class="small">'+(n<=30?'原 30 课保留中英双语教练与四种 Shell 讲义。':'本课为中文课程，英文教材仍为原 30 课。')+'</p></section>'
  ];
  $('lesson').innerHTML=parts.join('');
  $('note').value=e.note;
  $('note').oninput=()=>{e.note=$('note').value;persist();if($('filter').value==='notes')nav();};
  $('mark-read').onchange=()=>{e.read=$('mark-read').checked;persist();nav();};
  $('mark-lab').onchange=()=>{e.lab=$('mark-lab').checked;persist();};
  $('copy-example').onclick=async()=>{try{await navigator.clipboard.writeText(l.program||l.input||l.example);status('本课输入已复制，请按步骤选择使用。');}catch{status('当前环境无法自动复制，请选中示例文本复制。');}};
  if(window.AcademyPractice){
   $('download-workbook').onclick=()=>download('lesson-'+String(n).padStart(4,'0')+'-workbook.md',window.AcademyPractice.worksheet(l),'text/markdown;charset=utf-8');
   $('copy-coaching').onclick=async()=>{try{await navigator.clipboard.writeText(window.AcademyPractice.plan(l).prompt);status('辅导提示词已复制；请先阅读并编辑，再自行提交到本课练习目录。');}catch{status('无法自动复制。可下载离线教材，用练习工具创建 coaching-prompt.txt 后手动复制。');}};
  }
  document.querySelectorAll('[data-option]').forEach(b=>b.onclick=()=>{
   const correct=Number(b.dataset.option)===l.quiz.answer;
   document.querySelectorAll('[data-option]').forEach(x=>{x.setAttribute('aria-pressed',String(x===b));delete x.dataset.result;});
   b.dataset.result=correct?'right':'wrong';
   $('quiz-feedback').textContent=(correct?'答对了。':'再想一想。')+l.quiz.explanation;
   if(correct){e.quiz=true;persist();}
  });
  $('prev').disabled=n===1;$('next').disabled=n===total;$('position').textContent=n+' / '+total;
  document.title='第 '+n+' 课 · '+l.title+' · Koder 课堂';
  nav(true);if(focus)$('lesson-title').focus({preventScroll:false});
  return true;
 }
 function navigate(value){
  const n=N.number(value,total);
  if(n===null){status('课号应为 1–'+total+' 的整数。');return false;}
  if(location.hash==='#lesson-'+n)render(n,true);else location.hash='lesson-'+n;
  return true;
 }
 function download(name,text,type='application/json;charset=utf-8'){
  const a=document.createElement('a'),url=URL.createObjectURL(new Blob([text],{type}));
  a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 }
 $('module-filter').innerHTML='<option value="all">全部单元</option>'+data.modules.map(m=>'<option value="'+m.id+'">'+m.id+'. '+esc(m.title)+'（'+m.start+'–'+m.end+'）</option>').join('');
 $('prev').onclick=()=>navigate(current-1);$('next').onclick=()=>navigate(current+1);$('resume').onclick=()=>navigate(state.last);
 $('search').oninput=()=>{navPage=1;nav();};
 for(const id of ['filter','module-filter'])$(id).onchange=()=>{navPage=1;nav();};
 $('nav-prev').onclick=()=>{navPage--;nav();};$('nav-next').onclick=()=>{navPage++;nav();};
 $('jump-form').onsubmit=e=>{e.preventDefault();navigate($('jump').value.trim());};
 document.querySelectorAll('button[data-track]').forEach(b=>b.onclick=()=>{
  document.body.dataset.track=b.dataset.track;
  document.querySelectorAll('button[data-track]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));
 });
 $('export').onclick=()=>download('koder-academy-progress.json',JSON.stringify(S.validate(state),null,2));
 $('import').onchange=async e=>{
  const f=e.target.files[0];if(!f)return;
  try{
   if(f.size>64*1024*1024)throw Error('文件超过 64 MiB');
   const incoming=S.validate(JSON.parse(await f.text()));state=S.merge(state,incoming);persist();
   render(state.last);location.hash='lesson-'+state.last;status('已合并导入进度；原有笔记和完成记录保留。');
  }catch(err){status('导入失败：'+err.message);}finally{e.target.value='';}
 };
 $('clear').onclick=()=>{
  if(window.confirm('清除本浏览器的课堂进度与笔记？请先导出备份。此操作不影响 CLI 会话。')){
   state=S.blank();persist();render(1);location.hash='lesson-1';status('本浏览器课堂记录已清除。');
  }
 };
 $('print').onclick=()=>window.print();
 function fromHash(focus=false){
  const match=/^#lesson-([1-9]\d*)$/.exec(location.hash);
  if(!location.hash)return render(state.last,focus);
  if(location.hash==='#lesson')return render(state.last,true);
  if(!match||N.number(match[1],total)===null){status('链接中的课号无效。可跳转至 1–'+total+' 课。');if(!$('lesson').children.length)render(state.last,focus);return;}
  render(Number(match[1]),focus);
 }
 window.addEventListener('hashchange',()=>fromHash(true));fromHash();
 if(!loaded.persistent)status('浏览器存储不可用；笔记仍可编辑，请及时导出。');
 window.__academy={getState:()=>S.validate(state),navigate,render};
})();
