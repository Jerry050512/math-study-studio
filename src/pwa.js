let deferred,registration,installed=false;
function changed(){window.dispatchEvent(new Event('math-pwa-change'))}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferred=e;changed()});
window.addEventListener('appinstalled',()=>{deferred=undefined;installed=true;changed()});
export function pwaState(){return {canInstall:!!deferred,installed:installed||matchMedia('(display-mode: standalone)').matches||!!navigator.standalone,offlineReady:!!navigator.serviceWorker?.controller,update:!!registration?.waiting}}
export async function installApp(){if(!deferred)return;const prompt=deferred;deferred=undefined;changed();await prompt.prompt();await prompt.userChoice;changed()}
export function updateApp(){if(!registration?.waiting)return;navigator.serviceWorker.addEventListener('controllerchange',()=>location.reload(),{once:true});registration.waiting.postMessage('ACTIVATE_UPDATE')}
if(import.meta.env.PROD&&'serviceWorker' in navigator){
 navigator.serviceWorker.register('/sw.js',{updateViaCache:'none'}).then(r=>{registration=r;changed();r.addEventListener('updatefound',()=>{r.installing?.addEventListener('statechange',changed)});navigator.serviceWorker.addEventListener('controllerchange',changed)}).catch(()=>{});
}
