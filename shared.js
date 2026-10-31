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
 workflow:{n:'Workflow & No-Code',c:'#0F766E',ct:142,i:ic('<circle class="f" cx="5" cy="6" r="2.6"/><circle class="f" cx="5" cy="18" r="2.6"/><circle class="f" cx="19" cy="12" r="2.6"/><path d="M7.6 6h3.4c3.2 0 3.2 6 6.4 6M7.6 18H11c3.2 0 3.2-6 6.4-6"/>')},
 ai:{n:'AI Agents',c:'#7C3AED',ct:118,i:ic('<path class="f" d="M10.5 3.5l1.9 5.1 5.1 1.9-5.1 1.9-1.9 5.1-1.9-5.1-5.1-1.9 5.1-1.9z"/><path d="M18.5 15.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>')},
 email:{n:'Email & Outreach',c:'#B45309',ct:96,i:ic('<rect class="f" x="3" y="5.5" width="18" height="13" rx="3"/><path d="M4 8l8 5.5L20 8"/>')},
 crm:{n:'CRM & Sales',c:'#BE3A5C',ct:87,i:ic('<circle class="f" cx="9" cy="8" r="3.2"/><path d="M3.5 19.5c0-3.3 2.4-5.5 5.5-5.5s5.5 2.2 5.5 5.5"/><path d="M18 9v7M21 12v4"/>')},
 devops:{n:'DevOps',c:'#3B6BA5',ct:104,i:ic('<rect class="f" x="3" y="4.5" width="18" height="15" rx="3"/><path d="M7.5 10l3 2.2-3 2.2M13 15h3.5"/>')},
 data:{n:'Data & ETL',c:'#4D7C0F',ct:91,i:ic('<ellipse class="f" cx="12" cy="6" rx="7" ry="2.8"/><path d="M5 6v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8V6M5 12v6c0 1.5 3.1 2.8 7 2.8s7-1.3 7-2.8v-6"/>')},
 marketing:{n:'Marketing',c:'#9D3F8F',ct:133,i:ic('<path class="f" d="M4 10v4h3.5L15 18V6L7.5 10z"/><path d="M18 9.5c1.3 1.2 1.3 3.8 0 5"/>')},
 finance:{n:'Finance & Invoicing',c:'#0E7490',ct:64,i:ic('<path class="f" d="M6 3.5h12v17l-3-2-3 2-3-2-3 2z"/><path d="M9.5 8.5h5M9.5 12h5"/>')},
 hr:{n:'HR & Ops',c:'#52525B',ct:52,i:ic('<circle class="f" cx="12" cy="5.5" r="2.5"/><circle class="f" cx="5.5" cy="18" r="2.5"/><circle class="f" cx="18.5" cy="18" r="2.5"/><path d="M12 8v3.5M12 11.5H5.5V15.5M12 11.5h6.5V15.5"/>')}
};
/* id, name, monogram, tile colour, category, rating, reviews, price label, tags, one-liner, search words, days since added */
const T=[
 {id:'n8n',n:'n8n',l:'n8n',c:'#E0435F',cat:'workflow',r:4.7,rv:1840,p:'Freemium',tg:['No-Code','Self-hosted','API'],d:'Self-hostable workflow builder with real code escape hatches.',k:'zapier alternative open source self hosted workflow code webhook',a:210},
 {id:'make',n:'Make',l:'Mk',c:'#6D28D9',cat:'workflow',r:4.6,rv:3210,p:'From $9/mo',tg:['No-Code','Visual','API'],d:'Visual scenario builder, priced per operation instead of per task.',k:'zapier alternative integromat visual scenario',a:300},
 {id:'zapier',n:'Zapier',l:'Zap',c:'#F97316',cat:'workflow',r:4.5,rv:5480,p:'From $19.99/mo',tg:['No-Code','7,000+ apps'],d:'The 7,000-app default. Simple to start, pricey at volume.',k:'zap integrations connect apps',a:400},
 {id:'activepieces',n:'Activepieces',l:'Ap',c:'#4F46E5',cat:'workflow',r:4.4,rv:412,p:'Free',tg:['No-Code','Open source','Self-hosted'],d:'Open-source Zapier alternative you can run on your own server.',k:'zapier alternative open source self hosted free',a:5},
 {id:'relay',n:'Relay.app',l:'Rl',c:'#0F766E',cat:'workflow',r:4.6,rv:310,p:'Freemium',tg:['No-Code','Human-in-the-loop'],d:'Automations that pause for a human to approve or edit.',k:'zapier alternative approval ai human review',a:3},
 {id:'tray',n:'Tray.io',l:'Tr',c:'#1D4ED8',cat:'workflow',r:4.2,rv:390,p:'Custom pricing',tg:['Enterprise','API'],d:'Enterprise iPaaS for connecting CRMs, support desks and data stores.',k:'integration crm slack enterprise ipaas connect',a:520},
 {id:'pabbly',n:'Pabbly Connect',l:'Pab',c:'#2563EB',cat:'workflow',r:4.2,rv:610,p:'From $19/mo',tg:['No-Code','Lifetime deals'],d:'Cheap integration builder with generous task limits.',k:'zapier alternative invoice sheets spreadsheet budget',a:380},
 {id:'lindy',n:'Lindy',l:'Li',c:'#7C3AED',cat:'ai',r:4.3,rv:268,p:'From $49/mo',tg:['AI Agents','No-Code'],d:'AI agents you assign tasks to, like a new hire.',k:'assistant agent inbox calendar',a:9},
 {id:'gumloop',n:'Gumloop',l:'Gl',c:'#DB2777',cat:'ai',r:4.5,rv:95,p:'Freemium',tg:['AI Agents','No-Code'],d:'Drag-and-drop canvas for chaining LLM steps and scrapers.',k:'llm gpt claude scraper pipeline',a:1},
 {id:'bardeen',n:'Bardeen',l:'Bar',c:'#8B5CF6',cat:'ai',r:4.3,rv:520,p:'Freemium',tg:['AI Agents','Browser'],d:'Browser automations that scrape, fill forms and push to your CRM.',k:'scrape invoice sheets chrome extension spreadsheet',a:260},
 {id:'instantly',n:'Instantly',l:'In',c:'#2563EB',cat:'email',r:4.6,rv:1120,p:'From $37/mo',tg:['Cold email','Deliverability'],d:'Cold email at volume with unlimited inbox rotation.',k:'cold outreach email sequences automation send personalized',a:330},
 {id:'lemlist',n:'Lemlist',l:'Lm',c:'#4F46E5',cat:'email',r:4.4,rv:980,p:'From $59/mo',tg:['Cold email','Personalization'],d:'Outreach with image and video personalization variables.',k:'cold outreach email sequences automation personalized',a:290},
 {id:'woodpecker',n:'Woodpecker',l:'Wp',c:'#16A34A',cat:'email',r:4.5,rv:640,p:'From $29/mo',tg:['Cold email','Follow-ups'],d:'Plain, reliable cold email with smart follow-up rules.',k:'cold outreach email sequences automation follow up',a:350},
 {id:'attio',n:'Attio',l:'At',c:'#1A1A1A',cat:'crm',r:4.7,rv:290,p:'From $29/mo',tg:['CRM','API','Workflows'],d:'A CRM you shape yourself, with automation built into the data model.',k:'crm sales pipeline no-code customer',a:2},
 {id:'rippling',n:'Rippling',l:'Rp',c:'#B45309',cat:'hr',r:4.5,rv:1600,p:'Custom pricing',tg:['HR','IT','Payroll'],d:'HR, IT and payroll on one workflow engine.',k:'onboarding employee payroll people ops',a:480},
 {id:'ghactions',n:'GitHub Actions',l:'GH',c:'#24292F',cat:'devops',r:4.7,rv:6200,p:'Free tier',tg:['CI/CD','API'],d:'CI/CD that lives next to your code, with a huge action marketplace.',k:'ci cd pipeline deploy build test devops free',a:600},
 {id:'windmill',n:'Windmill',l:'Wm',c:'#0891B2',cat:'devops',r:4.6,rv:140,p:'Free',tg:['Open source','Scripts','Self-hosted'],d:'Turn scripts in any language into workflows, UIs and cron jobs.',k:'code scripts python typescript internal tools open source free',a:6},
 {id:'argocd',n:'Argo CD',l:'Arg',c:'#EA580C',cat:'devops',r:4.6,rv:510,p:'Free',tg:['GitOps','Open source'],d:'Declarative GitOps delivery for Kubernetes.',k:'kubernetes k8s deploy gitops devops free',a:700},
 {id:'pulumi',n:'Pulumi',l:'Pu',c:'#7C3AED',cat:'devops',r:4.5,rv:840,p:'Freemium',tg:['IaC','API'],d:'Infrastructure as code in the languages you already write.',k:'terraform alternative infrastructure typescript python',a:450},
 {id:'airbyte',n:'Airbyte',l:'Ab',c:'#4F46E5',cat:'data',r:4.5,rv:730,p:'Freemium',tg:['ETL','Open source','Self-hosted'],d:'Open-source ELT with 400+ connectors.',k:'etl pipeline warehouse sync data open source',a:410},
 {id:'hightouch',n:'Hightouch',l:'Ht',c:'#0F766E',cat:'data',r:4.6,rv:310,p:'Freemium',tg:['Reverse ETL'],d:'Sync warehouse data back into the tools your team uses.',k:'reverse etl warehouse crm sync data',a:15},
 {id:'dagster',n:'Dagster',l:'Dg',c:'#4338CA',cat:'data',r:4.6,rv:270,p:'Free',tg:['Orchestration','Open source'],d:'Data orchestration that treats assets as the unit of work.',k:'airflow alternative pipeline orchestrate data free',a:12},
 {id:'clay',n:'Clay',l:'Cl',c:'#1A1A1A',cat:'marketing',r:4.7,rv:860,p:'From $134/mo',tg:['Enrichment','Outbound'],d:'Waterfall data enrichment and outbound workflows in a spreadsheet.',k:'lead enrichment growth outbound sales prospecting',a:7},
 {id:'buffer',n:'Buffer',l:'Bf',c:'#2563EB',cat:'marketing',r:4.4,rv:1900,p:'Freemium',tg:['Social','Scheduling'],d:'Schedule and track social posts without the clutter.',k:'social media posts schedule linkedin twitter free',a:500},
 {id:'invoiceninja',n:'Invoice Ninja',l:'IN',c:'#0E7490',cat:'finance',r:4.4,rv:350,p:'Freemium',tg:['Invoicing','Open source'],d:'Open-source invoicing and payments you can host yourself.',k:'invoice invoices generate sheets billing open source',a:4},
 {id:'dext',n:'Dext',l:'Dx',c:'#16A34A',cat:'finance',r:4.3,rv:480,p:'From $24/mo',tg:['Receipts','Bookkeeping'],d:'Snap a receipt, get a clean entry in your books.',k:'receipts expenses accounting invoice bookkeeping',a:470}
];
/* detail fields. fl flags: sh self-hosted, api, wh webhooks, sso, os open source. dm: d desktop, m mobile. ps: price of first paid plan on free/freemium tools */
const X={
 n8n:{f:2019,fl:'sh api wh os',ps:20,best:'Dev-leaning teams under 10 people',not:'Non-technical teams who want zero maintenance',love:['Code nodes when the UI runs out','Self-hosting keeps data in-house'],gripe:['The cloud plan caps executions','Steeper than Zapier on day one'],uniq:'Fair-code license with a self-hosted community edition',int:['Slack','Google Sheets','Postgres','OpenAI','Notion','GitHub']},
 make:{f:2012,fl:'api wh sso',best:'Ops teams building visual, multi-step scenarios',not:'High-volume simple automations, where per-operation pricing adds up',love:['Routers and iterators drawn on the canvas','Cheap per operation at low volume'],gripe:['Debugging long scenarios gets fiddly','Operations add up fast inside loops'],uniq:'Routers and iterators drawn right on the canvas',int:['Slack','Airtable','Gmail','HubSpot','Shopify','Stripe']},
 zapier:{f:2011,fl:'api wh sso',best:'Non-technical teams who need an app for everything',not:'Heavy-volume workflows on a tight budget',love:['7,000+ app connectors','Setup takes minutes'],gripe:['Gets expensive at volume','Branching logic feels bolted on'],uniq:'The widest app catalog in the category',int:['Slack','Gmail','Salesforce','Notion','Trello','Mailchimp']},
 activepieces:{f:2022,fl:'sh api wh os',ps:25,best:'Small teams that want an open-source Zapier',not:'Teams that need 1,000+ prebuilt apps today',love:['MIT licensed and easy to self-host','Clean, fast builder'],gripe:['Smaller integration list','Young community'],uniq:'MIT-licensed, with community-written pieces',int:['Slack','Google Sheets','OpenAI','Notion','Discord','GitHub']},
 relay:{f:2022,fl:'api wh',dm:'m',ps:19,best:'Teams that need a person to approve certain steps',not:'Fully unattended, high-volume pipelines',love:['Human approval steps built in','Friendly to non-developers'],gripe:['Fewer integrations than Zapier','Pricing climbs with step count'],uniq:'Human-in-the-loop steps are first-class',int:['Slack','Gmail','Notion','Asana','HubSpot','OpenAI']},
 tray:{f:2012,fl:'api wh sso',best:'Enterprise IT teams standardizing integrations',not:'Solo founders and small teams',love:['Strong governance and SSO','Handles complex data mapping'],gripe:['Sales-led pricing','Overkill for simple jobs'],uniq:'Embedded iPaaS for shipping integrations to your own customers',int:['Salesforce','Slack','Zendesk','Snowflake','NetSuite','Workday']},
 pabbly:{f:2018,fl:'api wh',best:'Budget-conscious teams with many simple automations',not:'Teams that need enterprise controls',love:['Generous task limits for the price','Lifetime deal options'],gripe:['The interface feels dated','Smaller connector list'],uniq:'Lifetime-deal pricing options',int:['Google Sheets','Stripe','Mailchimp','Shopify','WhatsApp','Gmail']},
 lindy:{f:2023,fl:'api wh',dm:'m',best:'Individuals delegating inbox and calendar chores',not:'Teams that need deterministic, auditable flows',love:['Agents handle messy inbox tasks','Quick to set up'],gripe:['Agents occasionally misjudge edge cases','Credit usage is hard to predict'],uniq:'Agents you brief in plain English',int:['Gmail','Google Calendar','Slack','HubSpot','Notion','Zoom']},
 gumloop:{f:2023,fl:'api wh',ps:37,best:'Ops people chaining LLM steps with scrapers',not:'Anyone who needs on-prem hosting',love:['Visual canvas for LLM chains','Strong templates'],gripe:['Credits burn quickly','Young product, still shifting'],uniq:'Built-in web scraper and LLM nodes on one canvas',int:['OpenAI','Google Sheets','Slack','Airtable','Notion','Gmail']},
 bardeen:{f:2020,fl:'api',dm:'d',ps:15,best:'Sales and recruiting teams who work in the browser',not:'Server-side, unattended workflows',love:['Scrape-to-spreadsheet in one click','Works on almost any site'],gripe:['Breaks when pages change','Runs in your browser only'],uniq:'Automations that run on the page you are looking at',int:['Google Sheets','Notion','HubSpot','LinkedIn','Airtable','Slack']},
 instantly:{f:2021,fl:'api wh',best:'Agencies sending outbound at volume',not:'Low-volume, one-to-one outreach',love:['Unlimited inbox rotation','Solid deliverability tooling'],gripe:['Support can be slow','Lead database quality varies'],uniq:'Unlimited sending accounts on every plan',int:['HubSpot','Pipedrive','Slack','Zapier','Clay','Salesforce']},
 lemlist:{f:2018,fl:'api wh',best:'Outbound teams that sell on personalization',not:'Teams that only need plain-text blasts',love:['Image and video personalization','Multichannel sequences'],gripe:['Pricier per seat','Sequences take time to learn'],uniq:'Dynamic images and video inside emails',int:['HubSpot','Salesforce','Pipedrive','Zapier','LinkedIn','Slack']},
 woodpecker:{f:2015,fl:'api wh',best:'Small B2B teams that value reliability',not:'Teams that want a lead database inside the tool',love:['Deliverability and bounce shield','Straightforward UI'],gripe:['Fewer integrations','Reporting is basic'],uniq:'Bounce shield that pauses risky sends',int:['Pipedrive','HubSpot','Zapier','Slack','Salesforce','Gmail']},
 attio:{f:2019,fl:'api wh sso',dm:'m',best:'Startups that outgrew a spreadsheet CRM',not:'Large sales orgs that need heavy custom reporting',love:['Flexible data model','Fast, clean UI'],gripe:['Reporting is still maturing','Fewer integrations than HubSpot'],uniq:'Objects and attributes you can reshape yourself',int:['Gmail','Slack','Google Calendar','Zapier','Typeform','Stripe']},
 rippling:{f:2016,fl:'api wh sso',dm:'m',best:'Growing companies unifying HR, IT and payroll',not:'Teams under 10 with simple payroll needs',love:['One system for people and devices','Powerful workflow rules'],gripe:['Quote-based pricing','Setup takes weeks'],uniq:'Device and app provisioning tied to HR events',int:['Slack','Okta','Google Workspace','Zoom','Salesforce','NetSuite']},
 ghactions:{f:2018,fl:'api wh sso',ps:4,best:'Any team already on GitHub',not:'Teams on other Git hosts',love:['Lives next to the code','Huge action marketplace'],gripe:['YAML gets unwieldy','Minutes cost extra on private repos'],uniq:'A marketplace of reusable actions',int:['Docker','AWS','Azure','Slack','Terraform','Kubernetes']},
 windmill:{f:2022,fl:'sh api wh sso os',best:'Engineers who prefer scripts to canvases',not:'Non-technical users',love:['Any language, one platform','Fast execution'],gripe:['The UI for non-devs is basic','Smaller community'],uniq:'Scripts become UIs, webhooks and cron jobs automatically',int:['Postgres','Slack','GitHub','S3','OpenAI','Stripe']},
 argocd:{f:2018,fl:'sh api wh sso os',best:'Platform teams running Kubernetes',not:'Teams that are not on Kubernetes',love:['Declarative and auditable','Clear drift detection'],gripe:['Steep initial setup','UI can lag on huge clusters'],uniq:'Continuous drift detection against Git',int:['Kubernetes','GitHub','GitLab','Helm','Slack','Prometheus']},
 pulumi:{f:2017,fl:'api sso os',ps:40,best:'Developers who want real languages for infrastructure',not:'Teams happy with plain Terraform HCL',love:['Loops and tests like normal code','Strong multi-cloud support'],gripe:['Smaller community than Terraform','State backend choices confuse newcomers'],uniq:'TypeScript, Python, Go and C# for infrastructure',int:['AWS','Azure','GCP','Kubernetes','GitHub','Datadog']},
 airbyte:{f:2020,fl:'sh api sso os',ps:10,best:'Data teams with many sources to sync',not:'Real-time streaming needs',love:['400+ connectors','Open source and self-hostable'],gripe:['Some connectors are community-grade','Resource hungry at scale'],uniq:'A connector builder for custom sources',int:['Snowflake','BigQuery','Postgres','Salesforce','Stripe','S3']},
 hightouch:{f:2018,fl:'api sso',ps:450,best:'Data teams activating warehouse data in business tools',not:'Teams without a data warehouse',love:['Models and audiences in SQL','Great sync debugging'],gripe:['Costs scale with destinations','Needs a warehouse first'],uniq:'An audience builder on top of your warehouse',int:['Snowflake','BigQuery','Salesforce','HubSpot','Braze','Segment']},
 dagster:{f:2018,fl:'sh api sso os',best:'Data engineers who think in assets',not:'Teams that only need simple scheduled jobs',love:['The asset-based mental model','Excellent local development'],gripe:['The concepts take time','Smaller ecosystem than Airflow'],uniq:'Software-defined assets with lineage built in',int:['dbt','Snowflake','BigQuery','Spark','Airbyte','Slack']},
 clay:{f:2017,fl:'api wh sso',best:'Growth teams enriching leads at scale',not:'Teams on a tight monthly budget',love:['Waterfall enrichment across providers','Spreadsheet-style flow'],gripe:['Credit costs add up','Steep jump from entry plans'],uniq:'Waterfall enrichment across 75+ data providers',int:['HubSpot','Salesforce','Slack','Instantly','LinkedIn','Google Sheets']},
 buffer:{f:2010,fl:'api',dm:'m',ps:6,best:'Small teams scheduling social posts',not:'Teams that need deep social analytics or a unified inbox',love:['Clean, fast scheduler','Generous free plan'],gripe:['Analytics are light','Few automation hooks'],uniq:'Simple queue-based scheduling',int:['Canva','Zapier','Feedly','Pocket','Google Drive','Slack']},
 invoiceninja:{f:2014,fl:'sh api wh os',dm:'m',ps:10,best:'Freelancers and agencies who want to self-host billing',not:'Companies that need deep accounting',love:['Self-hostable','Recurring invoices that just work'],gripe:['Reporting is limited','Self-hosting needs upkeep'],uniq:'Open-source invoicing with a client portal',int:['Stripe','PayPal','Zapier','QuickBooks','Google Sheets','Slack']},
 dext:{f:2010,fl:'api',dm:'m',best:'Small businesses drowning in receipts',not:'Teams that need full ERP workflows',love:['Accurate receipt extraction','Plays well with Xero and QuickBooks'],gripe:['Per-item fees add up','The mobile app can be slow'],uniq:'Receipt capture that posts straight to your books',int:['Xero','QuickBooks','FreshBooks','Sage','Zapier','Stripe']}
};
T.forEach(t=>{ const x=X[t.id]; Object.assign(t,x,{fl:x.fl.split(' '),dm:x.dm||''}); });

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
const newest=[...T].sort((a,b)=>a.a-b.a);
const toolUrl=id=>`tool.html?id=${id}`;
const catUrl=k=>k?`category.html?c=${k}`:'category.html';
const cmpUrl=ids=>`compare.html?tools=${ids.join(',')}`;

function tiers(t){
  const ps=t.ps, p=priceNum(t);
  if(/Custom/.test(t.p)) return [{n:'Custom',p:'Talk to sales',d:'Scoped to your team size and needs.',hl:1}];
  if(isFree(t)){
    const out=[{n:'Free',p:'$0',d:/Self-hosted/.test(t.tg.join())?'Self-host it, or use the limited cloud plan.':'Core features with usage caps.'}];
    if(ps) out.push({n:'Paid',p:`From $${ps}/mo`,d:'Higher limits and priority support.',hl:1},{n:'Enterprise',p:'Custom',d:'SSO, audit logs and an SLA.'});
    return out;
  }
  return [{n:'Starter',p:`$${p}/mo`,d:'Core features for one person or a small team.'},{n:'Pro',p:`$${Math.round(p*2.5)}/mo`,d:'Higher limits, more seats, priority support.',hl:1},{n:'Business',p:'Custom',d:'SSO, audit logs and an SLA.'}];
}
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
function rank(text,pool=T){
  const toks=text.toLowerCase().split(/[^a-z0-9+.#-]+/).filter(Boolean).map(w=>w.length>3?w.replace(/s$/,''):w);
  if(!toks.length) return [];
  return pool.map(t=>{
    const name=t.n.toLowerCase(), cat=CATS[t.cat].n.toLowerCase(), tags=t.tg.join(' ').toLowerCase();
    const hay=`${name} ${cat} ${tags} ${t.d.toLowerCase()} ${t.k} ${isFree(t)?'free':''}`;
    let s=0;
    toks.forEach(w=>{ if(name===w)s+=10; else if(name.startsWith(w))s+=8; else if(name.includes(w))s+=5; else if(tags.includes(w))s+=4; else if(cat.includes(w))s+=3; else if(hay.includes(w))s+=2; });
    return {t,s};
  }).filter(x=>x.s>0).sort((a,b)=>b.s-a.s||b.t.rv-a.t.rv).map(x=>x.t);
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

const AF={$,$$,esc,hash,RM,FINE,CATS,T,FEAT,has,byId,lg,stars,isFree,price,priceNum,startLabel,freeLabel,platforms,ago,fmt,ARROW,newest,toolUrl,catUrl,cmpUrl,tiers,reviews,rank,card,toast,observe,
  searchHandler:()=>{ location.href='index.html#search'; }};
window.AF=AF;

/* ---------- site chrome: header, drawer, footer, utilities ---------- */
const catEntries=Object.entries(CATS);
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
          <div class="mega-cats">${catEntries.map(([k,v])=>`<a href="${catUrl(k)}" style="--c:${v.c}"><span class="ci">${v.i}</span><span><b>${esc(v.n)}</b><small>${v.ct} tools</small></span></a>`).join('')}</div>
          <div class="mega-side"><h4>New this week</h4><ul>${newest.slice(0,3).map(t=>`<li><a href="${toolUrl(t.id)}">${lg(t,'lg-s')}<span><b>${esc(t.n)}</b></span></a></li>`).join('')}</ul><a class="all" href="${catUrl()}">Browse all 2,412 tools ${ARROW}</a></div>
        </div>
      </li>
      <li><a href="compare.html"${cur('compare')}>Compare</a></li>
      <li><a href="#">Collections</a></li>
      <li><a href="#">Guides</a></li>
      <li><a class="tip" href="#" data-tip="Know a tool we're missing? Tell us.">Submit a tool</a></li>
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
  <nav aria-label="Mobile"><a href="${catUrl()}">Explore tools</a><a href="compare.html">Compare</a><a href="#">Collections</a><a href="#">Guides</a><a href="#">Submit a tool</a></nav>
  <div class="chips" style="display:flex;flex-wrap:wrap;gap:8px;margin:26px 0">${catEntries.map(([k,v])=>`<a class="chip" href="${catUrl(k)}">${esc(v.n)}</a>`).join('')}</div>
  <a class="btn" href="index.html#search">Start searching</a>
</div>`,$('main'));

insert(`
<footer class="foot" id="foot"><div class="wrap">
  <div class="foot-top">
    <div><a class="brand" href="index.html" aria-label="AutomationFindr, home"><svg viewBox="0 0 28 28" aria-hidden="true" style="width:30px;height:30px"><rect width="28" height="28" rx="8" fill="#0F766E"/><circle cx="14" cy="14" r="6.2" fill="none" stroke="#fff" stroke-width="2"/><circle cx="14" cy="14" r="2" fill="#F59E0B"/></svg>AutomationFindr</a>
      <p class="tag">Find your next automation tool.</p></div>
    <nav aria-label="Directory"><h4>Directory</h4><ul><li><a href="${catUrl()}">All tools</a></li><li><a href="${catUrl()}">Categories</a></li><li><a href="compare.html">Compare</a></li><li><a href="#">Collections</a></li><li><a href="index.html#fresh-sec">New arrivals</a></li></ul></nav>
    <nav aria-label="Resources"><h4>Resources</h4><ul><li><a href="#">Blog</a></li><li><a href="#">Guides</a></li><li><a href="index.html#h-news">Newsletter</a></li><li><a href="#">API docs</a></li><li><a href="#">Changelog</a></li></ul></nav>
    <nav aria-label="Company"><h4>Company</h4><ul><li><a href="#">About</a></li><li><a href="#">Contact</a></li><li><a href="#">Submit a tool</a></li><li><a href="#">Privacy</a></li><li><a href="#">Terms</a></li></ul></nav>
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

{ const d=new Date(), h=d.getHours()+d.getMinutes()/60; $('#foot').style.setProperty('--warm',Math.round((Math.sin((h-6)/24*Math.PI*2)*.5+.5)*100)+'%'); }

if(FINE&&!RM){
  const c=$('#cur'); let tx=0,ty=0,x=0,y=0,run=false;
  const HOT='a,button,[role=option],[role=tab],.chip,.mini,.fcard,.tcard,.cat';
  const loop=()=>{ x+=(tx-x)*.22; y+=(ty-y)*.22; c.style.transform=`translate(${x}px,${y}px)`; if(Math.abs(tx-x)+Math.abs(ty-y)>.3) requestAnimationFrame(loop); else run=false; };
  addEventListener('pointermove',e=>{ tx=e.clientX; ty=e.clientY; c.classList.toggle('on',!!e.target.closest(HOT)); if(!run){ run=true; requestAnimationFrame(loop); } },{passive:true});
  document.documentElement.addEventListener('pointerleave',()=>c.classList.remove('on'));
}
})();
