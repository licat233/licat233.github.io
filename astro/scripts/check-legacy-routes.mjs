import { readdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const current=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(current,'../..');
const dist=path.resolve(current,'../dist');
const skip=new Set(['.git','.github','astro','_includes','_layouts','_data','_posts','scripts','node_modules']);
let htmlCount=0;
let missing=[];
async function walk(dir,atRoot=false){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  if(entry.name.startsWith('.') || (atRoot&&skip.has(entry.name)))continue;
  const absolute=path.join(dir,entry.name);
  if(entry.isDirectory()){await walk(absolute,false);continue}
  if(!entry.isFile()||!entry.name.endsWith('.html'))continue;
  const rel=path.relative(root,absolute).replaceAll(path.sep,'/');
  try{
   const out=await readFile(path.join(dist,rel),'utf8');
   if(out.length<60)missing.push(rel+' (empty)');
   if(/{%\s*include /.test(out))missing.push(rel+' (unrendered Jekyll include)');
  }catch(e){if(e.code==='ENOENT')missing.push(rel);else throw e}
  htmlCount++;
 }
}
await walk(root,true);
if(missing.length)throw Error('Lost or malformed public HTML during Astro migration: '+missing.join(', '));
for(const asset of ['previews/semantic-motion/projects-preview.gif','demo/portfolio.css','demo/portfolio-motion.js','demo/entrances.css']){
 try {await stat(path.join(dist,asset))}
 catch(e){if(e.code==='ENOENT')missing.push(asset);else throw e}
}
if(missing.length)throw Error('Lost public artifacts: '+missing.join(', '));
console.log('ASTRO_LEGACY_ROUTE_PARITY_PASS: '+htmlCount+' pre-existing HTML paths plus demo/preview assets present');
