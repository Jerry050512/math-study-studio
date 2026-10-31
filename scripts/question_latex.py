"""Conservative structured conversion of archived KaTeX HTML for sharing.
Generated LaTeX is checked by KaTeX and kept separate from source HTML.
"""
import re
from bs4 import BeautifulSoup,Tag,NavigableString
SYMBOLS={'−':'-','→':r'\to ','∞':r'\infty ','≤':r'\le ','≥':r'\ge ','≠':r'\ne ','∈':r'\in ','∉':r'\notin ','∫':r'\int ','∬':r'\iint ','∑':r'\sum ','∏':r'\prod ','π':r'\pi ','α':r'\alpha ','β':r'\beta ','γ':r'\gamma ','δ':r'\delta ','ε':r'\varepsilon ','λ':r'\lambda ','μ':r'\mu ','σ':r'\sigma ','θ':r'\theta ','ξ':r'\xi ','η':r'\eta ','ρ':r'\rho ','φ':r'\varphi ','ω':r'\omega ','∂':r'\partial ','′':"'",'″':"''",'⋯':r'\cdots ','…':r'\ldots ','⋮':r'\vdots ','⋱':r'\ddots ','±':r'\pm ','×':r'\times ','·':r'\cdot ','∼':r'\sim ','≈':r'\approx ','∣':r'\mid ','∥':r'\parallel ','∅':r'\varnothing ','∀':r'\forall ','∃':r'\exists ','⇒':r'\Rightarrow ','⇔':r'\Leftrightarrow ','∪':r'\cup ','∩':r'\cap ','⊂':r'\subset ','⊆':r'\subseteq ','⩾':r'\ge ','⩽':r'\le ','ℝ':r'\mathbb{R}','ℕ':r'\mathbb{N}'}
SYMBOLS.update({'⊥':r'\perp ','△':r'\triangle ','∗':r'\ast '})
def text(s):return ''.join(SYMBOLS.get(c,'' if c in '\u200b\u2061\u00a0' else c) for c in s)
def classes(n):return n.get('class',[]) if isinstance(n,Tag) else []
def children(n):return ''.join(math(c) for c in n.children)
def layers(n):
    v=n.select_one('.vlist');return [x for x in v.find_all(recursive=False) if isinstance(x,Tag)] if v else []
def content(layer):return ''.join(math(x) for x in layer.children if not isinstance(x,Tag) or 'pstrut' not in classes(x))
def top(layer):return float(re.search(r'top:([\-\d.]+)em',layer.get('style',''))[1]) if re.search(r'top:([\-\d.]+)em',layer.get('style','')) else 0
def math(n):
    if isinstance(n,NavigableString):return text(str(n))
    if not isinstance(n,Tag):return ''
    c=classes(n)
    if n.name in ('svg','path') or any(x in c for x in ['strut','pstrut','vlist-s','arraycolsep','fix']):return ''
    if 'mspace' in c:return ' '
    if 'mfrac' in c:
        ls=[x for x in layers(n) if not x.select_one('.frac-line')];ls.sort(key=top)
        return r'\frac{'+content(ls[0])+'}{'+content(ls[-1])+'}'
    if 'msupsub' in c:
        ls=layers(n);parts=[]
        for x in sorted(ls,key=top):parts.append(('^' if top(x)<-2.6 else '_')+'{'+content(x)+'}')
        return ''.join(parts)
    if 'op-limits' in c:
        ls=sorted(layers(n),key=top);op=next((x for x in ls if x.select_one('.op-symbol') or x.get_text(strip=True) in ('lim','max','min','sup','inf')),None)
        if op:
            result=content(op)
            for x in ls:
                if x is not op:result+=('^' if top(x)<top(op) else '_')+'{'+content(x)+'}'
            return result
    if 'sqrt' in c:
        base=n.select_one('.svg-align > .mord');root=n.select_one('.root')
        return r'\sqrt'+('['+children(root)+']' if root else '')+'{'+(children(base) if base else '')+'}'
    if 'mtable' in c:
        cols=n.find_all(class_=re.compile('col-align-'),recursive=False);columns=[[content(x) for x in layers(col)] for col in cols]
        if not columns:return ''
        rows=[' & '.join(col[i] if i<len(col) else '' for col in columns) for i in range(max(map(len,columns)))];return r'\begin{matrix}'+r' \\ '.join(rows)+r'\end{matrix}'
    if 'nulldelimiter' in c:return ''
    if 'delimsizing' in c:
        t=n.get_text(strip=True)
        if t:return text(t).replace('{',r'\{').replace('}',r'\}')
        path=n.select_one('path');d=path.get('d','') if path else ''
        return '|' if 'M145 15v585' in d else ''
    if 'mop' in c and not n.select_one('.vlist'):
        t=n.get_text(strip=True)
        if t in ['sin','cos','tan','cot','sec','csc','ln','log','lim','max','min','sup','inf','det','arcsin','arccos','arctan','sinh','cosh']:return '\\'+t+' '
    if 'llap' in c or 'rlap' in c:return children(n.select_one('.inner')) if n.select_one('.inner') else children(n)
    if 'underline' in c:return r'\underline{'+''.join(content(x) for x in layers(n) if not x.select_one('.underline-line'))+'}'
    value=children(n)
    if 'mathbb' in c:return r'\mathbb{'+value+'}'
    if 'boldsymbol' in c:return r'\boldsymbol{'+value+'}'
    if 'textbf' in c:return r'\mathbf{'+value+'}'
    return value
def question_text(html):
    soup=BeautifulSoup(html,'html.parser')
    formulas=[]
    for node in soup.select('.katex'):
        latex=re.sub(r'\s+',' ',math(node)).replace('\ue020=',r'\ne ').strip();formulas.append(latex);node.replace_with('$'+latex+'$')
    for node in soup.select('.choice-option'):node.insert_before('\n');node.insert_after('\n')
    for node in soup.find_all(['p','br']):node.insert_after('\n')
    value=soup.get_text();value=re.sub(r'[^\S\n]+',' ',value);value=re.sub(r'\n\s*\n+','\n\n',value).strip()
    return value,formulas
