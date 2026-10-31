import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import {PenLine,Eraser,Undo2,Redo2,Plus,Download,Trash2,ChevronUp,ChevronDown} from 'lucide-react';
import {emptyInk,useInk} from './inkStore';
import {pathFor,touchesStroke,inkSvg,downloadFile} from './inkGeometry';
import './ink.css';
import SelectMenu from './SelectMenu';
const colors=[['#253b35','墨黑'],['#285fa0','蓝色'],['#b43d3d','红色'],['#39754d','绿色']];
 function loadTools(){const defaults={color:'#253b35',width:4,tool:'pen',dock:'follow'};try{const d=JSON.parse(localStorage.getItem('math-studio-pen-tools'))||{};return {color:colors.some(x=>x[0]===d.color)?d.color:defaults.color,width:[2,4,7].includes(d.width)?d.width:4,tool:d.tool==='eraser'?'eraser':'pen',dock:['follow','top','bottom','right'].includes(d.dock)?d.dock:'follow'}}catch{return defaults}}
export default function InkPad({docKey,title='手写',temporary=false,overlay=false,children}){
 const store=useInk(),[temp,Temp]=useState(()=>emptyInk()),[tools,Tools]=useState(loadTools),[mouse,Mouse]=useState(false),[collapsed,Collapsed]=useState(false),[armed,Armed]=useState(!overlay),[undo,Undo]=useState([]),[redo,Redo]=useState([]),[tick,Tick]=useState(0),[clear,Clear]=useState(false),[paperMessage,PaperMessage]=useState('');
 const host=useRef(),svg=useRef(),live=useRef(),gesture=useRef(),docRef=useRef(),finishRef=useRef(),[overlayHeight,Height]=useState(200),[visible,Visible]=useState(false);
 const doc=temporary?temp:store.docs[docKey]||emptyInk();docRef.current=doc;
 const height=overlay?overlayHeight:doc.height;
 useEffect(()=>{try{localStorage.setItem('math-studio-pen-tools',JSON.stringify(tools))}catch{}},[tools]);
 useEffect(()=>{if(!host.current)return;const o=new IntersectionObserver(([e])=>Visible(e.isIntersecting),{threshold:0});o.observe(host.current);return()=>o.disconnect()},[]);
 useLayoutEffect(()=>{if(!overlay)return;const content=host.current?.querySelector('.ink-underlay');if(!content)return;const observer=new ResizeObserver(()=>{const box=content.getBoundingClientRect();if(box.width)Height(Math.max(100,box.height*1000/box.width))});observer.observe(content);return()=>observer.disconnect()},[overlay]);
 useEffect(()=>{const flush=()=>finishRef.current?.();window.addEventListener('blur',flush);const visibility=()=>{if(document.hidden)flush()};document.addEventListener('visibilitychange',visibility);return()=>{flush();window.removeEventListener('blur',flush);document.removeEventListener('visibilitychange',visibility)}},[docKey]);
 function persist(next){docRef.current=next;temporary?Temp(next):store.save(docKey,next)}
 function commit(next,base=docRef.current){Undo(u=>[...u.slice(-29),base]);Redo([]);persist(next)}
 function point(e){const b=svg.current.getBoundingClientRect();return [Math.round(Math.max(0,Math.min(1000,(e.clientX-b.left)*1000/b.width))*10)/10,Math.round(Math.max(0,Math.min(height,(e.clientY-b.top)*height/b.height))*10)/10]}
 function eraseMode(e){return tools.tool==='eraser'||(e.buttons&2)!==0||(e.buttons&32)!==0||e.button===5}
 function begin(e){
  if(!armed||(!temporary&&!store.ready)||gesture.current||e.pointerType==='touch'||e.pointerType!=='pen'&&!(mouse&&e.pointerType==='mouse'))return;
  e.preventDefault();svg.current.style.touchAction='none';try{svg.current.setPointerCapture?.(e.pointerId)}catch{}
  const p=point(e);gesture.current={id:e.pointerId,base:docRef.current,working:docRef.current,points:[],last:p,erase:false};
  step(e,p);
 }
 function strokeSegment(g){if(!g.points.length)return;g.working={...g.working,strokes:[...g.working.strokes,{color:tools.color,width:tools.width,points:g.points}]};g.points=[]}
 function paintLive(g){live.current?.setAttribute('d',pathFor(g.points));}
 function step(e,p){const g=gesture.current;if(!g)return;
  const erasing=eraseMode(e);
  if(erasing){if(g.points.length){strokeSegment(g);Tick(t=>t+1)}g.working={...g.working,strokes:g.working.strokes.filter(s=>!touchesStroke(s,g.last,p,18))};Tick(t=>t+1)}
  else {if(g.erase)g.points=[];const last=g.points.at(-1);if(!last||Math.hypot(last[0]-p[0],last[1]-p[1])>.6)g.points.push(p)}
  g.erase=erasing;g.last=p;paintLive(g);
 }
 function move(e){const g=gesture.current;if(!g||g.id!==e.pointerId)return;e.preventDefault();const events=e.nativeEvent.getCoalescedEvents?.()||[e];for(const sample of events.length?events:[e])step({buttons:sample.buttons??e.buttons,button:sample.button??e.button},point(sample))}
 function finish(e){const g=gesture.current;if(!g||e&&g.id!==e.pointerId)return;strokeSegment(g);gesture.current=null;live.current?.setAttribute('d','');if(!overlay&&g.last[1]>g.working.height-70)g.working={...g.working,height:g.working.height+240};if(g.working.strokes!==g.base.strokes)commit(g.working,g.base);Tick(t=>t+1);}
 finishRef.current=finish;
 function history(direction){finish();const list=direction==='undo'?undo:redo;if(!list.length)return;const next=list.at(-1),current=docRef.current;if(direction==='undo'){Undo(list.slice(0,-1));Redo(r=>[...r,current])}else{Redo(list.slice(0,-1));Undo(u=>[...u,current])}persist(next)}
 const shown=gesture.current?.working||doc;
 function shrink(){const next=Math.max(240,doc.height-240);if(doc.strokes.some(s=>s.points.some(p=>p[1]+s.width/2>next))){PaperMessage('下方还有笔迹，不能缩减。请先擦除或撤销相关笔迹。');return}PaperMessage('已收回下方空白空间。');commit({...doc,height:next})}
 const dock=tools.dock==='right'?'right':tools.dock;
 return <section ref={host} className={`ink-pad ink-dock-${dock} ${overlay?'ink-overlay-pad':''} ${armed?'ink-armed':''} ${visible?'ink-visible':''}`} aria-label={title} data-ink-key={docKey||'temporary'}>
  <div className="ink-heading"><div><b>{title}</b><span>{temporary?'临时批注 · 离开此环节即清除':!store.ready?'正在读取手写…':store.error?'未保存 · 请导出备份':store.pending?'保存中…':'本机自动保存'}</span></div><div className="ink-heading-actions">{overlay&&<button className="text-button" aria-pressed={armed} onClick={()=>{finish();Armed(!armed)}}>{armed?'结束批注':'在题目上写画'}</button>}{!overlay&&<button className="icon-button" aria-label={collapsed?'展开手写纸':'收起手写纸'} onClick={()=>{finish();Collapsed(!collapsed)}}>{collapsed?<ChevronDown size={17}/>:<ChevronUp size={17}/>}</button>}</div></div>
  {store.error&&!temporary&&<p className="ink-error" role="alert">{store.error}<button className="text-button" onClick={store.retry}>重试保存</button></p>}
  {!collapsed&&<div className="ink-layout">
   {armed&&<div className="ink-tools-slot"><div className="ink-toolbar" role="toolbar" aria-label={`${title}工具栏`}>
    <div className="ink-tool-group"><button aria-label="画笔" aria-pressed={tools.tool==='pen'} onClick={()=>Tools({...tools,tool:'pen'})}><PenLine size={18}/></button><button aria-label="橡皮（整笔擦除）" aria-pressed={tools.tool==='eraser'} onClick={()=>Tools({...tools,tool:'eraser'})}><Eraser size={18}/></button></div>
    <div className="ink-tool-group ink-colors">{colors.map(([color,label])=><button key={color} aria-label={label} aria-pressed={tools.color===color} onClick={()=>Tools({...tools,color,tool:'pen'})}><i style={{background:color}}/></button>)}</div>
    <div className="ink-thickness"><span>粗细</span><SelectMenu label="笔画粗细" value={tools.width} onChange={width=>Tools({...tools,width})} options={[{value:2,label:'细'},{value:4,label:'中'},{value:7,label:'粗'}]}/></div>
    <div className="ink-tool-group"><button aria-label="撤销" disabled={!undo.length} onClick={()=>history('undo')}><Undo2 size={18}/></button><button aria-label="重做" disabled={!redo.length} onClick={()=>history('redo')}><Redo2 size={18}/></button></div>
    <div className="ink-docking"><span>位置</span><SelectMenu label="工具栏位置" value={tools.dock} onChange={dock=>Tools({...tools,dock})} options={[{value:'follow',label:'跟随'},{value:'top',label:'上侧'},{value:'bottom',label:'下侧'},{value:'right',label:'右侧'}]}/></div>
    <details className="ink-more"><summary>更多</summary><div><label><input type="checkbox" checked={mouse} onChange={e=>Mouse(e.target.checked)}/>鼠标试写（手指仍只滚动）</label><button onClick={()=>downloadFile(inkSvg(doc),'image/svg+xml',title+'.svg')} disabled={!doc.strokes.length}><Download size={15}/>导出此页 SVG</button><button onClick={()=>Clear(!clear)} disabled={!doc.strokes.length} aria-expanded={clear}><Trash2 size={15}/>清空笔迹</button>{clear&&<div className="ink-clear-confirm" role="group" aria-label="确认清空"><span>清空此处所有笔迹？可以撤销。</span><button className="secondary" onClick={()=>{commit({...doc,strokes:[]});Clear(false)}}>确认清空</button><button className="text-button" onClick={()=>Clear(false)}>取消</button></div>}<p>默认只响应笔；侧键 / 笔尾橡皮需设备和浏览器上报。橡皮擦除整笔，可撤销。</p></div></details>
   </div></div>}
   <div className="ink-paper-column"><div className={`ink-paper ${overlay?'ink-over-content':''}`}>
    {overlay&&<div className="ink-underlay">{children}</div>}
    {(!overlay||armed||shown.strokes.length>0)&&<svg ref={svg} className="ink-surface" viewBox={`0 0 1000 ${height}`} style={overlay?undefined:{aspectRatio:`1000 / ${height}`}} role="img" aria-label={`${title}书写区，仅手写笔输入`} onPointerOver={e=>{if(!gesture.current)svg.current.style.touchAction=e.pointerType==='pen'||mouse&&e.pointerType==='mouse'?'none':'pan-y'}} onPointerDown={begin} onPointerMove={move} onPointerUp={finish} onPointerCancel={finish} onLostPointerCapture={finish} onContextMenu={e=>{if(armed)e.preventDefault()}}>
     {shown.strokes.map((s,i)=><path key={i} d={pathFor(s.points)} stroke={s.color} strokeWidth={s.width} fill="none" strokeLinecap="round" strokeLinejoin="round"/>)}
     <path ref={live} stroke={tools.color} strokeWidth={tools.width} fill="none" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>}
    {!overlay&&!shown.strokes.length&&<div className="ink-empty"><PenLine size={22}/><span>用 S Pen 写下你的推导</span><small>手指滚动页面 · 笔写字</small></div>}
   </div>
   {!overlay&&<div className="ink-extend"><span role="status">{paperMessage||'每次增减一小段空白，不会裁掉已有笔迹'}</span><div><button className="secondary" disabled={doc.height<=240} onClick={shrink}>减少空间</button><button className="secondary" onClick={()=>{PaperMessage('');commit({...doc,height:doc.height+240})}}><Plus size={16}/>增加书写空间</button></div></div>}
   </div>
  </div>}
 </section>;
}
