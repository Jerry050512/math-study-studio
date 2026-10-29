import React,{useEffect,useRef,useState,useLayoutEffect} from 'react';
import {Moon,Sun,SlidersHorizontal,Focus,Minimize2,X,Monitor} from 'lucide-react';
import InstallApp from './InstallApp';

const key='math-studio-reading-v1';
function load(){try{const d=JSON.parse(localStorage.getItem(key))||{};return {theme:['light','dark','system'].includes(d.theme)?d.theme:'system',size:Number.isFinite(d.size)&&d.size>=1&&d.size<=2?d.size:1,zen:!!d.zen}}catch{return {theme:'system',size:1,zen:false}}}
export function useReadingPreferences(){
 const [prefs,setPrefs]=useState(load),[systemDark,SystemDark]=useState(()=>matchMedia('(prefers-color-scheme: dark)').matches);
 const dark=prefs.theme==='dark'||prefs.theme==='system'&&systemDark;
 useEffect(()=>{const media=matchMedia('(prefers-color-scheme: dark)'),listener=e=>SystemDark(e.matches);media.addEventListener('change',listener);return()=>media.removeEventListener('change',listener)},[]);
 useLayoutEffect(()=>{document.documentElement.dataset.theme=dark?'dark':'light';document.documentElement.style.setProperty('--reading-scale',prefs.size);document.documentElement.style.colorScheme=dark?'dark':'light';document.querySelector('meta[name="theme-color"]')?.setAttribute('content',dark?'#15231e':'#244f46')},[dark,prefs.size]);
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(prefs))}catch{}},[prefs]);
 return {prefs,dark,setPrefs:patch=>setPrefs(p=>({...p,...patch}))};
}
export function softReveal(element){
 if(!element||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 element.getAnimations().forEach(a=>a.cancel());
 element.animate([{opacity:.82,transform:'translateY(3px)'},{opacity:1,transform:'translateY(0)'}],{duration:170,easing:'cubic-bezier(.16,1,.3,1)'});
}
export default function ReadingPreferences({prefs,dark,setPrefs,onZen,zenActive=false}){
 const [open,Open]=useState(false),host=useRef(),trigger=useRef(),panel=useRef();
 useEffect(()=>{if(!open)return;const outside=e=>{if(!host.current?.contains(e.target))Open(false)};const keydown=e=>{if(e.key==='Escape'){e.stopPropagation();Open(false);trigger.current?.focus()}};document.addEventListener('pointerdown',outside);document.addEventListener('keydown',keydown,true);return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',keydown,true)}},[open]);
 useLayoutEffect(()=>{if(open)softReveal(panel.current)},[open]);
 return <div className="reading-tools" ref={host}>
  <button className="icon-button theme-toggle" aria-label={dark?'切换到浅色模式':'切换到深色模式'} title={dark?'浅色模式':'深色模式'} onClick={()=>setPrefs({theme:dark?'light':'dark'})}>{dark?<Sun size={18}/>:<Moon size={18}/>}</button>
  <button className={'icon-button '+(open?'tool-active':'')} ref={trigger} aria-label="阅读设置" title="字号与阅读设置" aria-expanded={open} aria-controls="reading-settings" onClick={()=>Open(!open)}><SlidersHorizontal size={18}/></button>
  <button className={'icon-button zen-toggle '+(zenActive?'tool-active':'')} aria-label={zenActive?'退出 Zen 模式':'进入 Zen 模式'} title={zenActive?'退出专注（Esc）':'Zen 专注模式'} onClick={()=>{Open(false);onZen()}}>{zenActive?<Minimize2 size={18}/>:<Focus size={18}/>}</button>
  {open&&<section className="reading-settings" id="reading-settings" aria-label="阅读设置" ref={panel}><div className="settings-heading"><h2>阅读设置</h2><button className="icon-button" aria-label="关闭阅读设置" onClick={()=>{Open(false);trigger.current?.focus()}}><X size={16}/></button></div>
   <div className="settings-group"><h3>外观</h3><div className="theme-options">{[['light',Sun,'浅色'],['dark',Moon,'深色'],['system',Monitor,'跟随系统']].map(([value,Icon,label])=><button key={value} className={prefs.theme===value?'selected':''} aria-pressed={prefs.theme===value} onClick={()=>setPrefs({theme:value})}><Icon size={15}/>{label}</button>)}</div></div>
   <div className="settings-group"><div className="settings-label"><h3>文字大小</h3><output aria-live="polite">{Math.round(prefs.size*100)}%</output></div><div className="font-options">{[[1,'标准'],[1.2,'舒适'],[1.4,'大号'],[1.6,'特大']].map(([value,label])=><button key={value} aria-pressed={prefs.size===value} className={prefs.size===value?'selected':''} onClick={()=>setPrefs({size:value})}><span>{label}<small>{Math.round(value*100)}%</small></span></button>)}</div><label className="font-slider">自定义字号<input type="range" min="100" max="200" step="5" value={Math.round(prefs.size*100)} aria-label="自定义字号" aria-valuetext={Math.round(prefs.size*100)+'%'} onChange={e=>setPrefs({size:Number(e.target.value)/100})}/></label><div className="slider-bounds"><span>100%</span><span>200%</span></div><p>正文、公式和练习会一起缩放。</p></div>
   <div className="settings-zen"><Focus size={18}/><div><h3>Zen 专注模式</h3><p>收起辅助界面，正文默认大一号。<br/>按 Esc 随时退出。</p></div><button className="text-button" onClick={()=>{Open(false);onZen()}}>{zenActive?'退出':'进入'}</button></div>
   <InstallApp/>
  </section>}
 </div>
}
