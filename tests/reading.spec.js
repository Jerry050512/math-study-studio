import {test,expect} from '@playwright/test';

test('阅读偏好保存、搜索、Zen 与退出',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/#lesson/calculus-01');
 await page.getByRole('button',{name:'切换到深色模式'}).click();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');
 await page.getByRole('button',{name:'阅读设置',exact:true}).click();await page.getByRole('button',{name:'大号',exact:true}).click();await expect(page.locator('.settings-label output')).toHaveText('120%');await page.getByRole('button',{name:'关闭阅读设置'}).click();
 await page.locator('.stage-nav button').nth(1).click();const regular=await page.locator('.core-content .rich').evaluate(e=>parseFloat(getComputedStyle(e).fontSize));expect(regular).toBeCloseTo(16.8,1);
 await page.reload();await expect(page.locator('html')).toHaveAttribute('data-theme','dark');expect(await page.locator('.core-content .rich').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeCloseTo(16.8,1);
 await page.getByRole('button',{name:'进入 Zen 模式',exact:true}).click();await expect(page.locator('.app')).toHaveClass(/zen-mode/);await expect(page.locator('.sidebar')).toBeHidden();await expect(page.locator('.lesson-margin')).toBeHidden();expect(await page.locator('.core-content .rich').evaluate(e=>parseFloat(getComputedStyle(e).fontSize))).toBeGreaterThan(regular);
 await page.getByRole('button',{name:'阅读设置',exact:true}).filter({visible:true}).click();await page.keyboard.press('Escape');await expect(page.locator('.reading-settings')).toHaveCount(0);await expect(page.locator('.app')).toHaveClass(/zen-mode/);
 await page.locator('.zen-bar').getByRole('button',{name:/笔记/}).click();await expect(page.locator('.note-drawer')).toBeVisible();await page.keyboard.press('Escape');await expect(page.locator('.note-drawer')).toHaveCount(0);await expect(page.locator('.app')).toHaveClass(/zen-mode/);
 await page.keyboard.press('Escape');await expect(page.locator('.app')).not.toHaveClass(/zen-mode/);await expect(page.locator('.sidebar')).toBeVisible();
 await page.keyboard.press('Control+k');await expect(page.getByRole('textbox',{name:'搜索知识点',exact:true})).toBeFocused();await page.getByRole('textbox',{name:'搜索知识点',exact:true}).fill('伴随');await expect(page.locator('.lesson-row').first()).toBeVisible();
 expect(errors).toEqual([]);
});

test('系统主题响应与减少动态效果',async({page})=>{
 await page.emulateMedia({colorScheme:'dark',reducedMotion:'reduce'});await page.goto('/#lesson/calculus-01');await expect(page.locator('html')).toHaveAttribute('data-theme','dark');await page.emulateMedia({colorScheme:'light'});await expect(page.locator('html')).toHaveAttribute('data-theme','light');await page.locator('.stage-nav button').nth(1).click();expect(await page.locator('main').evaluate(e=>e.getAnimations().length)).toBe(0);await page.getByRole('button',{name:'阅读设置',exact:true}).click();expect(await page.locator('.reading-settings').evaluate(e=>e.getAnimations().length)).toBe(0);
});

test('深色、大字与Zen的桌面手机视觉检查',async({page})=>{
 for(const [width,height,name] of [[1440,1050,'desktop'],[390,844,'mobile']]){
  await page.setViewportSize({width,height});await page.goto('/#lesson/calculus-01');
  if(await page.getByRole('button',{name:'切换到深色模式'}).count())await page.getByRole('button',{name:'切换到深色模式'}).click();
  await page.locator('.stage-nav button').nth(1).click();await page.getByRole('button',{name:'阅读设置',exact:true}).click();await page.getByRole('button',{name:'特大',exact:true}).click();await page.waitForTimeout(220);
  await page.screenshot({path:`test-results/reading-dark-${name}.png`,fullPage:true,animations:'disabled'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();await page.getByRole('button',{name:'关闭阅读设置'}).click();
  await page.getByRole('button',{name:'进入 Zen 模式',exact:true}).click();await page.waitForTimeout(220);await page.screenshot({path:`test-results/reading-zen-${name}.png`,fullPage:true,animations:'disabled'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();
  await page.getByRole('button',{name:'退出 Zen 模式',exact:true}).click();
  for(const route of ['home','library','labs','notes','review','reference','sources']){await page.goto('/#'+route);await expect(page.locator('main')).toBeVisible();expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();}
  await page.goto('/#home');await page.waitForTimeout(220);await page.screenshot({path:`test-results/reading-home-${name}.png`,fullPage:true,animations:'disabled'});
 }
});
