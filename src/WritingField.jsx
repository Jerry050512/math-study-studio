import React,{useEffect,useState} from 'react';
import {PenLine,Type} from 'lucide-react';
import InkPad from './InkPad';
const key='math-studio-writing-mode';
export default function WritingField({docKey,title,value,onChange,placeholder,rows=5}){
 const [mode,Mode]=useState(()=>{try{return localStorage.getItem(key)==='text'?'text':'ink'}catch{return 'ink'}});
 useEffect(()=>{const update=()=>{try{Mode(localStorage.getItem(key)==='text'?'text':'ink')}catch{}};window.addEventListener('writing-mode',update);return()=>window.removeEventListener('writing-mode',update)},[]);
 function select(next){Mode(next);try{localStorage.setItem(key,next)}catch{}window.dispatchEvent(new Event('writing-mode'))}
 return <div className="writing-field"><div className="writing-field-heading"><b>{title}</b><div className="writing-mode" role="group" aria-label={title+'输入方式'}><button aria-pressed={mode==='text'} onClick={()=>select('text')}><Type size={15}/>文字</button><button aria-pressed={mode==='ink'} onClick={()=>select('ink')}><PenLine size={15}/>手写</button></div></div>{mode==='text'?<label className="field-label"><span className="sr-writing">{title}</span><textarea rows={rows} aria-label={title} value={value||''} onChange={e=>onChange(e.target.value)} placeholder={placeholder}/></label>:<InkPad docKey={docKey} title={title+'手写'}/>}</div>;
}
