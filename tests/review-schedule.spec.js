import {test,expect} from '@playwright/test';
import {reviewSchedule,recordReview,DAY} from '../src/reviewSchedule';
const now=1800000000000;
const evidence={answerEvidence:{warm:{correct:true,at:now-1},quiz:{correct:true,at:now-1}},questionFeedback:{q:'independent'}};
test('复习间隔结合自评、首次选择与真题反馈，允许未答题',()=>{
 const good=reviewSchedule(evidence,'能独立解释',now);
 expect(good.intervalDays).toBe(3);
 expect(reviewSchedule(evidence,'需要重学',now).intervalDays).toBeLessThan(good.intervalDays);
 const wrong={...evidence,answerEvidence:{warm:{correct:false,at:now-1},quiz:{correct:false,at:now-1}}};
 expect(reviewSchedule(wrong,'能独立解释',now).intervalDays).toBeLessThan(good.intervalDays);
 expect(reviewSchedule({...evidence,questionFeedback:{q:'relearn'}},'能独立解释',now).intervalDays).toBeLessThan(good.intervalDays);
 expect(reviewSchedule({},'大致理解',now).due).toBeGreaterThan(now);
});
test('到期成功回忆延长间隔、失败缩短、旧错误不永久惩罚、重复点击不膨胀',()=>{
 const completed=recordReview(evidence,'能独立解释',now);
 const repeat=recordReview({...evidence,...completed},'能独立解释',now+60000);
 expect(repeat.due).toBe(completed.due);expect(repeat.reviewHistory).toHaveLength(1);
 const later=now+3*DAY;
 const fresh={...completed,answerEvidence:{warm:{correct:true,at:later-1},quiz:{correct:true,at:later-1}},questionFeedback:{q:'independent'},questionFeedbackAt:{q:later-1}};
 expect(reviewSchedule(fresh,'能独立解释',later).intervalDays).toBeGreaterThan(3);
 expect(reviewSchedule(fresh,'需要重学',later).intervalDays).toBeLessThan(3);
 const oldWrong={...completed,answerEvidence:{warm:{correct:false,at:now-1}},questionFeedback:{q:'relearn'},questionFeedbackAt:{q:now-1}};
 expect(reviewSchedule(oldWrong,'能独立解释',later).intervalDays).toBeGreaterThan(3);
});
