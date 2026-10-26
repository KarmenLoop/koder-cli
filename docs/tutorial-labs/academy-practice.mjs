#!/usr/bin/env node
// Local teaching helper: creates files on explicit request; never executes lesson code.
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import '../courses/academy/practice.js';

const P=globalThis.AcademyPractice;
const root=path.dirname(fileURLToPath(import.meta.url));
const hash=s=>createHash('sha256').update(s).digest('hex');
const readData=()=>JSON.parse(fs.readFileSync(path.join(root,'../courses/academy/catalog.json'),'utf8'));
function regular(file,max=2*1024*1024){
 const s=fs.lstatSync(file);
 if(!s.isFile()||s.isSymbolicLink()||s.size>max)throw Error('PRACTICE_FILE_INVALID: '+path.basename(file));
 return fs.readFileSync(file,'utf8');
}
export function createPractice(number,destination){
 if(!/^[1-9]\d*$/.test(String(number)))throw Error('LESSON_INVALID');
 const data=readData(),l=data.lessons[Number(number)-1];
 if(!l||l.number!==Number(number))throw Error('LESSON_INVALID');
 if(typeof destination!=='string'||!destination.trim())throw Error('DESTINATION_REQUIRED');
 const target=path.resolve(destination),parent=path.dirname(target);
 if(!fs.statSync(parent).isDirectory())throw Error('DESTINATION_PARENT_REQUIRED');
 // mkdir is the ownership boundary. Existing directories, including symlinks, are never reused.
 fs.mkdirSync(target);
 const p=P.plan(l),files={
  'input.txt':p.input+'\n',
  'workbook.md':P.worksheet(l),
  'coaching-prompt.txt':p.prompt+'\n',
  'README.md':'# 第 '+number+' 课练习目录\n\n'+l.title+'\n\n1. 先读 input.txt，再在 workbook.md 写预测。\n2. 按讲义完成基准和变式；原输入不要改，变式另存。\n3. 需要 Koder 辅导时，先读 coaching-prompt.txt，再自行提交到当前项目。提交可能使用你配置的模型和费用预算。\n4. 将本课所需文件放在此目录，最后手动核对参考答案。\n\n'+(l.program?'case.mjs 是课程给定的基准程序，创建目录不会运行它。先读源文件，再按讲义运行 node case.mjs；修改在另存的副本进行。\n\n':'本课没有附带可执行程序；请按讲义制作文稿、图表、配置说明或分析记录，不要把 input.txt 当命令执行。\n\n')+'工作簿结构检查不评判内容正确性。不要在练习里记录真实密码、Key 或私人邮件。\n'
 };
 if(l.program)files['case.mjs']=l.program+'\n';
 const manifest={schema:1,edition:P.EDITION,lesson:l.number,title:l.title,inputSha256:hash(files['input.txt']),programIncluded:Boolean(l.program),executed:false};
 try{
  for(const [name,body] of Object.entries({...files,'practice.json':JSON.stringify(manifest,null,2)+'\n'}))fs.writeFileSync(path.join(target,name),body,{flag:'wx'});
 }catch(error){
  // Keep a partially created directory for inspection; never delete student work on failure.
  throw Error('PRACTICE_CREATE_PARTIAL: '+error.code+'; '+target);
 }
 return {...manifest,directory:target,files:[...Object.keys(files),'practice.json'],state:'created',contentVerified:false};
}
export function checkPractice(destination){
 const target=path.resolve(destination),stat=fs.lstatSync(target);
 if(!stat.isDirectory()||stat.isSymbolicLink())throw Error('PRACTICE_DIRECTORY_INVALID');
 const manifest=JSON.parse(regular(path.join(target,'practice.json'),32768));
 if(manifest.schema!==1||!Number.isInteger(manifest.lesson)||manifest.lesson<1||manifest.lesson>1800)throw Error('PRACTICE_MANIFEST_INVALID');
 const lesson=readData().lessons[manifest.lesson-1];
 const input=regular(path.join(target,'input.txt')),original=P.plan(lesson).input+'\n';
 const inputUnchanged=hash(input)===hash(original);
 const review=P.checkWorksheet(regular(path.join(target,'workbook.md')));
 return {...review,lesson:manifest.lesson,inputUnchanged,
  state:inputUnchanged?review.state:'input-changed',
  message:!inputUnchanged?'基准输入已改变；请保留修改副本并恢复原输入，再比较变式。':review.missing.length?'还有栏目未填。请按清单完成自己的结果。':'栏目已填写，等待人工核对内容；此结果不表示答案正确或实操通过。'};
}
function main(args){
 const [action,number,destination,...rest]=args;
 if(action==='create'&&number&&destination&&!rest.length)return {receipt:createPractice(number,destination),exit:0};
 if(action==='check'&&number&&!destination){const receipt=checkPractice(number);return {receipt,exit:receipt.state==='ready-for-human-review'?0:3};}
 if(!action||action==='help'||action==='--help')return {text:'Koder 课堂本地练习工具\n\nnode academy-practice.mjs create <1-1800> <新练习目录>\nnode academy-practice.mjs check <练习目录>\n\n只创建自有文件或检查工作簿栏目，不运行示例、不调用模型、不安装依赖。目标父目录需已存在，已有目标目录不会覆盖。check 的退出码 0 仅表示栏目齐全，内容仍需人工核对；未填或原输入改变返回 3。',exit:0};
 throw Error('USAGE: create <课号> <新目录> | check <目录>');
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{const result=main(process.argv.slice(2));console.log(result.text||JSON.stringify(result.receipt,null,2));process.exitCode=result.exit;}
 catch(error){console.error(String(error.message));process.exitCode=2;}
}
