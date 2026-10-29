import {readdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const assets=(await readdir('dist/assets')).filter(x=>/\.(js|css|woff2|woff|ttf)$/.test(x)).map(x=>'/assets/'+x);
const questions=(await readdir('dist/questions')).filter(x=>x.endsWith('.json')).map(x=>'/questions/'+x);
const urls=['/','/manifest.webmanifest','/favicon.svg','/icons/icon-192.png','/icons/icon-512.png','/icons/maskable-512.png','/icons/apple-touch-icon.png',...assets,...questions].sort();
const hash=createHash('sha256');for(const url of urls)hash.update(await readFile('dist'+(url==='/'?'/index.html':url)));
const revision=hash.digest('hex').slice(0,16);
const sw=`const CACHE='math-studio-${revision}';
const FILES=${JSON.stringify(urls)};
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 // Four workers keep installation bounded on mobile connections.
 let index=0;await Promise.all(Array.from({length:4},async()=>{while(index<FILES.length){const url=FILES[index++];const response=await fetch(new Request(url,{cache:'reload'}));if(!response.ok)throw Error('Precache failed');await cache.put(url,response)}}));
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('math-studio-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('message',event=>{if(event.data==='ACTIVATE_UPDATE')self.skipWaiting()});
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||new URL(event.request.url).origin!==self.location.origin)return;
 event.respondWith((async()=>{const cache=await caches.open(CACHE);
 // Serve the shell from the same release as its assets, including while offline.
 if(event.request.mode==='navigate'&&new URL(event.request.url).pathname==='/')return (await cache.match('/'))||fetch(event.request);
 const cached=await cache.match(event.request,{ignoreVary:true});if(cached)return cached;
 return fetch(event.request);
 })());
});`;
await writeFile('dist/sw.js',sw);
console.log(`PWA: ${urls.length} files precached, revision ${revision}`);
