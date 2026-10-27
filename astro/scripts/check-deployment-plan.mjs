import { readFile } from 'node:fs/promises';
import YAML from 'yaml';
const flow=YAML.parse(await readFile(new URL('../../.github/workflows/deploy-astro-pages.yml',import.meta.url),'utf8'));
function check(v,msg){if(!v)throw Error('UNSAFE DEPLOYMENT PLAN: '+msg)}
check(flow.on?.push?.branches?.join(',')==='main' && Object.hasOwn(flow.on,'workflow_dispatch'),'Unexpected release trigger');
for(const j of ['build','deploy']){
 check(flow.jobs[j]?.if?.includes("github.ref == 'refs/heads/main'"),j+' must be main only');
 check(flow.jobs[j]?.if?.includes("vars.ASTRO_PAGES_ACTIVE == 'true'"),j+' requires explicit release variable');
}
check(flow.jobs.deploy.needs==='build','Deployment must require verified build');
check(flow.jobs.deploy.environment.name==='github-pages','Wrong deploy environment');
check(flow.jobs.deploy.permissions.pages==='write'&&flow.jobs.deploy.permissions['id-token']==='write','Pages + OIDC permissions missing');
const build=flow.jobs.build.steps.map(s=>s.uses||s.run||'').join('\n');
const publish=flow.jobs.deploy.steps.map(s=>s.uses||'').join('\n');
for(const action of ['actions/configure-pages@v5','actions/upload-pages-artifact@v4'])check(build.includes(action),'Missing '+action);
check(publish.includes('actions/deploy-pages@v4'),'Missing deploy-pages');
check(build.includes('npm ci')&&build.includes('npm run check')&&build.includes('check-legacy-routes'),'Unverified website could deploy');
check(build.includes('backup/jekyll-production-20261027'),'No hard backup gate');
check(build.includes('grep-invert "compare live Jekyll"'),'After cutover release must not compare against obsolete Jekyll');
console.log('ASTRO_DEPLOY_PLAN_SAFE: main-only, opt-in variable, preserved Jekyll backup, browser tests and official Pages publishing');
