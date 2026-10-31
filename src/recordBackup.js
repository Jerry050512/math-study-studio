import {validateInk} from './inkStore';
export function parseBackup(data,lessons){
 if(![1,2].includes(data?.version)||!data.record||typeof data.record!=='object'||Array.isArray(data.record))throw Error('不是本站的学习记录');
 const clean={};
 for(const lesson of lessons){const d=data.record[lesson.id];if(!d||typeof d!=='object'||Array.isArray(d))continue;const out={};
  for(const key of ['note','reflection','draft','mistake','confidence'])if(typeof d[key]==='string')out[key]=d[key].slice(0,100000);
  for(const key of ['saved','completed'])if(typeof d[key]==='boolean')out[key]=d[key];
  for(const key of ['stage','quizAnswer','warmAnswer','due','reviewedAt','startedAt','hint','stability'])if(Number.isFinite(d[key]))out[key]=d[key];
  for(const key of ['answerEvidence','questionFeedback','questionFeedbackAt'])if(d[key]&&typeof d[key]==='object'&&!Array.isArray(d[key])){
   out[key]={};for(const [name,value] of Object.entries(d[key])){if(key==='answerEvidence'&&['warm','quiz'].includes(name)&&value&&typeof value.correct==='boolean'&&Number.isFinite(value.at))out[key][name]={correct:value.correct,at:value.at};if(/^math2-\d{4}-\d{2}$/.test(name)&&(key==='questionFeedback'&&['independent','partial','relearn'].includes(value)||key==='questionFeedbackAt'&&Number.isFinite(value)))out[key][name]=value}
  }
  if(Array.isArray(d.reviewHistory))out.reviewHistory=d.reviewHistory.slice(-60).filter(x=>x&&Number.isFinite(x.at)&&Number.isFinite(x.intervalDays)).map(x=>({at:x.at,confidence:String(x.confidence||''),intervalDays:x.intervalDays,accuracy:typeof x.accuracy==='number'?x.accuracy:null,exam:typeof x.exam==='number'?x.exam:null}));
  clean[lesson.id]=out;
 }
 if(lessons.some(l=>l.id===data.record._last))clean._last=data.record._last;
 const handwriting=data.version===2?validateInk(data.handwriting||{}):{};
 return {record:clean,handwriting};
}
