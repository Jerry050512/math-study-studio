import {test,expect} from '@playwright/test';
test('旧版KaTeX分式兼容与Zen下一知识点保持上下布局',async({page})=>{
 for(const [width,height,name] of [[1440,1050,'desktop'],[390,844,'mobile']]){
  await page.setViewportSize({width,height});await page.goto('/#lesson/calculus-06');
  if(await page.getByRole('button',{name:'切换到深色模式'}).count())await page.getByRole('button',{name:'切换到深色模式'}).click();
  await page.getByRole('button',{name:'阅读设置',exact:true}).click();await page.getByRole('slider',{name:'自定义字号'}).fill('160');await page.getByRole('button',{name:'关闭阅读设置'}).click();
  await page.locator('.stage-nav button').nth(3).click();await expect(page.locator('.archive-question .mfrac')).toBeVisible();
  const ratio=await page.locator('.archive-question .mfrac .sizing').first().evaluate(e=>parseFloat(getComputedStyle(e).fontSize)/parseFloat(getComputedStyle(e.closest('.katex')).fontSize));expect(ratio).toBeCloseTo(.7,2);
  await expect(page.locator('.archive-question .base:not(.katex-base),.archive-question .strut:not(.katex-strut),.archive-question .sizing:not(.katex-sizing)')).toHaveCount(0);
  await page.locator('.archive-question').screenshot({path:`test-results/fraction-fixed-${name}.png`,animations:'disabled'});
  await page.locator('.stage-nav button').nth(4).click();await page.getByRole('button',{name:'进入 Zen 模式',exact:true}).click();
  const label=await page.locator('.lesson-next>span').boundingBox(),button=await page.locator('.lesson-next>button').boundingBox();expect(button.y).toBeGreaterThanOrEqual(label.y+label.height);expect(Math.abs(button.x-label.x)).toBeLessThan(2);
  await page.locator('.lesson-next').screenshot({path:`test-results/next-fixed-${name}.png`,animations:'disabled'});await page.locator('.lesson-next button').click();await expect(page).toHaveURL(/calculus-07/);await expect(page.locator('.app')).toHaveClass(/zen-mode/);await page.getByRole('button',{name:'退出 Zen 模式',exact:true}).click();
 }
});
