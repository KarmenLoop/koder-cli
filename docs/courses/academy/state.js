(function(root){
 'use strict';
 const VERSION=1,KEY='koder-academy-180-v1';
 const blank=()=>({schema:VERSION,last:1,lessons:{}});
 function validate(value){
  if(!value||value.schema!==VERSION||!value.lessons||typeof value.lessons!=='object'||Array.isArray(value.lessons))throw Error('不是受支持的课堂进度文件');
  const result=blank();result.last=Number.isInteger(value.last)&&value.last>=1&&value.last<=180?value.last:1;
  if(Object.keys(value.lessons).length>180)throw Error('课程条目超出范围');
  for(const [key,v] of Object.entries(value.lessons)){
   if(!/^(?:[1-9]|[1-9]\d|1[0-7]\d|180)$/.test(key)||!v||typeof v!=='object')throw Error('课程编号或记录无效');
   if(typeof v.note!=='undefined'&&(typeof v.note!=='string'||v.note.length>10000))throw Error('单课笔记最多10000字符');
   result.lessons[key]={read:v.read===true,quiz:v.quiz===true,lab:v.lab===true,note:v.note||''};
  }
  return result;
 }
 function load(storage){try{const raw=storage.getItem(KEY);return {state:raw?validate(JSON.parse(raw)):blank(),persistent:true};}catch{return {state:blank(),persistent:false};}}
 function save(storage,state){try{storage.setItem(KEY,JSON.stringify(validate(state)));return true;}catch{return false;}}
 function merge(a,b){const result=validate(a),incoming=validate(b);for(const [id,v]of Object.entries(incoming.lessons)){const old=result.lessons[id]||{};result.lessons[id]={read:!!old.read||v.read,quiz:!!old.quiz||v.quiz,lab:!!old.lab||v.lab,note:old.note&&v.note&&old.note!==v.note?(old.note+'\n\n[导入笔记]\n'+v.note).slice(0,10000):(v.note||old.note||'')};}result.last=incoming.last;return result;}
 function summary(state){const x=Object.values(state.lessons);return {read:x.filter(v=>v.read).length,quiz:x.filter(v=>v.quiz).length,lab:x.filter(v=>v.lab).length};}
 root.AcademyState={KEY,blank,validate,load,save,merge,summary};
})(typeof globalThis!=='undefined'?globalThis:this);
