import {test,expect} from '@playwright/test';
test('无需文字自评、真实首答记录、真题反馈与Zen下一题',async({page})=>{
 await page.goto('/#lesson/calculus-01');
 await page.locator('.quiz-options button').nth(1).click();
 await page.getByRole('button',{name:'重新作答'}).click();await page.locator('.quiz-options button').first().click();
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('math-studio-v1'))['calculus-01'].answerEvidence.warm.correct)).toBe(false);
 await page.locator('.stage-nav button').nth(3).click();await expect(page.locator('.archive-question .katex').first()).toBeVisible();await expect(page.locator('.archive-question img')).toHaveCount(0);
 await page.getByRole('button',{name:'仍需重练',exact:true}).click();
 await page.locator('.stage-nav button').nth(4).click();await expect(page.locator('textarea').first()).toHaveValue('');
 await page.getByRole('button',{name:'能独立解释',exact:false}).click();await expect(page.locator('.completion')).toBeVisible();
 const d=await page.evaluate(()=>JSON.parse(localStorage.getItem('math-studio-v1'))['calculus-01']);expect(d.reviewHistory[0].exam).toBe(0);expect(d.due-d.reviewedAt).toBeLessThan(86400000);
 await page.getByRole('button',{name:'进入 Zen 模式',exact:true}).click();await expect(page.locator('.lesson-next')).toBeVisible();await page.locator('.lesson-next button').click();await expect(page).toHaveURL(/lesson\/calculus-02/);await expect(page.locator('.app')).toHaveClass(/zen-mode/);
});
test('原生公式、重点、160%与自定义字号的手机和桌面',async({page})=>{
 for(const [w,h,name] of [[1440,1050,'desktop'],[390,844,'mobile']]){
  await page.setViewportSize({width:w,height:h});await page.goto('/#lesson/calculus-01');await page.locator('.stage-nav button').nth(1).click();await expect(page.locator('.core-content strong').first()).toBeVisible();
  await page.getByRole('button',{name:'阅读设置',exact:true}).click();await page.getByRole('button',{name:/特大/}).click();await expect(page.locator('.settings-label output')).toHaveText('160%');await page.getByRole('slider',{name:'自定义字号'}).fill('175');await expect(page.locator('.settings-label output')).toHaveText('175%');await page.getByRole('button',{name:'关闭阅读设置'}).click();await page.reload();expect(await page.evaluate(()=>getComputedStyle(document.documentElement).getPropertyValue('--reading-scale').trim())).toBe('1.75');
  await page.locator('.stage-nav button').nth(3).click();await expect(page.locator('.archive-question .katex').first()).toBeVisible();await page.screenshot({path:`test-results/native-question-${name}.png`,fullPage:true,animations:'disabled'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'切换到深色模式'}).click();await page.getByRole('button',{name:'阅读设置',exact:true}).click();await page.getByRole('slider',{name:'自定义字号'}).fill('200');await page.getByRole('button',{name:'关闭阅读设置'}).click();await page.screenshot({path:`test-results/native-dark-${name}.png`,fullPage:true,animations:'disabled'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'切换到浅色模式'}).click();await page.getByRole('button',{name:'阅读设置',exact:true}).click();await page.getByRole('slider',{name:'自定义字号'}).fill('175');await page.getByRole('button',{name:'关闭阅读设置'}).click();
  await page.locator('.stage-nav button').nth(4).click();await page.getByRole('button',{name:'进入 Zen 模式',exact:true}).click();await page.screenshot({path:`test-results/zen-review-${name}.png`,fullPage:true,animations:'disabled'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.getByRole('button',{name:'退出 Zen 模式',exact:true}).click();
 }
});
