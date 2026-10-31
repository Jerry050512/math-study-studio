import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
const InkContext=createContext(null);
export const emptyInk=(height=720)=>({width:1000,height,strokes:[]});
let dbPromise;
function database(){return dbPromise??=(new Promise((resolve,reject)=>{const r=indexedDB.open('math-studio-ink',1);r.onupgradeneeded=()=>r.result.createObjectStore('documents',{keyPath:'key'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)}))}
async function transaction(mode,action){const db=await database();return new Promise((resolve,reject)=>{const t=db.transaction('documents',mode);const r=action(t.objectStore('documents'));t.oncomplete=()=>resolve(r?.result);t.onabort=()=>reject(t.error);t.onerror=()=>reject(t.error)})}
export function validateInk(data){
 if(!data||typeof data!=='object'||Array.isArray(data))throw Error('无效的手写数据');
 const clean={};let total=0;
 for(const [key,doc] of Object.entries(data)){
  if(!/^(calculus|applications|linear)-\d{2}:(note|reflection|answer:math2-\d{4}-\d{2})$/.test(key))throw Error('无效的手写位置');
  if(!doc||doc.width!==1000||!Number.isFinite(doc.height)||doc.height<100||doc.height>1000000||!Array.isArray(doc.strokes)||doc.strokes.length>20000)throw Error('无效的手写纸');
  const strokes=doc.strokes.map(s=>{if(!s||!/^#[0-9a-f]{6}$/i.test(s.color)||!Number.isFinite(s.width)||s.width<.1||s.width>60||!Array.isArray(s.points)||!s.points.length)throw Error('无效的笔画');const points=s.points.map(p=>{if(!Array.isArray(p)||p.length<2||!p.slice(0,2).every(Number.isFinite)||p[0]<0||p[0]>1000||p[1]<0||p[1]>doc.height)throw Error('无效的笔迹坐标');if(++total>2000000)throw Error('手写数据过大，请分批导入');return [p[0],p[1]]});return {color:s.color,width:s.width,points}});
  clean[key]={width:1000,height:doc.height,strokes,updatedAt:Number.isFinite(doc.updatedAt)?doc.updatedAt:Date.now()};
 }return clean;
}
export function InkProvider({children}){
 const [docs,Docs]=useState({}),[ready,Ready]=useState(false),[pending,Pending]=useState(0),[error,Error]=useState('');
 const data=useRef({}),queue=useRef(Promise.resolve()),loading=useRef();
 useEffect(()=>{loading.current=transaction('readonly',s=>s.getAll()).then(rows=>{const loaded=Object.fromEntries(rows.map(({key,...doc})=>[key,doc]));data.current=loaded;Docs(loaded)}).catch(()=>Error('手写存储无法打开；请允许此站点保存数据。当前笔迹仍可导出。')).finally(()=>Ready(true))},[]);
 function putBatch(changes,strict=false){
  data.current={...data.current,...changes};Docs(data.current);Pending(n=>n+1);
  queue.current=queue.current.catch(()=>{}).then(()=>transaction('readwrite',s=>{for(const [key,doc] of Object.entries(changes))s.put({key,...doc})})).then(()=>Error('')).catch(e=>{Error('手写未能保存，可能存储空间不足。请立即导出学习记录备份。');if(strict)throw e}).finally(()=>Pending(n=>n-1));
  return queue.current;
 }
 function save(key,doc){putBatch({[key]:{...doc,updatedAt:Date.now()}})}
 async function exportInk(){await loading.current;return data.current}
 async function importInk(value){const clean=validateInk(value);await loading.current;await putBatch(clean,true);}
 const hasInk=id=>Object.entries(docs).some(([key,doc])=>key.startsWith(id+':')&&doc.strokes.length);
 return <InkContext.Provider value={{docs,ready,pending,error,save,exportInk,importInk,hasInk,retry:()=>putBatch(data.current)}}>{children}</InkContext.Provider>;
}
export const useInk=()=>useContext(InkContext);
