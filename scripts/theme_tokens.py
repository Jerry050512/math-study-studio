"""Migrate the existing palette to paired CSS tokens without changing light mode."""
from pathlib import Path
import re,colorsys
root=Path(__file__).resolve().parents[1]
p=root/'src/style.css'
text=p.read_text(encoding='utf-8')
colors=sorted(set(re.findall(r'#[0-9a-fA-F]{3,8}\b',text)))
def dark_color(hex):
    raw=hex[1:]
    if len(raw)==3:raw=''.join(c*2 for c in raw)
    rgb=tuple(int(raw[i:i+2],16)/255 for i in (0,2,4))
    hue,light,sat=colorsys.rgb_to_hls(*rgb)
    if len(raw)==8:return '#000000'+raw[6:]
    if light>.88:return '#1d2e26' if sat>.12 else '#1a2822'
    if light>.72:return '#34483b'
    if light>.55:return '#b0c3a5'
    return '#b6c9b1' if light>.35 else '#e0e9dd'
overrides={'#253b35':'#e2eade','#f8faf8':'#14211b','#607066':'#abbcab','#244f46':'#92b79d','#447a62':'#9dc9ad','#e2e8e2':'#34483b','#edf2ec':'#203328','#fff':'#1a2a21','#f0f4ef':'#18271f','#fafcfa':'#17261e','#62735e':'#b0c1a7','#e4ecdf':'#2b4030','#dfe9dc':'#2b4030','#bfccbf':'#49604a','#f8faf5':'#18271e','#fcf2e7':'#382e20','#fbede7':'#382a22','#d1ad7c':'#a88c60','#c09a63':'#bea06e','#eff5e9':'#223729','#eaf3e1':'#253e29','#cbdccc':'#3b5943','#183d32':'#e2eade','#86a992':'#99bd9c'}
for c in colors:overrides.setdefault(c,dark_color(c))
if 'var(--tone-' not in text:
    text=re.sub(r'#[0-9a-fA-F]{3,8}\b',lambda m:f'var(--tone-{m[0][1:]}, {m[0]})',text)
    text=re.sub(r'font-size:(\d+(?:\.\d+)?)px',lambda m:f'font-size:calc({m[1]}px * var(--font-scale, 1))',text)
    p.write_text(text,encoding='utf-8')
tokens='/* Paired values for the existing light palette; roles refined below in reading.css. */\n:root[data-theme="dark"]{\n'+''.join(f'  --tone-{c[1:]}: {overrides[c]};\n' for c in colors)+'}\n'
(root/'src/theme-tokens.css').write_text(tokens,encoding='utf-8')
print(f'Paired {len(colors)} existing palette values.')
