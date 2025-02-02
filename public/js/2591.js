"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[2591],{72056:(e,t,o)=>{o.d(t,{A:()=>u});var i=o(19536),r=o(59616),n=o(71468),s=o(39157),l=o(96540);const a=()=>{const[e,t]=(0,l.useState)(!1),o=(0,l.useRef)(null),i=()=>t(!0),r=()=>t(!1);return(0,l.useEffect)((()=>{const e=o.current;return e?(e.addEventListener("mouseover",i),e.addEventListener("mouseout",r),()=>{e.removeEventListener("mouseover",i),e.removeEventListener("mouseout",r)}):null}),[o.current]),[o,e]};var c=o(74848);const p=(0,r.Ay)(i.N_)`
  position: relative;
  display: flex;
  width: 100%;
  margin: 2em auto;
  padding: 1em 10px;
  border: solid 1px ${e=>e.theme.getColor};
  box-shadow: 2px 2px 0 ${e=>e.theme.getColor};
  max-width: 400px;
  -webkit-tap-highlight-color: ${e=>e.theme.getColor};

  ${e=>e.theme.active}
`,h=(0,r.Ay)(s.h)`
  position: relative;
  fill: ${e=>e.theme.getColor};
  width: auto;
  height: 0.6em;
  margin: 0 0.2em;
`,d=r.Ay.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transition: transform 300ms ${e=>e.theme.elastic};
  background: ${e=>e.theme.backgroundHighlight};
  transform-origin: 100% 0;
  transform: ${e=>e.$isFocus?"none":"scale(0, 1)"};
`,g=r.Ay.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate3d(0, -50%, 0);
  display: inline-block;
  color: ${e=>e.theme.getColor};
  font-size: 0.8em;
  ${e=>e.theme.monospace}
`,u=(0,n.Ng)((e=>({text:e.content.back})))((e=>{let{to:t,className:o,$colorType:i,text:r}=e;const[n,s]=a();return(0,c.jsxs)(p,{to:t||"/",className:o,$isFocus:s,$colorType:i,ref:n,children:[(0,c.jsx)(d,{$isFocus:s}),(0,c.jsx)(h,{$colorType:i}),(0,c.jsx)(g,{$colorType:i,children:r})]})}))},14566:(e,t,o)=>{o.d(t,{A:()=>u});var i=o(96540),r=o(59616),n=o(74848);const s=r.i7`
  0% { 
    -webkit-clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
    clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
  }
  50% { 
    -webkit-clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
    clip-path: polygon(0 2%, 100% 2%, 100% 5%, 0 5%);
  }
  55% {
    -webkit-clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
    clip-path: polygon(0 15%, 100% 15%, 100% 15%, 0 15%);
  }
  60% {
    -webkit-clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
    clip-path: polygon(0 10%, 100% 10%, 100% 20%, 0 20%);
  }
  65% {
    -webkit-clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
    clip-path: polygon(0 1%, 100% 1%, 100% 2%, 0 2%);
  }
  70% {
    -webkit-clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
    clip-path: polygon(0 33%, 100% 33%, 100% 33%, 0 33%);
  }
  75% {
    -webkit-clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
    clip-path: polygon(0 44%, 100% 44%, 100% 44%, 0 44%);
  }
  80% {
    -webkit-clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
    clip-path: polygon(0 50%, 100% 50%, 100% 20%, 0 20%);
  }
  85% {
    -webkit-clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
    clip-path: polygon(0 70%, 100% 70%, 100% 70%, 0 70%);
  }
  90% {
    -webkit-clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
    clip-path: polygon(0 80%, 100% 80%, 100% 80%, 0 80%);
  }
  95% {
    -webkit-clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
    clip-path: polygon(0 50%, 100% 50%, 100% 55%, 0 55%);
  }
  100% {
    -webkit-clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%);
    clip-path: polygon(0 70%, 100% 70%, 100% 80%, 0 80%);
  }
`,l=r.i7`
  50% { 
    opacity: 0.5; 
    transform: translate3d(-10%, -10%, 0);
  }
  0%, 60%, 100% { 
    opacity: 0;
    transform: none;
  }
`,a=r.Ay.div``,c=r.Ay.div`
  @supports (
    (clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%)) or
      (-webkit-clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%))
  ) {
    position: absolute;
    top: -40px;
    left: -40px;
    width: calc(100% + 80px);
    height: calc(100% + 80px);
    background: url(${e=>e.src}) no-repeat 50% 0;
    background-size: cover;
    background-blend-mode: multiply;
    transform: translate3d(40px, 0, 0);
    animation: ${s} 1s infinite linear alternate;
  }
`,p=r.Ay.div`
  @supports (
    (clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%)) or
      (-webkit-clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%))
  ) {
    position: absolute;
    top: 0;
    left: 0;
    width: 110%;
    height: 110%;
    background: url(${e=>e.src}) no-repeat 50% 0;
    background-size: cover;
    background-blend-mode: multiply;
    animation: ${l} 2s steps(1, end) infinite;
  }
`,h=e=>{let{className:t,src:o}=e;return(0,n.jsxs)(a,{className:t,children:[(0,n.jsx)(c,{src:o}),(0,n.jsx)(p,{src:o})]})},d=r.Ay.div`
  position: relative;
  overflow: hidden;
`,g=r.Ay.img`
  opacity: ${e=>e.$isLoaded?1:0};
  visibility: ${e=>e.$isLoaded?"visible":"hidden"};
  transition: opacity 300ms ease-out;
  text-transform: lowercase;
  letter-spacing: 0.1em;
`,u=(0,i.forwardRef)(((e,t)=>{let{className:o,withGlitch:r,alt:s,width:l,height:a,children:c,src:p}=e;const[u,y]=(0,i.useState)(!1),m=(0,i.useCallback)((()=>y(!0)),[y]);return(0,n.jsxs)(d,{ref:t,className:o,children:[(0,n.jsx)(g,{alt:`_${s}`,src:p,onLoad:m,$isLoaded:u,width:l||"auto",height:a||"auto"}),u&&r&&(0,n.jsx)(h,{src:p}),!u&&c]})}))},32591:(e,t,o)=>{o.r(t),o.d(t,{default:()=>w});var i=o(19536),r=o(17427),n=o(59616),s=o(72056),l=o(85692),a=o(14566),c=o(22383),p=o(74848);const h=(0,n.Ay)(a.A)`
  margin: 0 auto 10vh;
  min-height: 100px;
  background: ${e=>e.theme.getGradient};
  box-shadow: 0 0 2em ${e=>e.theme.backgroundHighlight};
  opacity: ${e=>e.$isVisible?1:0};
  transform: ${e=>e.$isVisible?"none":"translateY(20%)"};
  transition:
    opacity 1s ${e=>e.theme.elastic},
    transform 1s ${e=>e.theme.elastic},
    box-shadow 800ms linear;
`,d=e=>{let{slug:t,$colorType:o,idx:i,className:n}=e;const[s,a]=(0,l.Wx)({threshold:0,triggerOnce:!0});return(0,p.jsx)(h,{ref:s,$colorType:o,src:(0,r.md)(t,i),className:n,$isVisible:a,children:(0,p.jsx)(c.A,{$colorType:o})})};var g=o(7472);const u=n.Ay.div`
  margin: 0 auto;
  max-width: 800px;
  padding: 0 0 10%;
`,y=n.Ay.div`
  margin: 4em auto;
  ${e=>e.theme.scrollbar} img {
    display: block;
    width: 100%;
  }

  ${e=>e.theme.media.tablet`
    position: relative;
    width: 100%;
    height: auto;
    left: auto;
  `}
`,m=n.Ay.div`
  width: calc(100% - 20px);
  margin: 0 auto;
`,b=(0,n.Ay)(g.A)`
  background: ${e=>e.noBackground?"transparent":e.theme.getGradient};
  --project-color: ${e=>e.theme.getColor};
`,v=e=>{let{slug:t,images:o,colorType:i,labo:r}=e;return(0,p.jsxs)(p.Fragment,{children:[!!r&&(0,p.jsx)(b,{slug:t,$colorType:i,colorType:i,noBackground:!!r.noBackground,hasHtml:!!r.hasHtml,hasJs:!!r.hasJs}),(0,p.jsxs)(u,{children:[o&&(0,p.jsx)(y,{children:(0,p.jsx)(m,{children:Array(o).fill().map(((e,t)=>t)).map((e=>(0,p.jsx)(d,{idx:e,slug:t,$colorType:i},`image-${t}-${e}`)))})}),(0,p.jsx)(s.A,{$colorType:null})]})]})};var f=o(85651);const w=()=>{const e=(0,i.g)().slug||null,t=(0,f.XJ)(e);return(0,p.jsx)(v,{colorType:(0,r.G7)(t.category),...t})}},85692:(e,t,o)=>{o.d(t,{Wx:()=>d});var i=o(96540),r=Object.defineProperty,n=(e,t,o)=>((e,t,o)=>t in e?r(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o)(e,"symbol"!=typeof t?t+"":t,o),s=new Map,l=new WeakMap,a=0,c=void 0;function p(e){return Object.keys(e).sort().filter((t=>void 0!==e[t])).map((t=>{return`${t}_${"root"===t?(o=e.root,o?(l.has(o)||(a+=1,l.set(o,a.toString())),l.get(o)):"0"):e[t]}`;var o})).toString()}function h(e,t,o={},i=c){if(void 0===window.IntersectionObserver&&void 0!==i){const r=e.getBoundingClientRect();return t(i,{isIntersecting:i,target:e,intersectionRatio:"number"==typeof o.threshold?o.threshold:0,time:0,boundingClientRect:r,intersectionRect:r,rootBounds:r}),()=>{}}const{id:r,observer:n,elements:l}=function(e){const t=p(e);let o=s.get(t);if(!o){const i=new Map;let r;const n=new IntersectionObserver((t=>{t.forEach((t=>{var o;const n=t.isIntersecting&&r.some((e=>t.intersectionRatio>=e));e.trackVisibility&&void 0===t.isVisible&&(t.isVisible=n),null==(o=i.get(t.target))||o.forEach((e=>{e(n,t)}))}))}),e);r=n.thresholds||(Array.isArray(e.threshold)?e.threshold:[e.threshold||0]),o={id:t,observer:n,elements:i},s.set(t,o)}return o}(o),a=l.get(e)||[];return l.has(e)||l.set(e,a),a.push(t),n.observe(e),function(){a.splice(a.indexOf(t),1),0===a.length&&(l.delete(e),n.unobserve(e)),0===l.size&&(n.disconnect(),s.delete(r))}}i.Component;function d({threshold:e,delay:t,trackVisibility:o,rootMargin:r,root:n,triggerOnce:s,skip:l,initialInView:a,fallbackInView:c,onChange:p}={}){var d;const[g,u]=i.useState(null),y=i.useRef(p),[m,b]=i.useState({inView:!!a,entry:void 0});y.current=p,i.useEffect((()=>{if(l||!g)return;let i;return i=h(g,((e,t)=>{b({inView:e,entry:t}),y.current&&y.current(e,t),t.isIntersecting&&s&&i&&(i(),i=void 0)}),{root:n,rootMargin:r,threshold:e,trackVisibility:o,delay:t},c),()=>{i&&i()}}),[Array.isArray(e)?e.toString():e,g,n,r,s,l,o,c,t]);const v=null==(d=m.entry)?void 0:d.target,f=i.useRef(void 0);g||!v||s||l||f.current===v||(f.current=v,b({inView:!!a,entry:void 0}));const w=[u,m.inView,m.entry];return w.ref=w[0],w.inView=w[1],w.entry=w[2],w}}}]);