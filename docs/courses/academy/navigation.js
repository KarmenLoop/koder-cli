(function(root){
 'use strict';
 const PAGE_SIZE=30;
 function number(value,total){const text=String(value);if(!/^[1-9]\d*$/.test(text))return null;const n=Number(text);return Number.isSafeInteger(n)&&n<=total?n:null;}
 function index(lessons){return lessons.map(lesson=>({lesson,text:[lesson.number,lesson.title,lesson.goal,lesson.explain,lesson.example,lesson.exercise,lesson.developer,lesson.tags,...(lesson.refs||[])].join(' ').toLocaleLowerCase()}));}
 function select(indexed,{query='',filter='all',module='all',progress={}}={}){
  const tokens=String(query).trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return indexed.filter(({lesson:l,text})=>(module==='all'||l.module===Number(module))&&tokens.every(q=>text.includes(q))&&(filter!=='unread'||!progress[l.number]?.read)&&(filter!=='notes'||!!progress[l.number]?.note)).map(x=>x.lesson);
 }
 function page(lessons,requested=1,size=PAGE_SIZE){
  size=Number.isInteger(size)?Math.max(1,Math.min(PAGE_SIZE,size)):PAGE_SIZE;
  const pages=Math.max(1,Math.ceil(lessons.length/size)),current=Math.min(pages,Math.max(1,Number.isInteger(requested)?requested:1));
  return {items:lessons.slice((current-1)*size,current*size),page:current,pages,total:lessons.length,start:lessons.length?(current-1)*size+1:0,end:Math.min(current*size,lessons.length)};
 }
 function pageContaining(lessons,current){const position=lessons.findIndex(l=>l.number===current);return position<0?null:Math.floor(position/PAGE_SIZE)+1;}
 root.AcademyNavigation={PAGE_SIZE,number,index,select,page,pageContaining};
})(typeof globalThis!=='undefined'?globalThis:this);
