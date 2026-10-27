import { readFile } from 'node:fs/promises';
import YAML from 'yaml';
export interface Project { name:string; zh_url:string; en_url:string; zh_description:string; en_description:string }
export interface Skill { name:string; zh_description:string; en_description:string; source:string }
export async function getProjects():Promise<Project[]> {
 return YAML.parse(await readFile(new URL('../../../_data/projects.yml',import.meta.url),'utf8')) as Project[];
}
export async function getSkills():Promise<Skill[]> {
 return YAML.parse(await readFile(new URL('../../../_data/skills.yml',import.meta.url),'utf8')) as Skill[];
}
