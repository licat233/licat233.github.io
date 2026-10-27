import { readFile } from 'node:fs/promises';
import path from 'node:path';
import YAML from 'yaml';
export interface Project {
  name:string; zh_url:string; en_url:string; zh_description:string; en_description:string;
  featured_rank?:number; featured_zh_url?:string; featured_en_url?:string;
  featured_zh_description?:string; featured_en_description?:string;
  featured_tags?:string[]; featured_meta?:string[];
}
export interface Skill { name:string; zh_description:string; en_description:string; source:string }
export async function getProjects():Promise<Project[]> {
 return YAML.parse(await readFile(path.resolve(process.cwd(),'../_data/projects.yml'),'utf8')) as Project[];
}
export async function getSkills():Promise<Skill[]> {
 return YAML.parse(await readFile(path.resolve(process.cwd(),'../_data/skills.yml'),'utf8')) as Skill[];
}
