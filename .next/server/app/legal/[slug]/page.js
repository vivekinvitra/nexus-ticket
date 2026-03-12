"use strict";(()=>{var e={};e.id=171,e.ids=[171],e.modules={7849:e=>{e.exports=require("next/dist/client/components/action-async-storage.external")},2934:e=>{e.exports=require("next/dist/client/components/action-async-storage.external.js")},5403:e=>{e.exports=require("next/dist/client/components/request-async-storage.external")},4580:e=>{e.exports=require("next/dist/client/components/request-async-storage.external.js")},4749:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external")},5869:e=>{e.exports=require("next/dist/client/components/static-generation-async-storage.external.js")},399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},1843:(e,t,r)=>{r.r(t),r.d(t,{GlobalError:()=>n.a,__next_app__:()=>p,originalPathname:()=>u,pages:()=>d,routeModule:()=>f,tree:()=>c}),r(2855),r(2029),r(2523);var o=r(3191),i=r(8716),a=r(7922),n=r.n(a),s=r(5231),l={};for(let e in s)0>["default","tree","pages","GlobalError","originalPathname","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>s[e]);r.d(t,l);let c=["",{children:["legal",{children:["[slug]",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,2855)),"D:\\New-world\\google-ai\\nexus-tickets\\src\\app\\legal\\[slug]\\page.tsx"]}]},{}]},{}]},{layout:[()=>Promise.resolve().then(r.bind(r,2029)),"D:\\New-world\\google-ai\\nexus-tickets\\src\\app\\layout.tsx"],"not-found":[()=>Promise.resolve().then(r.bind(r,2523)),"D:\\New-world\\google-ai\\nexus-tickets\\src\\app\\not-found.tsx"]}],d=["D:\\New-world\\google-ai\\nexus-tickets\\src\\app\\legal\\[slug]\\page.tsx"],u="/legal/[slug]/page",p={require:r,loadChunk:()=>Promise.resolve()},f=new o.AppPageRouteModule({definition:{kind:i.x.APP_PAGE,page:"/legal/[slug]/page",pathname:"/legal/[slug]",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:c}})},8585:(e,t,r)=>{var o=r(1085);r.o(o,"notFound")&&r.d(t,{notFound:function(){return o.notFound}})},1085:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{ReadonlyURLSearchParams:function(){return n},RedirectType:function(){return o.RedirectType},notFound:function(){return i.notFound},permanentRedirect:function(){return o.permanentRedirect},redirect:function(){return o.redirect}});let o=r(3953),i=r(6399);class a extends Error{constructor(){super("Method unavailable on `ReadonlyURLSearchParams`. Read more: https://nextjs.org/docs/app/api-reference/functions/use-search-params#updating-searchparams")}}class n extends URLSearchParams{append(){throw new a}delete(){throw new a}set(){throw new a}sort(){throw new a}}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},6399:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{isNotFoundError:function(){return i},notFound:function(){return o}});let r="NEXT_NOT_FOUND";function o(){let e=Error(r);throw e.digest=r,e}function i(e){return"object"==typeof e&&null!==e&&"digest"in e&&e.digest===r}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},8586:(e,t)=>{var r;Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"RedirectStatusCode",{enumerable:!0,get:function(){return r}}),function(e){e[e.SeeOther=303]="SeeOther",e[e.TemporaryRedirect=307]="TemporaryRedirect",e[e.PermanentRedirect=308]="PermanentRedirect"}(r||(r={})),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},3953:(e,t,r)=>{var o;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{RedirectType:function(){return o},getRedirectError:function(){return l},getRedirectStatusCodeFromError:function(){return g},getRedirectTypeFromError:function(){return f},getURLFromRedirectError:function(){return p},isRedirectError:function(){return u},permanentRedirect:function(){return d},redirect:function(){return c}});let i=r(4580),a=r(2934),n=r(8586),s="NEXT_REDIRECT";function l(e,t,r){void 0===r&&(r=n.RedirectStatusCode.TemporaryRedirect);let o=Error(s);o.digest=s+";"+t+";"+e+";"+r+";";let a=i.requestAsyncStorage.getStore();return a&&(o.mutableCookies=a.mutableCookies),o}function c(e,t){void 0===t&&(t="replace");let r=a.actionAsyncStorage.getStore();throw l(e,t,(null==r?void 0:r.isAction)?n.RedirectStatusCode.SeeOther:n.RedirectStatusCode.TemporaryRedirect)}function d(e,t){void 0===t&&(t="replace");let r=a.actionAsyncStorage.getStore();throw l(e,t,(null==r?void 0:r.isAction)?n.RedirectStatusCode.SeeOther:n.RedirectStatusCode.PermanentRedirect)}function u(e){if("object"!=typeof e||null===e||!("digest"in e)||"string"!=typeof e.digest)return!1;let[t,r,o,i]=e.digest.split(";",4),a=Number(i);return t===s&&("replace"===r||"push"===r)&&"string"==typeof o&&!isNaN(a)&&a in n.RedirectStatusCode}function p(e){return u(e)?e.digest.split(";",3)[2]:null}function f(e){if(!u(e))throw Error("Not a redirect error");return e.digest.split(";",2)[1]}function g(e){if(!u(e))throw Error("Not a redirect error");return Number(e.digest.split(";",4)[3])}(function(e){e.push="push",e.replace="replace"})(o||(o={})),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},2855:(e,t,r)=>{r.r(t),r.d(t,{default:()=>f,generateMetadata:()=>p,generateStaticParams:()=>u});var o=r(9510),i=r(8585),a=r(7371),n=r(8246),s=r(4869),l=r(537);let c={terms:{title:"Terms & Conditions",lastUpdated:"1 January 2025",content:`
## 1. Introduction

Welcome to StrikeZone Tickets ("we", "our", "us"). By using this website you agree to these Terms & Conditions. Please read them carefully.

StrikeZone Tickets is a ticket comparison service. We do not sell tickets directly — we compare prices from third-party partner platforms and link you to their websites.

## 2. Use of the Service

You may use StrikeZone Tickets for personal, non-commercial purposes only. You must not:

- Use our service for any unlawful purpose
- Attempt to gain unauthorised access to our systems
- Scrape or harvest data without permission
- Misrepresent your identity or affiliation

## 3. Accuracy of Information

We strive to provide accurate, up-to-date pricing information. However, ticket prices change frequently and we cannot guarantee that prices shown are current at the time of purchase. Always confirm the final price on the partner's website before completing your transaction.

## 4. Third-Party Links

Our website contains affiliate links to third-party ticket platforms. We are not responsible for the content, policies, or practices of those third-party websites. Your purchase is subject to the terms and conditions of the partner platform.

## 5. Intellectual Property

All content on this website — including text, graphics, logos, and data — is owned by or licensed to StrikeZone Tickets and protected by copyright law.

## 6. Limitation of Liability

To the maximum extent permitted by law, StrikeZone Tickets shall not be liable for any indirect, incidental, or consequential damages arising from your use of this service.

## 7. Changes to Terms

We may update these terms at any time. Continued use of the service constitutes acceptance of the updated terms.

## 8. Governing Law

These terms are governed by the laws of England and Wales.
    `},privacy:{title:"Privacy Policy",lastUpdated:"1 January 2025",content:`
## 1. What We Collect

We collect the following types of information:

- **Usage data:** Pages visited, time on site, referring URLs (via Google Analytics)
- **Technical data:** IP address, browser type, device type
- **Cookies:** See our Cookie Policy for details
- **Contact data:** If you contact us via email

We do not collect payment information — all transactions occur on our partners' websites.

## 2. How We Use Your Data

We use your data to:

- Improve the website and user experience
- Monitor site performance and fix bugs
- Comply with legal obligations
- Send marketing communications (only with your consent)

## 3. Sharing Your Data

We do not sell your personal data. We may share anonymised, aggregated data with analytics providers. We share data with partners only where required to fulfil the service.

## 4. Your Rights (GDPR)

Under UK GDPR, you have the right to:

- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Object to processing
- Data portability

To exercise any of these rights, contact: privacy@strikezone-tickets.com

## 5. Data Retention

We retain usage data for 26 months. Contact form data is retained for 12 months.

## 6. Cookies

See our separate Cookie Policy for full details on cookies we use.

## 7. Contact

For privacy-related queries: privacy@strikezone-tickets.com
    `},cookies:{title:"Cookie Policy",lastUpdated:"1 January 2025",content:`
## What Are Cookies?

Cookies are small text files stored on your device when you visit a website. They help websites function correctly and provide information to site owners.

## Cookies We Use

### Essential Cookies
Required for the website to function. Cannot be disabled.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| session | User session management | Session |
| csrf | Security token | Session |

### Analytics Cookies
Help us understand how visitors use the site.

| Cookie | Provider | Purpose | Duration |
|--------|----------|---------|----------|
| _ga | Google Analytics | Visitor tracking | 2 years |
| _gid | Google Analytics | Session tracking | 24 hours |

### Partner / Affiliate Cookies
Set when you click through to our partner sites.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| affiliate_ref | Track referrals to partners | 30 days |

## Managing Cookies

You can control cookies through your browser settings. Note that disabling certain cookies may affect the functionality of the website.

Most browsers allow you to:
- View cookies stored on your device
- Block all or certain cookies
- Delete cookies on exit

## More Information

For more about cookies generally: [aboutcookies.org](https://www.aboutcookies.org)
    `},"affiliate-disclosure":{title:"Affiliate Disclosure",lastUpdated:"1 January 2025",content:`
## Our Affiliate Relationships

StrikeZone Tickets is a ticket comparison website. We earn revenue through **affiliate commissions** paid to us by our partner ticket platforms (Ticketmaster, StubHub, Viagogo, SeatGeek, GetMeIn, TicketSwap and others).

## How It Works

When you click a "Get Tickets" button or any link to a partner website on StrikeZone Tickets, a tracking cookie or referral code is set. If you subsequently make a purchase on that partner's website, we receive a commission — typically a percentage of the transaction value.

**This commission is paid by the partner, not by you.** The price you pay for your tickets is the same whether you arrived via StrikeZone or directly.

## Effect on Our Rankings

Our affiliate relationships do not influence ticket pricing data, which is fetched directly from partner APIs. However, "Featured Partner" placements in the filter sidebar are paid promotional positions.

We always aim to show you the most accurate, up-to-date prices regardless of our commercial relationships.

## Editorial Independence

Our reviews, ratings, and written content are produced independently of our commercial relationships. We do not accept payment for positive reviews. Ratings reflect genuine user feedback aggregated from multiple review sources.

## Compliance

This disclosure is made in accordance with:

- UK ASA (Advertising Standards Authority) guidelines
- FTC guidelines for affiliate marketing
- UK Consumer Rights Act 2015

## Questions?

If you have questions about our affiliate relationships: info@strikezone-tickets.com
    `}},d=[{slug:"terms",label:"Terms & Conditions"},{slug:"privacy",label:"Privacy Policy"},{slug:"cookies",label:"Cookie Policy"},{slug:"affiliate-disclosure",label:"Affiliate Disclosure"}];async function u(){return Object.keys(c).map(e=>({slug:e}))}async function p({params:e}){let t=c[e.slug];return t?(0,l.$)({title:t.title,path:`/legal/${e.slug}`}):{}}function f({params:e}){let t=c[e.slug];t||(0,i.notFound)();let r=t.content.trim().split(/\n(?=## )/).filter(Boolean);return(0,o.jsxs)(o.Fragment,{children:[o.jsx(n.ZP,{}),(0,o.jsxs)("main",{children:[o.jsx("div",{style:{background:"var(--white)",borderBottom:"1px solid var(--border-gray)",padding:"16px 40px"},children:(0,o.jsxs)("div",{style:{maxWidth:"1280px",margin:"0 auto",display:"flex",alignItems:"center",gap:"8px",fontSize:"13px"},children:[o.jsx(a.default,{href:"/",style:{color:"var(--text-gray)",textDecoration:"none"},children:"Home"}),o.jsx("span",{style:{color:"var(--text-gray)"},children:"›"}),o.jsx("span",{style:{color:"var(--primary)",fontWeight:600},children:t.title})]})}),(0,o.jsxs)("div",{style:{maxWidth:"1280px",margin:"0 auto",padding:"40px 40px 80px",display:"grid",gridTemplateColumns:"240px 1fr",gap:"48px"},className:"legal-grid",children:[o.jsx("aside",{children:(0,o.jsxs)("div",{style:{background:"var(--white)",border:"1px solid var(--border-gray)",borderRadius:"12px",overflow:"hidden",position:"sticky",top:"calc(var(--nav-h) + 20px)"},children:[o.jsx("div",{style:{padding:"16px 20px",borderBottom:"1px solid var(--border-gray)",fontSize:"12px",fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:"var(--text-gray)"},children:"Legal Pages"}),d.map(t=>{let r=t.slug===e.slug;return o.jsx(a.default,{href:`/legal/${t.slug}`,style:{display:"block",padding:"12px 20px",fontSize:"14px",fontWeight:r?600:400,color:r?"var(--primary)":"var(--text-gray)",background:r?"var(--primary-light)":"transparent",borderLeft:`3px solid ${r?"var(--primary)":"transparent"}`,textDecoration:"none",transition:"all .15s"},children:t.label},t.slug)})]})}),(0,o.jsxs)("div",{children:[(0,o.jsxs)("div",{style:{marginBottom:"32px"},children:[o.jsx("h1",{style:{fontFamily:"var(--font-poppins, Poppins, sans-serif)",fontSize:"36px",fontWeight:800,color:"var(--text-dark)",marginBottom:"8px"},children:t.title}),(0,o.jsxs)("p",{style:{fontSize:"13px",color:"var(--text-gray)"},children:["Last updated: ",t.lastUpdated]})]}),o.jsx("div",{style:{background:"var(--white)",border:"1px solid var(--border-gray)",borderRadius:"12px",padding:"40px",boxShadow:"var(--shadow-sm)"},children:r.map((e,t)=>{let i=e.split("\n"),a=i[0].replace(/^##\s+/,""),n=i.slice(1).join("\n").trim();return(0,o.jsxs)("div",{style:{marginBottom:t<r.length-1?"32px":0,paddingBottom:t<r.length-1?"32px":0,borderBottom:t<r.length-1?"1px solid var(--border-gray)":"none"},children:[o.jsx("h2",{style:{fontFamily:"var(--font-poppins, Poppins, sans-serif)",fontSize:"18px",fontWeight:700,color:"var(--text-dark)",marginBottom:"12px"},children:a}),o.jsx("div",{style:{fontSize:"14px",color:"var(--text-gray)",lineHeight:1.8,whiteSpace:"pre-line"},children:n})]},t)})}),(0,o.jsxs)("div",{style:{marginTop:"32px",background:"var(--primary-light)",border:"1px solid var(--primary)",borderRadius:"12px",padding:"24px"},children:[o.jsx("h3",{style:{fontFamily:"var(--font-poppins, Poppins, sans-serif)",fontSize:"16px",fontWeight:700,color:"var(--text-dark)",marginBottom:"8px"},children:"Questions?"}),(0,o.jsxs)("p",{style:{fontSize:"14px",color:"var(--text-gray)",lineHeight:1.6},children:["If you have questions about this policy, please email us at"," ",o.jsx("a",{href:"mailto:legal@strikezone-tickets.com",style:{color:"var(--primary)",fontWeight:600},children:"legal@strikezone-tickets.com"}),"."]})]})]})]})]}),o.jsx(s.Z,{})]})}},537:(e,t,r)=>{r.d(t,{$:()=>a});let o="StrikeZone Tickets",i=process.env.NEXT_PUBLIC_SITE_URL||"https://strikezone-tickets.com";function a(e){let{title:t,description:r="Compare sports ticket prices from the UK's top resale platforms. Find the best deals on football, cricket, horse racing, tennis, boxing, F1, rugby and golf tickets.",path:a="",image:n}=e,s=`${i}${a}`;return{title:`${t} | ${o}`,description:r,metadataBase:new URL(i),alternates:{canonical:s},openGraph:{title:`${t} | ${o}`,description:r,url:s,siteName:o,locale:"en_GB",type:"website",...n?{images:[{url:n,width:1200,height:630}]}:{}},twitter:{card:"summary_large_image",title:`${t} | ${o}`,description:r,...n?{images:[n]}:{}}}}}};var t=require("../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[763,298],()=>r(1843));module.exports=o})();