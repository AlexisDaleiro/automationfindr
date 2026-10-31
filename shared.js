/* ==========================================================================
   AutomationFindr shared module: mock data, helpers, site chrome
   Loaded at the end of <body> on every page. Exposes window.AF.
   ========================================================================== */
(()=>{
'use strict';
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE=matchMedia('(pointer:fine)').matches;
const esc=s=>String(s).replace(/[&<>"]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
const hash=s=>{let h=2166136261;for(const c of s){h^=c.charCodeAt(0);h=Math.imul(h,16777619);}return h>>>0;};

/* ---------- data ---------- */
const ic=p=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
const CATS={
 workflow:{n:'Workflow & No-Code',c:'#0F766E',i:ic('<circle class="f" cx="5" cy="6" r="2.6"/><circle class="f" cx="5" cy="18" r="2.6"/><circle class="f" cx="19" cy="12" r="2.6"/><path d="M7.6 6h3.4c3.2 0 3.2 6 6.4 6M7.6 18H11c3.2 0 3.2-6 6.4-6"/>')},
 ai:{n:'AI Agents',c:'#7C3AED',i:ic('<path class="f" d="M10.5 3.5l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1-5.1-1.9 5.1-1.9z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>')},
 email:{n:'Email & Outreach',c:'#B45309',i:ic('<rect class="f" x="3" y="5.5" width="18" height="13" rx="3"/><path d="M4 8l8 5.5L20 8"/>')},
 crm:{n:'CRM & Sales',c:'#BE3A5C',i:ic('<circle class="f" cx="9" cy="8" r="3.2"/><path d="M3.5 19.5c0-3.3 2.4-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><path d="M18 9v7M21 12v4"/>')},
 devops:{n:'DevOps',c:'#3B6BA5',i:ic('<rect class="f" x="3" y="4.5" width="18" height="15" rx="3"/><path d="M7.5 10l3 2.2-3 2.2M13 15h3.5"/>')},
 data:{n:'Data & ETL',c:'#4D7C0F',i:ic('<ellipse class="f" cx="12" cy="6" rx="7" ry="2.8"/><path d="M5 6v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6"/>')},
 marketing:{n:'Marketing',c:'#9D3F8F',i:ic('<path class="f" d="M4 10v4h3.5L15 18V6L7.5 10z"/><path d="M18 9.5c1.3 1.2 1.3 3.8 0 5"/>')},
 finance:{n:'Finance & Invoicing',c:'#0E7490',i:ic('<path class="f" d="M6 3.5h12v17l-3-2-3 2-3-2-3 2z"/><path d="M9.5 8.5h5M9.5 12h5"/>')},
 hr:{n:'HR & Ops',c:'#52525B',i:ic('<circle class="f" cx="12" cy="5.5" r="2.5"/><circle class="f" cx="5.5" cy="18" r="2.5"/><circle class="f" cx="18.5" cy="18" r="2.5"/><path d="M12 8v3.5M12 11.5H5.5V15.5M12 11.5h6.5V15.5"/>')}
};
/* 39 subcategories: [key, name, group, blurb]. They borrow the group's color and icon.
   A tool's `cat` is its group; `sub` lists the finer categories it also belongs to. */
[['ipaas','Integration Platforms','workflow','Connect your apps with triggers and actions, hosted for you.'],
 ['selfhost','Self-Hosted Automation','workflow','Run it on your own server and keep the data in-house.'],
 ['rpa','Browser & RPA','workflow','Click, type and scrape the way a person would.'],
 ['forms','Forms & Surveys','workflow','Collect answers and send them where they need to go.'],
 ['scheduling','Scheduling & Calendars','workflow','Book meetings and run things at the right time.'],
 ['internal','Internal Tools','workflow','Turn scripts and queries into screens your team can use.'],
 ['assistants','AI Assistants','ai','Helpers that handle your inbox, calendar and routine requests.'],
 ['scraping','Web Scraping','ai','Pull structured data out of web pages.'],
 ['llmops','LLM Ops','ai','Test, monitor and route the models behind your product.'],
 ['docai','Document AI','ai','Read contracts, receipts and PDFs and return clean fields.'],
 ['voice','Voice & Meetings','ai','Transcribe calls and turn them into notes and tasks.'],
 ['cold','Cold Email','email','Sequences, inbox rotation and deliverability for outbound.'],
 ['newsletter','Newsletters','email','Write, schedule and send to a list you own.'],
 ['transactional','Transactional Email','email','Receipts, resets and alerts sent from your app.'],
 ['inbox','Inbox Management','email','Sort, label and answer mail without opening it.'],
 ['sales','Pipeline & Deals','crm','Track deals from first touch to signed.'],
 ['support','Customer Support','crm','Help desks, chat and ticket routing.'],
 ['enrich','Contact Enrichment','crm','Fill in company and contact details automatically.'],
 ['proposals','Proposals & Contracts','crm','Draft, send and sign without the back and forth.'],
 ['cicd','CI/CD','devops','Build, test and ship on every commit.'],
 ['iac','Infrastructure as Code','devops','Describe servers and networks in code, then apply them.'],
 ['gitops','GitOps & Kubernetes','devops','Keep clusters in sync with what is in Git.'],
 ['monitoring','Monitoring & Alerts','devops','Know when something breaks before your users do.'],
 ['scripts','Scripts & Runbooks','devops','Run and schedule scripts with logs and permissions.'],
 ['etl','ETL & ELT','data','Move data from apps and databases into your warehouse.'],
 ['reverse-etl','Reverse ETL','data','Send warehouse data back into the tools your team uses.'],
 ['orchestration','Data Orchestration','data','Schedule and monitor pipelines made of many steps.'],
 ['spreadsheets','Spreadsheets & Sheets','data','Automate the sheets everyone ends up living in.'],
 ['bi','Dashboards & BI','data','Charts and reports that refresh themselves.'],
 ['social','Social Media','marketing','Plan, schedule and publish across networks.'],
 ['seo','SEO & Content','marketing','Research, write and track what ranks.'],
 ['leadgen','Lead Generation','marketing','Find the right people and reach them at scale.'],
 ['ads','Ads & Analytics','marketing','Run campaigns and see what they returned.'],
 ['invoicing','Invoicing','finance','Create, send and chase invoices.'],
 ['expenses','Expenses & Receipts','finance','Capture receipts and sort spending.'],
 ['payments','Payments & Billing','finance','Take payments and manage subscriptions.'],
 ['onboarding','Onboarding','hr','Checklists that start themselves on day one.'],
 ['payroll','Payroll & Benefits','hr','Pay people on time in every country you hire.'],
 ['itops','IT & Device Management','hr','Provision accounts and manage laptops.']
].forEach(([k,n,g,d])=>{ CATS[k]={n,g,d,c:CATS[g].c,i:CATS[g].i}; });
const inCat=(t,k)=>t.cat===k||!!t.sub&&t.sub.includes(k);
const GROUPS=Object.entries(CATS).filter(([,v])=>!v.g); /* the 9 top-level categories */
/* tools live in data/tools.json; T is filled in place once it loads (see ready) */
const T=[];

/* feature checklist per category: [group, [[name, tooltip]...]] */
const FEAT={
 workflow:[['Building',[['Visual canvas','Drag nodes and see the whole flow at once.'],['Branching logic','Route data down different paths with if/else or filters.'],['Loops and iterators','Repeat steps over lists of items.'],['Code steps','Drop in JavaScript or Python when the UI runs out.']]],['Running',[['Webhook triggers','Start a run from any HTTP call.'],['Scheduled runs','Cron-style timing.'],['Error retries','Failed steps retry before alerting you.'],['Execution history','Inspect inputs and outputs of past runs.']]],['Teams',[['Shared workspaces','Several people editing the same account.'],['Role permissions','Limit who can edit or run.'],['Version history','Roll back to an earlier version.']]]],
 ai:[['Agents',[['Natural-language setup','Describe the job instead of building it.'],['Tool use','Agents call apps and APIs for you.'],['Memory','Context carries across runs.']]],['Control',[['Human approval','Pause for sign-off before acting.'],['Run logs','See every decision the agent made.'],['Spend limits','Cap credits per run or per month.']]],['Connect',[['Bring your own model','Plug in your own LLM key.'],['Browser actions','Click and type on web pages.'],['Webhooks','Trigger and report over HTTP.']]]],
 email:[['Sending',[['Inbox rotation','Spread volume across sending accounts.'],['Warm-up','Build sender reputation before launch.'],['Send windows','Deliver at the recipient\u2019s local time.']]],['Personalization',[['Merge fields','Fill names and company data per message.'],['Image and video variables','Custom visuals per recipient.'],['Conditional steps','Change follow-ups based on replies.']]],['Safety',[['Bounce protection','Pause when addresses bounce.'],['Unsubscribe handling','One-click opt-out, honored automatically.'],['Reply detection','Stop sequences when someone answers.']]]],
 crm:[['Data',[['Custom objects','Model deals the way your business works.'],['Email sync','Conversations log themselves.'],['Enrichment','Fill company details automatically.']]],['Automation',[['Workflow triggers','Act when a field or stage changes.'],['Sequences','Timed outreach from inside the CRM.'],['Webhooks','Push events to other tools.']]],['Teams',[['Permissions','Control who sees which records.'],['Reporting','Dashboards on pipeline and activity.'],['Mobile app','Check deals on the go.']]]],
 devops:[['Pipelines',[['Parallel jobs','Run steps at the same time.'],['Reusable workflows','Share pipeline pieces across repos.'],['Secrets management','Store credentials safely.']]],['Delivery',[['Environments','Staging and production gates.'],['Rollbacks','Return to a known good release.'],['Drift detection','Flag differences from the declared state.']]],['Teams',[['SSO','Sign in with your identity provider.'],['Audit logs','Who changed what and when.'],['Role-based access','Scope permissions by team.']]]],
 data:[['Moving data',[['Prebuilt connectors','Sources and destinations ready to go.'],['Custom connectors','Build your own for niche sources.'],['Incremental syncs','Move only what changed.']]],['Running',[['Scheduling','Time-based and event-based runs.'],['Alerting','Notify when a job fails.'],['Lineage','Trace where each dataset came from.']]],['Teams',[['SSO','Sign in with your identity provider.'],['Role-based access','Scope permissions by team.'],['Audit logs','Who changed what and when.']]]],
 marketing:[['Create',[['Templates','Start from a proven setup.'],['Bulk actions','Handle many items at once.'],['AI assist','Draft and enrich with a model.']]],['Run',[['Scheduling','Queue work for later.'],['Integrations','Connect to your CRM and email tools.'],['Webhooks','Trigger and report over HTTP.']]],['Measure',[['Analytics','Track results over time.'],['Exports','Download your data as CSV.'],['Team seats','Invite colleagues.']]]],
 finance:[['Capture',[['Receipt scanning','Read totals and vendors from photos.'],['Email-in','Forward invoices to an address.'],['Bulk import','Bring in many documents at once.']]],['Billing',[['Recurring invoices','Send on a schedule.'],['Payment links','Let clients pay online.'],['Multi-currency','Bill in the client\u2019s currency.']]],['Books',[['Accounting sync','Push entries to your accounting tool.'],['Tax rates','Apply the right rate per line.'],['Client portal','Clients view their own invoices.']]]],
 hr:[['People',[['Employee records','One source of truth for staff.'],['Onboarding flows','Checklists that trigger by start date.'],['Offboarding','Revoke access on the last day.']]],['Ops',[['Payroll','Run pay in the same system.'],['Device management','Ship and lock laptops.'],['App provisioning','Create accounts automatically.']]],['Control',[['Approval workflows','Route requests to the right person.'],['SSO','Sign in with your identity provider.'],['Audit logs','Who changed what and when.']]]]
};
/* deterministic mock: a tool lacks roughly 1 in 8 checklist items */
const has=(t,name)=>hash(t.id+name)%8!==0;

/* ---------- helpers ---------- */
const byId=id=>T.find(t=>t.id===id);
const lg=(t,s='')=>`<span class="lg ${s}" style="--lc:${t.c}" data-n="${t.l.length}" aria-hidden="true">${t.l}</span>`;
const stars=(r,sm)=>`<span class="stars${sm?' sm':''}" style="--r:${r}" role="img" aria-label="Rated ${r} out of 5"></span>`;
const isFree=t=>/^(Free|Freemium)/.test(t.p);
const price=t=>`<span class="price${isFree(t)?' free':''}">${esc(t.p)}</span>`;
const priceNum=t=>isFree(t)?0:(/\$([\d.]+)/.exec(t.p)||[0,9999])[1]*1;
const startLabel=t=>isFree(t)?'$0/mo':/Custom/.test(t.p)?'Custom':`$${priceNum(t)}/mo`;
const freeLabel=t=>isFree(t)?'Free tier available':/Custom/.test(t.p)?'Paid only':'Free trial';
const platforms=t=>['Web',...(t.fl.includes('api')?['API']:[]),...(t.dm.includes('d')?['Desktop']:[]),...(t.dm.includes('m')?['Mobile']:[]),...(t.fl.includes('sh')?['Self-hosted']:[])];
const ago=d=>d===0?'Added today':d===1?'Added yesterday':`Added ${d} days ago`;
const fmt=n=>n.toLocaleString('en-US');
const ARROW='<svg class="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
const newest=[];
const toolUrl=id=>`tool.html?id=${id}`;
const catUrl=k=>k?`category.html?c=${k}`:'category.html';
const cmpUrl=ids=>`compare.html?tools=${ids.join(',')}`;

/* plans as the vendor lists them; see pricing.verified for whether we checked the vendor page */
const tiers=t=>t.pricing.tiers;
const FIRST=['Marta','Dev','Jonas','Priya','Tom','Aiko','Lena','Omar','Sofia','Ravi','Nina','Cal'];
const LAST=['R.','K.','B.','S.','M.','L.','T.','H.'];
const REV=[
 {u:'SMB',d:0.3,t:'We had {t} running in an afternoon. The first month paid for itself in saved admin hours.'},
 {u:'Freelancer',d:0,t:'Does what I need and stays out of the way. I wish the docs had more real-world examples.'},
 {u:'Enterprise',d:-1.0,t:'Solid, but procurement took longer than the rollout. Support answered quickly once we were live.'},
 {u:'SMB',d:-0.4,t:'Good value. A couple of rough edges in the editor, nothing that stopped us shipping.'},
 {u:'Freelancer',d:0.5,t:'Switched to {t} last spring and have not looked back. The community answers questions fast.'},
 {u:'Enterprise',d:0.1,t:'Rolled out to three teams. Permissions and audit trails did what our security review asked for.'},
 {u:'SMB',d:-1.8,t:'Pricing jumped faster than our usage did. Great product, just watch the plan limits.'},
 {u:'Freelancer',d:-0.6,t:'Quick to learn and the templates saved me a day of setup. Would recommend to anyone starting out.'}
];
function reviews(t){
  return REV.map((r,i)=>{ const h=hash(t.id+i); return {u:r.u,r:Math.max(1,Math.min(5,Math.round(t.r+r.d))),n:`${FIRST[h%FIRST.length]} ${LAST[(h>>3)%LAST.length]}`,days:3+((h>>5)%160),v:h%3!==0,t:r.t.replace('{t}',t.n)}; });
}

/* instant search ranking, shared by home, category and compare */
/* ponytail: in-browser index, fine for hundreds of tools. For thousands, swap rank()/rankCats() for
   Algolia, Meilisearch or Typesense; every search box on the site goes through these two. */
const tokens=text=>text.toLowerCase().split(/[^a-z0-9+.#-]+/).filter(Boolean).map(w=>w.length>3?w.replace(/s$/,''):w);
/* edit distance with transpositions; gives up early once it passes `max` */
function lev(a,b,max){
  if(Math.abs(a.length-b.length)>max) return max+1;
  let pp=null, p=Array.from({length:b.length+1},(_,j)=>j);
  for(let i=1;i<=a.length;i++){
    const c=[i]; let lo=i;
    for(let j=1;j<=b.length;j++){
      let v=Math.min(p[j]+1,c[j-1]+1,p[j-1]+(a[i-1]===b[j-1]?0:1));
      if(pp&&i>1&&j>1&&a[i-1]===b[j-2]&&a[i-2]===b[j-1]) v=Math.min(v,pp[j-2]+1);
      c[j]=v; if(v<lo) lo=v;
    }
    if(lo>max) return max+1;
    pp=p; p=c;
  }
  return p[b.length];
}
/* typo budget by length: none for short words, one edit up to 6 letters, two beyond */
const budget=w=>w.length<4?0:w.length<7?1:2;
const near=(w,words)=>{ const m=budget(w); return m>0&&words.some(x=>lev(w,x,m)<=m||(x.length>w.length&&lev(w,x.slice(0,w.length),m)<=m)); };
const idx=new WeakMap();
function index(t){
  let x=idx.get(t); if(x) return x;
  const name=t.n.toLowerCase(), cat=[CATS[t.cat].n,...(t.sub||[]).map(k=>CATS[k].n)].join(' ').toLowerCase(), tags=t.tg.join(' ').toLowerCase();
  const hay=`${name} ${cat} ${tags} ${t.d.toLowerCase()} ${t.k} ${isFree(t)?'free':''}`;
  const split=s=>[...new Set(s.split(/[^a-z0-9]+/).filter(w=>w.length>1))];
  x={name,cat,tags,hay,nw:split(name),hw:split(`${cat} ${tags} ${t.k}`)};
  idx.set(t,x); return x;
}
function rank(text,pool=T){
  const toks=tokens(text);
  if(!toks.length) return [];
  return pool.map(t=>{
    const {name,cat,tags,hay,nw,hw}=index(t);
    let s=0, hit=0;
    toks.forEach(w=>{
      const p=name===w?10:name.startsWith(w)?8:name.includes(w)?5:tags.includes(w)?4:cat.includes(w)?3:hay.includes(w)?2:near(w,nw)?4:near(w,hw)?1:0;
      if(p){ s+=p; hit++; }
    });
    return {t,s:hit===toks.length&&toks.length>1?s+2:s};
  }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s||b.t.rv-a.t.rv).map(x=>x.t);
}
/* categories whose name matches every word typed (prefix or one typo away); empty ones are left out */
function rankCats(text){
  const toks=tokens(text);
  if(!toks.length) return [];
  return Object.entries(CATS).filter(([,v])=>v.ct>0).map(([k,v])=>{
    const n=v.n.toLowerCase(), w=n.split(/[^a-z0-9+#]+/).filter(Boolean);
    let s=0;
    for(const x of toks){ const p=w.some(y=>y.startsWith(x))?3:near(x,w)?1:0; if(!p) return null; s+=p; }
    return {isCat:true,k,v,s};
  }).filter(Boolean).sort((a,b)=>b.s-a.s||b.v.ct-a.v.ct);
}

/* tool card for grids and carousels */
function card(t,i=0){
  return `<a class="tcard rv" href="${toolUrl(t.id)}" data-id="${t.id}" style="--c:${CATS[t.cat].c};--i:${i%5}">
   <div class="tcard-h">${lg(t)}<div><b>${esc(t.n)}${t.a<=7?'<span class="new">New</span>':''}</b><small>${esc(CATS[t.cat].n)}</small></div></div>
   <p>${esc(t.d)}</p>
   <div class="tcard-f">${stars(t.r,1)}<span class="mono" style="font-size:.8125rem">${t.r}</span>${price(t)}
   <svg class="go" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12L12 4M6 4h6v6"/></svg></div></a>`;
}

/* ---------- toast ---------- */
let tt, toastEl;
function toast(m){ toastEl.textContent=m; toastEl.classList.add('show'); clearTimeout(tt); tt=setTimeout(()=>toastEl.classList.remove('show'),2600); }

/* ---------- reveal on scroll ---------- */
let io,vio;
function observe(root=document){
  if(!('IntersectionObserver' in window)){ $$('.rv,.viz',root).forEach(el=>el.classList.add('in')); return; }
  if(!io){
    io=new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
    vio=new IntersectionObserver(es=>es.forEach(e=>e.target.classList.toggle('in',e.isIntersecting)),{threshold:.45});
  }
  $$('.rv:not(.in)',root).forEach(el=>io.observe(el));
  $$('.viz',root).forEach(el=>vio.observe(el));
}

const ready=fetch('data/tools.json').then(r=>{ if(!r.ok) throw new Error(r.status); return r.json(); }).then(d=>{
  T.push(...d); newest.push(...[...T].sort((a,b)=>a.a-b.a));
  Object.entries(CATS).forEach(([k,v])=>{ v.ct=T.filter(t=>inCat(t,k)).length; });
  $$('[data-ct]').forEach(e=>{ const c=CATS[e.dataset.ct].ct; e.textContent=c+(c===1?' tool':' tools'); });
  $('#megaNew').innerHTML=newest.slice(0,3).map(t=>`<li><a href="${toolUrl(t.id)}">${lg(t,'lg-s')}<span><b>${esc(t.n)}</b></span></a></li>`).join('');
  $('#megaAll').firstChild.textContent=`Browse all ${T.length} tools `;
}).catch(e=>{
  console.error('tools.json failed',e);
  const m=document.querySelector('main'); if(m) m.innerHTML='<div class="wrap" style="padding:140px 0"><h2>We couldn’t load the directory.</h2><p>Reload the page, or try again in a minute.</p></div>';
  return new Promise(()=>{});
});
/* ---------- actions with effect ----------
   Forms POST JSON to a Formspree-compatible endpoint (also works with Basin, Getform, Formcarry).
   Paste each form's URL here. While one is empty, its form says so instead of faking success. */
const ENDPOINTS={newsletter:'',tool:'',review:'',contact:''};
class NotConfigured extends Error{}
/* sends the form's fields as `kind`; a filled honeypot (_gotcha) resolves without sending */
async function submitForm(kind,form,extra={}){
  const data={...Object.fromEntries(new FormData(form)),...extra};
  if(data._gotcha) return data;
  if(!ENDPOINTS[kind]) throw new NotConfigured(kind);
  const r=await fetch(ENDPOINTS[kind],{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify({_form:kind,...data})});
  if(!r.ok) throw new Error(r.status);
  return data;
}
const failMsg=e=>e instanceof NotConfigured?'This form isn’t connected yet. Nothing was sent.':'Couldn’t send that. Check your connection and try again.';

/* saved tools: per-device list in localStorage */
const SAVED_KEY='af:saved';
const saved=()=>{ try{ const s=JSON.parse(localStorage.getItem(SAVED_KEY)||'[]'); return Array.isArray(s)?s:[]; }catch(e){ return []; } };
const isSaved=id=>saved().includes(id);
function toggleSaved(id){ try{ const s=saved(), i=s.indexOf(id); i<0?s.push(id):s.splice(i,1); localStorage.setItem(SAVED_KEY,JSON.stringify(s)); }catch(e){} return isSaved(id); }

const AF={ready,$,$$,esc,hash,RM,FINE,CATS,GROUPS,inCat,T,FEAT,has,byId,lg,stars,isFree,price,priceNum,startLabel,freeLabel,platforms,ago,fmt,ARROW,newest,toolUrl,catUrl,cmpUrl,tiers,reviews,rank,rankCats,card,toast,observe,
  submitForm,failMsg,saved,isSaved,toggleSaved,
  searchHandler:()=>{ location.href='index.html#search'; }};
window.AF=AF;

/* ---------- site chrome: header, drawer, footer, utilities ---------- */
const catEntries=GROUPS, nCats=Object.keys(CATS).length, allCatsUrl=catUrl()+'#categories';
const cur=p=>document.body.dataset.page===p?' aria-current="page"':'';
function insert(html,before){
  const box=document.createElement('div'); box.innerHTML=html;
  while(box.firstChild) document.body.insertBefore(box.firstChild,before);
}
insert(`
<a class="skip" href="#main">Skip to content</a>
<header class="nav" id="nav">
  <div class="wrap nav-in">
    <a class="brand" href="index.html" id="brand" aria-label="AutomationFindr, home">
      <svg viewBox="0 0 28 28" aria-hidden="true"><rect width="28" height="28" rx="8" fill="#0F766E"/>
        <g class="ring"><circle cx="14" cy="14" r="6.2" fill="none" stroke="#fff" stroke-width="2"/><path d="M14 4.5v3M14 20.5v3M4.5 14h3M20.5 14h3" stroke="#fff" stroke-width="1.6" stroke-linecap="round" opacity=".55"/></g>
        <g class="orbit"><circle cx="14" cy="14" r="2" fill="#F59E0B"/></g></svg>
      AutomationFindr
    </a>
    <nav aria-label="Primary"><ul class="menu">
      <li class="mega-host" id="megaHost">
        <button type="button" id="megaBtn" aria-expanded="false" aria-controls="mega">Explore tools
          <svg class="chev" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 4.5L6 8l3.5-3.5"/></svg></button>
        <div class="mega" id="mega" role="region" aria-label="Browse tools by category">
          <div class="mega-cats">${catEntries.map(([k,v])=>`<a href="${catUrl(k)}" style="--c:${v.c}"><span class="ci">${v.i}</span><span><b>${esc(v.n)}</b><small data-ct="${k}"></small></span></a>`).join('')}</div>
          <div class="mega-side"><h4>New this week</h4><ul id="megaNew"></ul><a class="all" id="megaAll" href="${catUrl()}">Browse all tools ${ARROW}</a><a class="all" href="${allCatsUrl}" style="margin-left:14px">All ${nCats} categories</a></div>
        </div>
      </li>
      <li><a href="compare.html"${cur('compare')}>Compare</a></li>
      <li><a href="collections.html"${cur('collections')}>Collections</a></li>
      <li><a href="articles.html?k=guides"${cur('guides')}>Guides</a></li>
      <li><a href="saved.html"${cur('saved')}>Saved</a></li>
      <li><a class="tip" href="submit.html" data-tip="Know a tool we're missing? Tell us."${cur('submit')}>Submit a tool</a></li>
    </ul></nav>
    <div class="nav-r">
      <button class="nav-search" id="navSearch" type="button" aria-label="Search tools">
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" aria-hidden="true"><circle cx="9" cy="9" r="5.5"/><path d="M13.2 13.2L17 17"/></svg>Search tools <kbd aria-hidden="true">/</kbd></button>
      <a class="btn" href="index.html#search" id="ctaNav">Start searching</a>
      <button class="burger" id="burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="drawer"><span></span></button>
    </div>
  </div>
</header>
<div class="drawer" id="drawer" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="drawer-top"><span class="brand">AutomationFindr</span>
    <button class="burger" id="drawerClose" type="button" aria-label="Close menu" style="display:flex"><svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M3 3l12 12M15 3L3 15"/></svg></button></div>
  <nav aria-label="Mobile"><a href="${catUrl()}">Explore tools</a><a href="compare.html">Compare</a><a href="collections.html">Collections</a><a href="articles.html?k=guides">Guides</a><a href="saved.html">Saved</a><a href="submit.html">Submit a tool</a></nav>
  <div class="chips" style="display:flex;flex-wrap:wrap;gap:8px;margin:26px 0">${catEntries.map(([k,v])=>`<a class="chip" href="${catUrl(k)}">${esc(v.n)}</a>`).join('')}<a class="chip" href="${allCatsUrl}">All ${nCats} categories</a></div>
  <a class="btn" href="index.html#search">Start searching</a>
</div>`,$('main'));

insert(`
<footer class="foot" id="foot"><div class="wrap">
  <div class="foot-top">
    <div><a class="brand" href="index.html" aria-label="AutomationFindr, home"><svg viewBox="0 0 28 28" aria-hidden="true" style="width:30px;height:30px"><rect width="28" height="28" rx="8" fill="#0F766E"/><circle cx="14" cy="14" r="6.2" fill="none" stroke="#fff" stroke-width="2"/><circle cx="14" cy="14" r="2" fill="#F59E0B"/></svg>AutomationFindr</a>
      <p class="tag">Find your next automation tool.</p></div>
    <nav aria-label="Directory"><h4>Directory</h4><ul><li><a href="${catUrl()}">All tools</a></li><li><a href="${allCatsUrl}">Categories</a></li><li><a href="compare.html">Compare</a></li><li><a href="saved.html">Saved</a></li><li><a href="collections.html">Collections</a></li><li><a href="index.html#fresh-sec">New arrivals</a></li></ul></nav>
    <nav aria-label="Resources"><h4>Resources</h4><ul><li><a href="articles.html?k=blog">Blog</a></li><li><a href="articles.html?k=guides">Guides</a></li><li><a href="index.html#h-news">Newsletter</a></li><li><a href="api.html">API docs</a></li><li><a href="changelog.html">Changelog</a></li></ul></nav>
    <nav aria-label="Company"><h4>Company</h4><ul><li><a href="about.html">About</a></li><li><a href="contact.html">Contact</a></li><li><a href="submit.html">Submit a tool</a></li><li><a href="privacy.html">Privacy</a></li><li><a href="terms.html">Terms</a></li></ul></nav>
  </div>
  <div class="foot-bot"><p>© 2026 AutomationFindr. Made with craft, not templates.</p>
    <div class="soc">
      <a href="#" aria-label="AutomationFindr on Twitter"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4.5 4.5h3.6L19.5 19.5h-3.6z"/><path d="M18.8 4.5L5.2 19.5"/></svg></a>
      <a href="#" aria-label="AutomationFindr on LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><path d="M8 10.5V16M8 7.8v.01M11.6 16v-5.5M11.6 13c0-1.6 1-2.6 2.4-2.6s2.1 1 2.1 2.6V16"/></svg></a>
      <a href="#" aria-label="AutomationFindr on GitHub"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="7" cy="6" r="2.2"/><circle cx="7" cy="18" r="2.2"/><circle cx="17" cy="9" r="2.2"/><path d="M7 8.2v7.6M17 11.2c0 3.4-4 3.6-10 6"/></svg></a>
    </div></div>
</div></footer>
<button class="totop" id="totop" type="button" aria-label="Back to top"><svg viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 15V3M3.5 8.5L9 3l5.5 5.5"/></svg></button>
<div class="toast" id="toast" role="status" aria-live="polite"></div>
<div class="cur" id="cur" aria-hidden="true"></div>`,document.body.querySelector(':scope > script'));
toastEl=$('#toast');

/* ---------- chrome behavior ---------- */
const nav=$('#nav'), navSearch=$('#navSearch'), totop=$('#totop'), heroBox=$('#sbox'); let tick=false;
function onScroll(){
  tick=false; const y=scrollY;
  nav.style.setProperty('--p',Math.min(y/100,1).toFixed(3));
  navSearch.classList.toggle('show',heroBox?heroBox.getBoundingClientRect().bottom<64:true);
  totop.classList.toggle('show',y>500);
}
addEventListener('scroll',()=>{ if(!tick){tick=true;requestAnimationFrame(onScroll);} },{passive:true});
addEventListener('resize',onScroll); onScroll();
totop.addEventListener('click',()=>scrollTo({top:0,behavior:RM?'auto':'smooth'}));
navSearch.addEventListener('click',()=>AF.searchHandler());
$('#ctaNav').addEventListener('click',e=>{ e.preventDefault(); AF.searchHandler(); });
document.addEventListener('keydown',e=>{
  if(e.key==='/'&&!/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)&&!e.metaKey&&!e.ctrlKey&&!e.altKey){ e.preventDefault(); AF.searchHandler(); }
});

const mHost=$('#megaHost'), mBtn=$('#megaBtn'), mega=$('#mega'); let mt;
const setMega=o=>{ mega.classList.toggle('open',o); mBtn.setAttribute('aria-expanded',o); };
mBtn.addEventListener('click',()=>setMega(!mega.classList.contains('open')));
if(FINE){ mHost.addEventListener('mouseenter',()=>{clearTimeout(mt);setMega(true);}); mHost.addEventListener('mouseleave',()=>{mt=setTimeout(()=>setMega(false),160);}); }
mHost.addEventListener('focusout',e=>{ if(!mHost.contains(e.relatedTarget)) setMega(false); });
mHost.addEventListener('keydown',e=>{ if(e.key==='Escape'){ setMega(false); mBtn.focus(); } });
document.addEventListener('pointerdown',e=>{ if(!mHost.contains(e.target)) setMega(false); });

const drawer=$('#drawer'), burger=$('#burger');
function setDrawer(o){ drawer.classList.toggle('open',o); burger.setAttribute('aria-expanded',o); document.body.style.overflow=o?'hidden':''; if(o) $('#drawerClose').focus(); else burger.focus({preventScroll:true}); }
burger.addEventListener('click',()=>setDrawer(true));
$('#drawerClose').addEventListener('click',()=>setDrawer(false));
drawer.addEventListener('click',e=>{ if(e.target.closest('a')) setDrawer(false); });
document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&drawer.classList.contains('open')) setDrawer(false); });

const brand=$('#brand'); let bt;
brand.addEventListener('mouseenter',()=>{ bt=setTimeout(()=>{ brand.classList.add('wow'); setTimeout(()=>brand.classList.remove('wow'),1400); },2000); });
brand.addEventListener('mouseleave',()=>clearTimeout(bt));

document.addEventListener('click',e=>{ const a=e.target.closest('a[href="#"]'); if(a){ e.preventDefault(); toast('That page is part of the next build.'); } });

/* page transitions: content fades out 200 ms before leaving; the incoming page fades in (see shared.css) */
if(!RM){
  document.addEventListener('click',e=>{
    const a=e.target.closest('a[href]');
    if(!a||e.defaultPrevented||e.button||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target||a.hasAttribute('download')) return;
    const u=new URL(a.href);
    if(u.origin!==location.origin||(u.pathname===location.pathname&&u.search===location.search)) return;
    e.preventDefault(); document.documentElement.classList.add('leaving');
    setTimeout(()=>{ location.href=a.href; },200);
  });
  addEventListener('pageshow',e=>{ if(e.persisted) document.documentElement.classList.remove('leaving'); });
}

{ const d=new Date(), h=d.getHours()+d.getMinutes()/60; $('#foot').style.setProperty('--warm',Math.round((Math.sin((h-6)/24*Math.PI*2)*.5+.5)*100)+'%'); }

if(FINE&&!RM){
  const c=$('#cur'); let tx=0,ty=0,x=0,y=0,run=false;
  const HOT='a,button,[role=option],[role=tab],.chip,.mini,.fcard,.tcard,.cat';
  const loop=()=>{ x+=(tx-x)*.22; y+=(ty-y)*.22; c.style.transform=`translate(${x}px,${y}px)`; if(Math.abs(tx-x)+Math.abs(ty-y)>.3) requestAnimationFrame(loop); else run=false; };
  addEventListener('pointermove',e=>{ tx=e.clientX; ty=e.clientY; c.classList.toggle('on',!!e.target.closest(HOT)); if(!run){ run=true; requestAnimationFrame(loop); } },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>c.classList.remove('on'));
}
})();
