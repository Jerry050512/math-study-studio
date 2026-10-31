import React,{useState} from 'react';
import {ArrowUpRight,PenLine} from 'lucide-react';
import {useInk} from './inkStore';
import InkPad from './InkPad';
function InkEntry({docKey,title}){const [open,Open]=useState(false);return <details className="ink-preview" open={open} onToggle={e=>Open(e.currentTarget.open)}><summary>{title}</summary>{open&&<InkPad docKey={docKey} title={title}/>}</details>}
export default function InkNotebook({lessons,record,go}){
 const ink=useInk();const found=lessons.filter(l=>record[l.id]?.note||record[l.id]?.reflection||record[l.id]?.draft||ink.hasInk(l.id));
 if(!ink.ready)return <p role="status">正在读取笔记与手写…</p>;
 if(!found.length)return <div className="empty"><PenLine size={30}/><h2>给自己的思考留一个位置</h2><p>文字笔记、推导、复盘与手写会汇集在这里。</p></div>;
 return found.map(l=><article className="note-entry" key={l.id}><button onClick={()=>go('lesson',l.id)}><h2>{l.title}</h2><ArrowUpRight size={18}/></button>{['note','reflection','draft'].map((key,i)=>record[l.id]?.[key]&&<div key={key}><h3>{['随手笔记','自己的解释','真题思路'][i]}</h3><p>{record[l.id][key]}</p></div>)}{Object.entries(ink.docs).filter(([key,doc])=>key.startsWith(l.id+':')&&doc.strokes.length).map(([key,doc])=><InkEntry key={key} docKey={key} title={key.endsWith(':note')?'随手笔记 · 手写':key.endsWith(':reflection')?'解释复盘 · 手写':'真题 '+key.split(':')[2].replace('math2-','')+' · 手写答题'}/>)}</article>);
}
