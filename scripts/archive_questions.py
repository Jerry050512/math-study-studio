"""Publish attributed native HTML/KaTeX stems from the local question archive.

No OCR or rasterization. Retain text, math layout, options and source URL.
Run after extract.py to refresh the standalone question payloads.
"""
from pathlib import Path
import json, re, hashlib
from bs4 import BeautifulSoup

ROOT = Path(__file__).resolve().parents[1]
ARCHIVE = ROOT.parent / 'exam-archive/data/questions.jsonl'
ids = {q['id'] for l in json.loads((ROOT/'src/data/lessons.json').read_text(encoding='utf-8')) for q in l['questions']}
bank = {q['id']:q for q in map(json.loads, ARCHIVE.read_text(encoding='utf-8').splitlines()) if q['id'] in ids}
assert ids == bank.keys(), 'Missing archive question'
out = ROOT/'public/questions'
out.mkdir(exist_ok=True)
report = []
allowed = {'p','div','span','br','svg','path','label','form'}
attrs = {'class','style','height','width','viewbox','d','preserveaspectratio'}
for id, q in sorted(bank.items()):
    soup = BeautifulSoup(q['question_html'], 'html.parser')
    original_text = soup.get_text()
    before_math = len(soup.select('.katex'))
    before_options = len(soup.select('.choice-option'))
    for tag in list(soup.find_all()):
        assert tag.name in allowed, f'Unexpected tag {id}: {tag.name}'
        tag.attrs = {k:v for k,v in tag.attrs.items() if k.lower() in attrs}
        if 'style' in tag.attrs:
            assert not re.search(r'url\s*\(|expression|javascript|@import', tag['style'], re.I)
        if tag.name in ('label','form'):
            tag.name = 'div'
    assert soup.get_text() == original_text
    assert len(soup.select('.katex')) == before_math
    assert len(soup.select('.choice-option')) == before_options
    html = str(soup).replace('viewbox=', 'viewBox=').replace('preserveaspectratio=', 'preserveAspectRatio=')
    data = {'id':id, 'html':html, 'source':q['source_question_url'], 'section':q['section'], 'points':q.get('points')}
    (out/f'{id}.json').write_text(json.dumps(data,ensure_ascii=False),encoding='utf-8')
    report.append({'id':id, 'formulas':before_math, 'options':before_options, 'source':data['source'], 'archiveHtmlSha256':hashlib.sha256(q['question_html'].encode()).hexdigest(), 'textPreserved':True})
(ROOT/'src/data/archive-coverage.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'questions':len(report),'formulas':sum(r['formulas'] for r in report),'options':sum(r['options'] for r in report),'textPreserved':True}))
