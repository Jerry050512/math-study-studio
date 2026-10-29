import {test,expect} from '@playwright/test';
import fs from 'node:fs';
const lessons=JSON.parse(fs.readFileSync(new URL('../src/data/lessons.json',import.meta.url),'utf8'));
test('完整学习路径、笔记持久化与复习安排',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('/');await expect(page.locator('h1')).toContainText('让每一道题');
 await page.getByRole('button',{name:'开始第一个知识点'}).click();
 await page.locator('.quiz-options button').first().click();await expect(page.locator('.quiz-feedback')).toBeVisible();
 await page.getByRole('button',{name:'理解条件',exact:false}).last().click();
 await page.locator('.quiz-options button').first().click();await expect(page.locator('.quiz-feedback')).toContainText('思路正确');
 await page.getByRole('button',{name:'推演流程',exact:false}).last().click();await expect(page.locator('.process-step')).toHaveCount(4);
 await page.getByRole('button',{name:'真题应用',exact:false}).last().click();
 await expect(page.locator('.question-stem .katex').first()).toBeVisible();await expect(page.locator('.question-stem img')).toHaveCount(0);
 await page.getByPlaceholder('我注意到的结构是……因此第一步是……').fill('先读积分上限，再把被积函数的首项写出来。');
 await page.getByRole('button',{name:'提示一：识别信号'}).click();await expect(page.locator('.hint')).toBeVisible();
 await page.getByRole('button',{name:'查看原笔记读题演示'}).click();await expect(page.locator('.solution')).toContainText('同阶但非等价');
 await page.getByRole('button',{name:'解释复盘',exact:false}).last().click();
 await page.getByPlaceholder('不照抄公式。试着把识别信号、关键条件和推演过程联系起来……').fill('先找被积函数首个非零项，积分使指数加一，再将复合上限代入，同时保留系数，用比值验证阶数。');
 await page.getByRole('button',{name:'能独立解释'}).click();await expect(page.locator('.completion')).toBeVisible();
 await page.reload();await expect(page.locator('.completion')).toBeVisible();
 await page.goto('/#notes');await expect(page.locator('.note-entry')).toHaveCount(1);await expect(page.locator('.note-entry')).toContainText('首个非零项');
 expect(errors).toEqual([]);
});
test('全部70单元公式与题干均可用',async({page,request})=>{
 const failures=[];await page.goto('/');
 for(const l of lessons){await page.goto('/#lesson/'+l.id);await page.locator('.stage-nav button').nth(1).click();let m=await page.locator('.math-error').allTextContents();if(m.length)failures.push({id:l.id,math:m});await page.locator('.stage-nav button').nth(3).click();for(let i=0;i<l.questions.length;i++){if(i)await page.locator('.lesson-body .tabs button').nth(i).click();await expect(page.locator('.archive-question .katex').first()).toBeVisible();await page.getByRole('button',{name:'查看原笔记读题演示'}).click();m=await page.locator('.math-error').allTextContents();if(m.length)failures.push({id:l.id,solution:m});const response=await request.get('/questions/'+l.questions[i].id+'.json');expect(response.ok()).toBeTruthy();expect((await response.json()).id).toBe(l.questions[i].id);}}
 expect(failures).toEqual([]);
});
test('桌面与手机页面、实验与布局',async({page})=>{
 for(const [width,height,name] of [[1440,1050,'desktop'],[390,844,'mobile']]){
  await page.setViewportSize({width,height});await page.goto('/');await page.screenshot({path:`test-results/home-${name}.png`,fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.goto('/#lesson/calculus-01');await page.locator('.stage-nav button').nth(1).click();await page.screenshot({path:`test-results/lesson-${name}.png`,fullPage:true});
  expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.goto('/#labs');for(let i=0;i<6;i++){await page.locator('.lab-tabs button').nth(i).click();await expect(page.locator('.lab-work')).toBeVisible();await expect(page.locator('.math-error')).toHaveCount(0);const range=page.locator('input[type=range]').first();if(await range.count()){await range.fill(i===0?'5':i===1?'1':i===2?'3':i===3?'1.5':'50');}expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();}
  await page.screenshot({path:`test-results/lab-${name}.png`,fullPage:true});
  await page.goto('/#reference');for(let i=0;i<3;i++){await page.locator('.reference-tabs button').nth(i).click();await expect(page.locator('.table-scroll').first()).toBeVisible();await expect(page.locator('.math-error')).toHaveCount(0);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();}
 }
});
