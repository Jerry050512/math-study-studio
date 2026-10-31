export function pathFor(points){if(!points.length)return '';if(points.length===1)return `M${points[0]}l.01,0`;return points.map((p,i)=>`${i?'L':'M'}${p[0]},${p[1]}`).join(' ')}
function distance(p,a,b){const dx=b[0]-a[0],dy=b[1]-a[1],t=Math.max(0,Math.min(1,((p[0]-a[0])*dx+(p[1]-a[1])*dy)/(dx*dx+dy*dy||1)));return Math.hypot(p[0]-a[0]-t*dx,p[1]-a[1]-t*dy)}
export function touchesStroke(stroke,a,b,radius){const ps=stroke.points,r=radius+stroke.width/2;for(let i=0;i<ps.length;i++){if(distance(ps[i],a,b)<=r)return true;if(i&&distance(a,ps[i-1],ps[i])<=r||i&&distance(b,ps[i-1],ps[i])<=r)return true;
 if(i){const c=ps[i-1],d=ps[i],cross=(p,q,v)=>(q[0]-p[0])*(v[1]-p[1])-(q[1]-p[1])*(v[0]-p[0]);if(cross(a,b,c)*cross(a,b,d)<0&&cross(c,d,a)*cross(c,d,b)<0)return true}}
 return false}
export function inkSvg(doc){return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 ${doc.height}" width="1000" height="${doc.height}"><rect width="100%" height="100%" fill="#fffdf7"/>${doc.strokes.map(s=>`<path d="${pathFor(s.points)}" stroke="${s.color}" stroke-width="${s.width}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`).join('')}</svg>`}
export function downloadFile(content,type,name){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
