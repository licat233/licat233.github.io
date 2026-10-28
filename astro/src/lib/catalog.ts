import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
export interface Project {
  name:string; zh_url:string; en_url:string; zh_description:string; en_description:string;
  featured_rank?:number; featured_zh_url?:string; featured_en_url?:string;
  featured_zh_description?:string; featured_en_description?:string;
  featured_tags?:string[]; featured_meta?:string[];
}
export interface Skill {
  name:string; zh_description:string; en_description:string; source:string;
  featured_zh_domain?:string; featured_en_domain?:string;
  featured_zh_summary?:string; featured_en_summary?:string;
  featured_zh_usage?:string[]; featured_en_usage?:string[];
}
const repoRoot=path.resolve(process.cwd(),'..');
export async function getProjects():Promise<Project[]> {
 return YAML.parse(await readFile(path.join(repoRoot,'_data/projects.yml'),'utf8')) as Project[];
}
/**
 * Build-time skill discovery: the site never calls GitHub REST from visitors'
 * browsers. Curated YAML metadata takes precedence, while a new local
 * skills/<slug>/SKILL.md becomes available automatically on the next build.
 * This keeps the previous progressive-discovery feature without 403s or CLS.
 */
export async function getSkills():Promise<Skill[]> {
 const curated=YAML.parse(await readFile(path.join(repoRoot,'_data/skills.yml'),'utf8')) as Skill[];
 const known=new Set(curated.map(s=>s.name));
 const skillsDir=path.join(repoRoot,'skills');
 const folders=(await readdir(skillsDir,{withFileTypes:true}))
   .filter(item=>item.isDirectory() && /^[a-z0-9][a-z0-9-]{0,79}$/.test(item.name))
   .map(item=>item.name).sort();
 const discovered:Skill[]=[];
 for(const slug of folders){
   if(known.has(slug))continue;
   let markdown:string;
   try {markdown=await readFile(path.join(skillsDir,slug,'SKILL.md'),'utf8')}
   catch (error) {
     if((error as NodeJS.ErrnoException).code==='ENOENT')continue;
     throw error;
   }
   const frontmatter=/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(markdown);
   if(!frontmatter)throw new Error('Missing SKILL.md frontmatter: '+slug);
   const fields=YAML.parse(frontmatter[1]) as Record<string,unknown>;
   if(fields.name!==slug || typeof fields.description!=='string' || !fields.description.trim())
     throw new Error('Invalid skill metadata (name/description): '+slug);
   const description=fields.description.trim().replace(/\s+/g,' ');
   discovered.push({
     name:slug,source:'/skills/'+slug+'/SKILL.md',
     zh_description:description,en_description:description,
     featured_zh_domain:'AGENT SKILL',featured_en_domain:'AGENT SKILL',
     featured_zh_summary:description,featured_en_summary:description,
     featured_zh_usage:['阅读 SKILL.md 获取适用场景与工作流程'],
     featured_en_usage:['Read SKILL.md for workflows and use cases']
   });
 }
 return [...curated,...discovered];
}
