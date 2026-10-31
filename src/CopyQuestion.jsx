import React,{useState} from 'react';
import {Copy,Check,X} from 'lucide-react';
import './copy.css';
export default function CopyQuestion({data}){
 const [open,Open]=useState(false),[copied,Copied]=useState(false),[message,Message]=useState('');
 const value=`${data.id} 真题\n\n${data.latex||''}\n\n出处：${data.source}`;
 async function copy(){Copied(false);Message('');try{if(navigator.clipboard&&isSecureContext){await navigator.clipboard.writeText(value);Copied(true);return}}catch{}Open(true);Message('请选择下面的文字复制；局域网 HTTP 可能不允许直接写入剪贴板。')}
 function fallback(e){const area=e.currentTarget.closest('.question-copy-panel').querySelector('textarea');area.focus();area.select();try{if(document.execCommand('copy')){Copied(true);Message('已复制。')}else Message('文字已选中，请长按选择复制，或按 Ctrl/Cmd C。')}catch{Message('文字已选中，请长按选择复制，或按 Ctrl/Cmd C。')}}
 return <div className="question-copy"><button className="text-button" onClick={copy} aria-label="复制真题为LaTeX">{copied?<Check size={15}/>:<Copy size={15}/>} {copied?'已复制':'复制题目 · LaTeX'}</button><button className="text-button" onClick={()=>Open(!open)} aria-expanded={open}>查看复制文本</button>{open&&<div className="question-copy-panel"><div><b>题目分享文本</b><button className="icon-button" aria-label="关闭复制文本" onClick={()=>Open(false)}><X size={16}/></button></div><p>公式由归档结构转换，请核对原题；复制不包含你的笔迹。</p><textarea readOnly aria-label="题目LaTeX文本" value={value} rows="7"/><button className="secondary" onClick={fallback}>选中并复制</button><p role="status">{message}</p></div>}</div>;
}
