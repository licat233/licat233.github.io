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
  const published=rel.startsWith('public-sites/')?rel.slice('public-sites/'.length):rel;
  try{
   const out=await readFile(path.join(dist,published),'utf8');
   if(out.length<60)missing.push(published+' (empty)');
   if(/{%\s*include /.test(out))missing.push(published+' (unrendered Jekyll include)');
  }catch(e){if(e.code==='ENOENT')missing.push(published);else throw e}
  htmlCount++;
 }
}
await walk(root,true);
if(missing.length)throw Error('Lost or malformed public HTML during Astro migration: '+missing.join(', '));
// File relocations must not change public asset paths or introduce /public-sites/.
const publicSites=path.join(root,'public-sites');
async function checkPublicAssets(dir){
 for(const entry of await readdir(dir,{withFileTypes:true})){
  if(entry.name.startsWith('.'))continue;
  const absolute=path.join(dir,entry.name);
  if(entry.isDirectory()){await checkPublicAssets(absolute);continue}
  if(!entry.isFile()||entry.name.endsWith('.html'))continue;
  const published=path.relative(publicSites,absolute).replaceAll(path.sep,'/');
  try{await stat(path.join(dist,published))}
  catch(e){if(e.code==='ENOENT')missing.push(published);else throw e}
 }
}
await checkPublicAssets(publicSites);
try{await stat(path.join(dist,'public-sites'));missing.push('public-sites/ (incorrect URL prefix)')}
catch(e){if(e.code!=='ENOENT')throw e}

for(const asset of ['previews/semantic-motion/projects-preview.gif','demo/portfolio.css','demo/portfolio-motion.js','demo/entrances.css']){
 try {await stat(path.join(dist,asset))}
 catch(e){if(e.code==='ENOENT')missing.push(asset);else throw e}
}
if(missing.length)throw Error('Lost public artifacts: '+missing.join(', '));
console.log('ASTRO_LEGACY_ROUTE_PARITY_PASS: '+htmlCount+' pre-existing HTML paths plus demo/preview assets present');
