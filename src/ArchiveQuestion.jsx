import React,{useEffect,useState} from 'react';
import InkPad from './InkPad';
import CopyQuestion from './CopyQuestion';
const cache=new Map();
export default function ArchiveQuestion({id}){
 const [data,Data]=useState(()=>cache.get(id)),[failed,Failed]=useState(false),[retry,Retry]=useState(0);
 useEffect(()=>{const controller=new AbortController();Data(cache.get(id));Failed(false);if(!cache.has(id))fetch('/questions/'+id+'.json',{signal:controller.signal}).then(r=>{if(!r.ok)throw Error();return r.json()}).then(d=>{if(d.id!==id||typeof d.html!=='string')throw Error();cache.set(id,d);Data(d)}).catch(e=>{if(e.name!=='AbortError')Failed(true)});return()=>controller.abort()},[id,retry]);
 return <div className="native-question"><InkPad key={id} temporary overlay title="题目临时批注"><div className="question-stem archive-question" aria-busy={!data&&!failed}>{data?<div dangerouslySetInnerHTML={{__html:data.html}}/>:failed?<p role="alert">题目暂时未能加载。<button className="text-button" onClick={()=>Retry(x=>x+1)}>重新加载</button></p>:<p role="status">正在载入完整题目…</p>}</div></InkPad>{data&&<><a className="archive-source" href={data.source} target="_blank" rel="noreferrer">网页归档原题 · 查看出处 ↗</a><CopyQuestion data={data}/></>}</div>;
}
