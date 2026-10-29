import React from 'react';
import katex from 'katex';
export function Formula({value,display=false}) {
  let html;try{html=katex.renderToString(value,{displayMode:display,throwOnError:true,strict:'ignore',trust:false,macros:{'\\E':'\\mathrm{E}'}})}catch(e){return <code className="math-error" title={e.message}>{value}</code>}
  return <span className={display?'math-block':'math-inline'} dangerouslySetInnerHTML={{__html:html}}/>;
}
function plain(s){return s.replace(/\\(?:quad|qquad|smallskip|par|noindent|small|displaystyle)\b/g,' ').replace(/\\[,;!]/g,' ').replace(/\\_/g,'_').replace(/~/g,' ').replace(/--/g,'—');}
const keyPhrases=/首个非零项|充分必要条件|必要条件|保留系数|单侧邻域|线性无关|线性相关|适用条件|定义域|连续性|可导性|正交|满秩|正定|特征值|通解|收敛|发散|高阶|等价/g;
function renderText(text,emphasize,budget){
 const result=[];let cursor=0;
 function append(s){const clean=plain(s);if(!emphasize||budget.remaining<=0){result.push(clean);return}let end=0;for(const m of clean.matchAll(keyPhrases)){if(budget.remaining<=0)break;result.push(clean.slice(end,m.index),<strong className="key-emphasis" key={result.length}>{m[0]}</strong>);end=m.index+m[0].length;budget.remaining--}result.push(clean.slice(end))}
 const token=/\\\[[\s\S]*?\\\]|\$[^$]*?\$|\\(textbf|emph|textit|textrm|textcolor)\{/g;let m;
 while((m=token.exec(text))){append(text.slice(cursor,m.index));if(m[0].startsWith('$')||m[0].startsWith('\\[')){const display=m[0].startsWith('\\[');result.push(<Formula key={result.length} value={m[0].slice(display?2:1,display?-2:-1)} display={display}/>);cursor=token.lastIndex;continue}
  const command=m[1];let start=token.lastIndex,depth=1,end=start;for(;end<text.length;end++){if(text[end]==='{'&&text[end-1]!=='\\')depth++;if(text[end]==='}'&&text[end-1]!=='\\'&&!--depth)break}
  if(depth){append(text.slice(m.index));cursor=text.length;break}
  if(command==='textcolor'){const next=text.indexOf('{',end+1);if(next<0){cursor=end+1;continue}start=next+1;depth=1;for(end=start;end<text.length;end++){if(text[end]==='{'&&text[end-1]!=='\\')depth++;if(text[end]==='}'&&text[end-1]!=='\\'&&!--depth)break}}
  const content=renderText(text.slice(start,end),false,budget),Tag=command==='textbf'?'strong':command==='emph'||command==='textit'?'em':'span';result.push(<Tag key={result.length} className={command==='textcolor'?'key-highlight':undefined}>{content}</Tag>);cursor=end+1;token.lastIndex=cursor;
 }
 append(text.slice(cursor));return result;
}
export default function Rich({text='',className='',emphasize=false}) {
  const clean=text.replace(/\\begin\{enumerate\}/g,'\n').replace(/\\end\{enumerate\}/g,'\n').replace(/\\begin\{itemize\}/g,'\n').replace(/\\end\{itemize\}/g,'\n').replace(/\\item\s*/g,'\n• ');
  return <div className={'rich '+className}>{renderText(clean,emphasize,{remaining:3})}</div>;
}
