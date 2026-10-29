from pathlib import Path
import re,json,hashlib,shutil,subprocess,sys
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT.parent/'04-学习笔记/数学笔记/全卷全题型'
def argument(s,pos):
    while pos<len(s) and s[pos].isspace():pos+=1
    if s[pos]!='{':raise ValueError(s[pos:pos+30])
    depth=1;start=pos+1;pos+=1
    while depth:
        if s[pos]=='{' and s[pos-1]!='\\':depth+=1
        if s[pos]=='}' and s[pos-1]!='\\':depth-=1
        pos+=1
    return s[start:pos-1],pos
lessons=[];manifest=[];extras=[]
def parse_blocks(raw):
    token=re.compile(r'\\(?:chapter|section|subsection\*?)\{|\\begin\{(?:tabularx|longtable|center)\}|\\(?:core|process|tip)\{')
    blocks=[];pos=0
    def append_text(s):
        s=re.sub(r'\\(?:small|normalsize)\b','',s).strip()
        if s:blocks.append({'type':'text','text':s})
    while True:
        m=token.search(raw,pos)
        if not m:append_text(raw[pos:]);break
        append_text(raw[pos:m.start()]);cmd=m[0]
        if cmd.startswith('\\begin'):
            env=re.search(r'\{([^}]+)\}',cmd)[1];start=m.end()
            if env=='center':
                end=raw.index('\\end{center}',start);blocks.append({'type':'geometry'});pos=end+len('\\end{center}');continue
            if env=='tabularx':_,start=argument(raw,start)
            _,start=argument(raw,start)
            end=raw.index('\\end{'+env+'}',start);body=raw[start:end]
            body=re.sub(r'\\(?:toprule|midrule|bottomrule|endhead)\b','',body)
            rows=[[c.strip() for c in row.strip().split('&')] for row in re.split(r'\\\\',body) if row.strip()]
            blocks.append({'type':'table','rows':rows});pos=end+len('\\end{'+env+'}')
        else:
            value,end=argument(raw,m.end()-1)
            if cmd.startswith('\\chapter'):blocks.append({'type':'chapter','text':value})
            elif cmd.startswith('\\section'):blocks.append({'type':'heading','text':value})
            elif cmd.startswith('\\subsection'):blocks.append({'type':'subheading','text':value})
            elif cmd.startswith('\\tip'):
                body,end=argument(raw,end);blocks.append({'type':'callout','title':value,'text':body})
            else:blocks.append({'type':'callout','title':'核心知识' if cmd.startswith('\\core') else '操作流程','text':value})
            pos=end
    return blocks
for name,label in [('calculus','极限与微积分'),('applications','综合应用'),('linear','线性代数')]:
    path=SOURCE/'chapters'/f'{name}.tex';raw=path.read_text(encoding='utf-8')
    manifest.append({'path':f'chapters/{name}.tex','sha256':hashlib.sha256(path.read_bytes()).hexdigest()})
    for match in re.finditer(r'\\section\{([^}]+)\}',raw):
        end=raw.find('\\section{',match.end());text=raw[match.end():end if end!=-1 else len(raw)]
        if '\\recognize{' not in text:continue
        obj={'id':f'{name}-{sum(x["group"]==name for x in lessons)+1:02d}','group':name,'groupLabel':label,'title':match[1],'source':f'chapters/{name}.tex','line':raw[:match.start()].count('\n')+1,'questions':[]}
        for key in ['recognize','core','process','fast','budget','related']:
            m=re.search(r'\\'+key+r'\s*\{',text)
            obj[key]=argument(text,m.end()-1)[0] if m else ''
        for q in re.finditer(r'\\fullquestion\{([^}]+)\}',text):
            after=text[q.end():];a=re.search(r'\\apply\s*\{',after)
            solution=argument(after,a.end()-1)[0] if a else ''
            obj['questions'].append({'id':q[1],'solution':solution})
        obj['steps']=[x.strip() for x in re.split(r'\\item\s*',obj['process'])[1:]]
        obj['steps']=[re.sub(r'\\end\{enumerate\}.*','',x,flags=re.S).strip() for x in obj['steps']]
        lessons.append(obj)
for name in ['field','synthesis','evidence']:
    p=SOURCE/'chapters'/f'{name}.tex';raw=p.read_text(encoding='utf-8');extras.append({'id':name,'title':re.search(r'\\chapter\{([^}]+)\}',raw)[1],'blocks':parse_blocks(raw)})
out=ROOT/'src/data';out.mkdir(parents=True,exist_ok=True)
(out/'lessons.json').write_text(json.dumps(lessons,ensure_ascii=False,indent=2),encoding='utf-8')
(out/'references.json').write_text(json.dumps(extras,ensure_ascii=False),encoding='utf-8')
public=ROOT/'public';(public/'questions').mkdir(parents=True,exist_ok=True)
ids=set(q['id'] for x in lessons for q in x['questions'])
subprocess.run([sys.executable,str(ROOT/'scripts/archive_questions.py')],check=True)
shutil.copy2(SOURCE/'build/main.pdf',public/'数学二真题全卷满分手册.pdf')
(public/'sources').mkdir(exist_ok=True)
for name in ['calculus','applications','linear','field','synthesis','evidence']:
    shutil.copy2(SOURCE/'chapters'/f'{name}.tex',public/'sources'/f'{name}.tex')
for name in ['verification.md','研究说明.md','math-checks.json','全题题位索引.tsv']:
    if (SOURCE/'research'/name).exists():shutil.copy2(SOURCE/'research'/name,public/'sources'/name)
report={'lessons':len(lessons),'examples':sum(len(x['questions']) for x in lessons),'uniqueExamples':len(ids),'groups':{g:sum(x['group']==g for x in lessons) for g in ['calculus','applications','linear']},'sources':manifest,'referenceCommit':'f8849746d85c5ebe8556fdb8f388783ac7483c8b','methodology':'来源可追溯、先回忆后展开、条件检查、分层提示、解释与复盘；新增练习与交互为站点教学补充。'}
(out/'coverage.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False))
