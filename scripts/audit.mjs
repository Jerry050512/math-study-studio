import fs from 'node:fs';import katex from 'katex';import checks from '../src/data/checks.js';
const lessons=JSON.parse(fs.readFileSync(new URL('../src/data/lessons.json',import.meta.url),'utf8'));
const errors=[];let count=0;
function scan(text,where){for(const match of text.matchAll(/\\\[([\s\S]*?)\\\]|\$([^$]*?)\$/g)){const val=match[1]??match[2];try{katex.renderToString(val,{throwOnError:true,strict:'ignore'});count++}catch(e){errors.push({where,value:val,error:e.message})}}}
for(const l of lessons){if(!checks[l.id])errors.push({missingCheck:l.id});for(const k of ['core','recognize','process','fast','related'])scan(l[k],l.id+'/'+k);for(const q of l.questions)scan(q.solution,l.id+'/'+q.id);const c=checks[l.id];scan(c.question,l.id+'/check');c.options.forEach(x=>scan(x,l.id+'/options'));scan(c.explanation,l.id+'/feedback');}
const references=JSON.parse(fs.readFileSync(new URL('../src/data/references.json',import.meta.url),'utf8'));
for(const d of references)for(const b of d.blocks){if(b.text)scan(b.text,d.id);if(b.rows)for(const row of b.rows)for(const c of row)scan(c,d.id+'/table');}
console.log(JSON.stringify({lessons:lessons.length,checks:Object.keys(checks).length,formulaCount:count,errors},null,2));if(errors.length)process.exit(1);
