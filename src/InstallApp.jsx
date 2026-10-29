import React,{useEffect,useState} from 'react';
import {Download} from 'lucide-react';
import {pwaState,installApp,updateApp} from './pwa';
import './pwa.css';
export default function InstallApp(){
 const [state,State]=useState(pwaState),[error,Error]=useState(false);
 useEffect(()=>{const change=()=>State(pwaState());window.addEventListener('math-pwa-change',change);return()=>window.removeEventListener('math-pwa-change',change)},[]);
 return <div className="settings-install"><div className="install-title"><Download size={16}/><h3>{state.installed?'已安装到设备':'安装到设备'}</h3></div><p>{state.offlineReady?'离线内容已就绪，可断网研习全部单元和真题。':'首次联网打开后准备离线内容，通常需要片刻。'}原笔记 PDF 与来源附件需联网打开。</p>{state.canInstall&&<button className="secondary" onClick={()=>installApp().catch(()=>Error(true))}>安装数学研习室</button>}{state.update&&<button className="text-button" onClick={updateApp}>新版本已就绪 · 更新并重新打开</button>}{error&&<p role="status">请通过浏览器菜单安装。</p>}{!state.installed&&!state.canInstall&&<details><summary>怎样安装？</summary><p>Chrome / Edge：在地址栏的安装图标或浏览器菜单中选择“安装应用”。iPhone / iPad：用 Safari 打开，点“分享”→“添加到主屏幕”。具体入口依浏览器版本而异。</p></details>}</div>;
}
