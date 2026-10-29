import React from 'react';
import {CheckCircle2} from 'lucide-react';
import {reviewSchedule,recordReview,intervalLabel} from './reviewSchedule';
export function QuestionFeedback({id,record,update}){
 const selected=record.questionFeedback?.[id];
 return <fieldset className="question-feedback"><legend>这道真题，独立完成得怎样？</legend><p>对照自己的推导记录，不会自动判分。反馈将参与下次复习安排。</p><div>{[['independent','独立做对'],['partial','借助提示完成'],['relearn','仍需重练']].map(([value,label])=><button key={value} className="secondary" aria-pressed={selected===value} onClick={()=>update({questionFeedback:{...record.questionFeedback,[id]:value},questionFeedbackAt:{...record.questionFeedbackAt,[id]:Date.now()}})}>{label}</button>)}</div></fieldset>;
}
export function SelfAssessment({record,update,notify}){
 return <div className="self-assess"><h3>这一次，你理解到了哪一步？</h3><p>可以在心里复述、在纸上推导，或直接选择自评。文字复盘选填，答错也能记录。</p><div>{['需要重学','大致理解','能独立解释'].map(c=>{const p=reviewSchedule(record,c);return <button className="secondary" key={c} onClick={()=>{const patch=recordReview(record,c);update(patch);notify(`已记录，${new Date(patch.due).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})} 再回顾。`)}}><b>{c}</b><span>{intervalLabel(Math.max(0,(p.due-Date.now())/86400000))}后回顾</span></button>})}</div>{record.completed&&<p className="completion"><CheckCircle2 size={17}/>已记录：{record.confidence} · 下次回顾 {new Date(record.due).toLocaleString('zh-CN',{month:'numeric',day:'numeric',hour:'2-digit',minute:'2-digit'})}</p>}<details className="schedule-explanation"><summary>复习时间怎样安排？</summary><p>参考间隔重复与指数遗忘模型，以预计记忆保持率 90% 为安排目标。首次回顾较早；到期后稳定掌握会逐步延长间隔，答错或真题需要重练会缩短间隔。未做的练习不计为错误。</p><p>综合自评、两道理解选择题的首次作答正确率、各道真题的自报完成情况。短时间重复自评不会延长间隔。这是启发式训练建议，尚未用你的长期学习数据校准。</p><p>{reviewSchedule(record,record.confidence||'大致理解').reason}。</p></details></div>;
}
