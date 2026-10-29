// Transparent spaced-repetition heuristic, not a calibrated memory measurement.
// R(t)=exp(log(.9)*t/S): S is the interval at which predicted recall reaches 90%.
export const DAY=86400000;
export function reviewSchedule(record,confidence,now=Date.now()){
 const history=Array.isArray(record.reviewHistory)?record.reviewHistory:[];
 const previous=history.at(-1);
 const rating={'需要重学':0,'大致理解':1,'能独立解释':2}[confidence]??0;
 const cycleStart=previous?.at||0;
 const answers=Object.values(record.answerEvidence||{}).filter(x=>x.at>cycleStart&&typeof x.correct==='boolean').map(x=>x.correct);
 const accuracy=answers.length?answers.filter(Boolean).length/answers.length:null;
 const attempts=Object.entries(record.questionFeedback||{}).filter(([id,x])=>['independent','partial','relearn'].includes(x)&&(!previous||(record.questionFeedbackAt?.[id]||0)>cycleStart)).map(([,x])=>x);
 const exam=attempts.length?attempts.reduce((s,x)=>s+({independent:1,partial:.5,relearn:0}[x]),0)/attempts.length:null;
 const evidence=[accuracy,exam].filter(x=>x!==null);
 const performance=evidence.length?evidence.reduce((a,b)=>a+b,0)/evidence.length:.65;
 const weak=rating===0||exam===0||accuracy===0;
 const elapsed=previous?Math.max(0,(now-previous.at)/DAY):0;
 const previousStability=Number.isFinite(record.stability)?Math.max(.25,record.stability):1;
 const dueForReview=!previous||elapsed>=Math.max(.25,previous.intervalDays*.75);
 let stability;
 if(weak)stability=.5+performance*.5;
 else if(!previous)stability=(rating===1?1.5:3)*(.6+.4*performance);
 else if(!dueForReview)stability=previousStability; // Repeat clicks never inflate the interval.
 else {const recall=Math.exp(Math.log(.9)*elapsed/previousStability);stability=previousStability*(rating===1?1.35:2.1)*(.7+.3*performance)*(1+.3*(1-recall))}
 stability=Math.min(90,Math.max(.5,stability));
 const intervalDays=Math.round(stability*4)/4;
 const due=previous&&!dueForReview&&!weak?previous.at+previous.intervalDays*DAY:now+intervalDays*DAY;
 const reason=weak?'本次有需要重练的反馈，提前巩固':previous&&!dueForReview?'尚未到复习窗口，保留原定安排':previous?'结合本次表现，逐步延长间隔':'先安排一次较早回顾，建立记忆';
 return {stability,intervalDays,due,reason,accuracy,exam,performance,rating};
}
export function intervalLabel(days){return days<1?`${Math.round(days*24)} 小时`:`${Number(days.toFixed(2))} 天`}
export function recordReview(record,confidence,now=Date.now()){
 const plan=reviewSchedule(record,confidence,now);
 const history=Array.isArray(record.reviewHistory)?record.reviewHistory:[];
 // Within an hour this is a correction to the same session, not another review.
 const last=history.at(-1),correction=last&&now-last.at<3600000;
 const entry={at:correction?last.at:now,confidence,intervalDays:plan.intervalDays,accuracy:plan.accuracy??(correction?last.accuracy:null),exam:plan.exam??(correction?last.exam:null)};
 const base=correction?history.slice(0,-1):history;
 return {completed:true,confidence,reviewedAt:now,due:plan.due,stability:plan.stability,reviewHistory:[...base,entry].slice(-60)};
}
