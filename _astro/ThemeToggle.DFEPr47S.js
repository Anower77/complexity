import{c as r,j as t}from"./createLucideIcon.CL9h6Ow-.js";import{r as s}from"./index.ai7qpRr1.js";/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const n={name:"moon",size:24,node:[["path",{d:"M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401",key:"kfwtm"}]]};n.node;const l=r(n);/**
 * @license lucide-react v1.70.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const c={name:"sun",size:24,node:[["circle",{cx:"12",cy:"12",r:"4",key:"4exip2"}],["path",{d:"M12 2v2",key:"tus03m"}],["path",{d:"M12 20v2",key:"1lh1kg"}],["path",{d:"m4.93 4.93 1.41 1.41",key:"149t6j"}],["path",{d:"m17.66 17.66 1.41 1.41",key:"ptbguv"}],["path",{d:"M2 12h2",key:"1t8f8n"}],["path",{d:"M20 12h2",key:"1q8mjw"}],["path",{d:"m6.34 17.66-1.41 1.41",key:"1m8zz5"}],["path",{d:"m19.07 4.93-1.41 1.41",key:"1shlcs"}]]};c.node;const u=r(c);function f(){const[a,o]=s.useState("light"),[d,m]=s.useState(!1);s.useEffect(()=>{m(!0);const e=document.documentElement.classList.contains("dark");o(e?"dark":"light")},[]);const i=()=>{const e=a==="dark"?"light":"dark";o(e),e==="dark"?(document.documentElement.classList.add("dark"),localStorage.setItem("theme","dark")):(document.documentElement.classList.remove("dark"),localStorage.setItem("theme","light"))};return d?t.jsx("button",{type:"button",onClick:i,"aria-label":`Switch to ${a==="dark"?"light":"dark"} mode`,className:"w-8 h-8 rounded-md border border-border-subtle bg-surface hover:bg-surface-elevated text-text-secondary hover:text-text-primary flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-brand",children:a==="dark"?t.jsx(u,{className:"w-4 h-4 text-amber-400"}):t.jsx(l,{className:"w-4 h-4 text-slate-700"})}):t.jsx("div",{className:"w-8 h-8 rounded-md border border-border-subtle bg-surface flex items-center justify-center opacity-50"})}export{f as default};
