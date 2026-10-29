import {test,expect,chromium} from '@playwright/test';
test('PWA清单、离线全站、题目与本地记录',async({page,context,request})=>{
 const manifest=await (await request.get('/manifest.webmanifest')).json();expect(manifest.display).toBe('standalone');expect(manifest.scope).toBe('/');
 for(const icon of manifest.icons){const r=await request.get(icon.src);expect(r.ok()).toBeTruthy();expect(r.headers()['content-type']).toContain('image/png')}
 await page.goto('/#lesson/calculus-06');
 await page.evaluate(async()=>{const r=await navigator.serviceWorker.ready;if(!navigator.serviceWorker.controller)await new Promise(resolve=>navigator.serviceWorker.addEventListener('controllerchange',resolve,{once:true}));return r.scope});
 await page.getByRole('button',{name:'阅读设置',exact:true}).click();await expect(page.locator('.settings-install')).toContainText('离线内容已就绪');
 for(const [width,height,name] of [[1440,1050,'desktop'],[390,844,'mobile']]){await page.setViewportSize({width,height});await page.locator('.settings-install').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/pwa-settings-${name}.png`,animations:'disabled'});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy()}
 await page.getByRole('button',{name:'关闭阅读设置'}).click();
 const session=await context.newCDPSession(page);const installability=await session.send('Page.getInstallabilityErrors');expect(installability.installabilityErrors.filter(x=>x.errorId!=='in-incognito')).toEqual([]);
 await context.setOffline(true);await page.reload();await expect(page.locator('h1')).toHaveText('由极限证可导');await page.locator('.stage-nav button').nth(3).click();await expect(page.locator('.archive-question .mfrac')).toBeVisible();
 await page.goto('/#lesson/linear-18');await page.reload();await page.locator('.stage-nav button').nth(3).click();await expect(page.locator('.archive-question .katex').first()).toBeVisible();
 await page.locator('.stage-nav button').nth(4).click();await page.getByRole('button',{name:/大致理解/}).click();await expect(page.locator('.completion')).toBeVisible();await page.reload();await expect(page.locator('.completion')).toBeVisible();
 await context.setOffline(false);
});
test('普通浏览器配置满足PWA安装条件',async({},testInfo)=>{
 const context=await chromium.launchPersistentContext(testInfo.outputPath('browser-profile'),{channel:'msedge',headless:true});
 try{const page=await context.newPage();await page.goto((process.env.SITE_URL||'http://127.0.0.1:4173')+'/');await page.evaluate(()=>navigator.serviceWorker.ready.then(()=>true));const session=await context.newCDPSession(page);await expect.poll(async()=>(await session.send('Page.getInstallabilityErrors')).installabilityErrors).toEqual([])}finally{await context.close()}
});
