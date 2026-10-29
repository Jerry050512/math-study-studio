import React from 'react';
import katex from 'katex';
export function Formula({value,display=false}) {
  let html;try{html=katex.renderToString(value,{displayMode:display,throwOnError:true,strict:'ignore',trust:false,macros:{'\\E':'\\mathrm{E}'}})}catch(e){return <code className="math-error" title={e.message}>{value}</code>}
  return <span className={display?'math-block':'math-inline'} dangerouslySetInnerHTML={{__html:html}}/>;
}
function plain(s){return s.replace(/\\(?:textbf|emph|textit|textrm|textcolor)\{([^{}]*)\}/g,'$1').replace(/\\(?:quad|qquad|smallskip|par|noindent|small|displaystyle)\b/g,' ').replace(/\\[,;!]/g,' ').replace(/\\_/g,'_').replace(/~/g,' ').replace(/--/g,'—');}
export default function Rich({text='',className=''}) {
  const clean=text.replace(/\\begin\{enumerate\}/g,'\n').replace(/\\end\{enumerate\}/g,'\n').replace(/\\begin\{itemize\}/g,'\n').replace(/\\end\{itemize\}/g,'\n').replace(/\\item\s*/g,'\n• ');
  const tokens=clean.split(/(\\\[[\s\S]*?\\\]|\$[^$]*?\$)/g);
  return <div className={'rich '+className}>{tokens.map((t,i)=>t.startsWith('\\[')?<Formula key={i} value={t.slice(2,-2)} display/>:t.startsWith('$')?<Formula key={i} value={t.slice(1,-1)}/>:<React.Fragment key={i}>{plain(t)}</React.Fragment>)}</div>;
}
