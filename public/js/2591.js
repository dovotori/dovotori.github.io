"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[2591],{14566(e,t,o){o.d(t,{A:()=>g});var i=o(96540),n=o(59616),r=o(74848);const a=n.i7`
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
`,s=n.i7`
  50% { 
    opacity: 0.5; 
    transform: translate3d(-10%, -10%, 0);
  }
  0%, 60%, 100% { 
    opacity: 0;
    transform: none;
  }
`,l=n.Ay.div``,c=n.Ay.div`
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
    animation: ${a} 1s infinite linear alternate;
  }
`,p=n.Ay.div`
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
    animation: ${s} 2s steps(1, end) infinite;
  }
`,d=e=>{let{className:t,src:o}=e;return(0,r.jsxs)(l,{className:t,children:[(0,r.jsx)(c,{src:o}),(0,r.jsx)(p,{src:o})]})},h=n.Ay.div`
  position: relative;
  overflow: hidden;
`,u=n.Ay.img`
  opacity: ${e=>e.$isLoaded?1:0};
  visibility: ${e=>e.$isLoaded?"visible":"hidden"};
  transition: opacity 300ms ease-out;
  text-transform: lowercase;
  letter-spacing: 0.1em;
`,g=e=>{let{className:t,withGlitch:o,alt:n,width:a,height:s,children:l,src:c,ref:p,placeholderImg:g}=e;const[y,m]=(0,i.useState)(!1),[b,f]=(0,i.useState)(!1),[v,$]=(0,i.useState)(c),[w,x]=(0,i.useState)(!1),k=(0,i.useCallback)((()=>{m(!0)}),[]),A=(0,i.useCallback)((()=>{g&&!w?($(g),x(!0),m(!1)):(f(!0),m(!0))}),[g,w]);return(0,r.jsxs)(h,{ref:p,className:t,children:[!b&&(0,r.jsx)(u,{alt:`_${n}`,src:v,onLoad:k,onError:A,$isLoaded:y,width:a||"auto",height:s||"auto"}),!b&&y&&o&&(0,r.jsx)(d,{src:v}),!y&&l]})}},32591(e,t,o){o.r(t),o.d(t,{default:()=>$});var i=o(56658),n=o(59616),r=o(86869),a=o(85692),s=o(17556),l=o(14566),c=o(51015),p=o(74848);const d=(0,n.Ay)(l.A)`
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
`,h=e=>{let{slug:t,$colorType:o,idx:i,className:n}=e;const[r,l]=(0,a.Wx)({threshold:0,triggerOnce:!0});return(0,p.jsx)(d,{ref:r,$colorType:o,src:(0,s.md)(t,i),className:n,$isVisible:l,children:(0,p.jsx)(c.A,{$colorType:o})})};var u=o(45917);const g=n.Ay.div`
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
`,b=(0,n.Ay)(u.A)`
  background: ${e=>e.noBackground?"transparent":e.theme.getGradient};
  --project-color: ${e=>e.theme.getColor};
`,f=e=>{let{slug:t,images:o,colorType:i,labo:n,back:a}=e;return(0,p.jsxs)(p.Fragment,{children:[!!n&&(0,p.jsx)(b,{slug:t,$colorType:i,colorType:i,noBackground:!!n.noBackground,hasHtml:!!n.hasHtml,hasJs:!!n.hasJs}),(0,p.jsxs)(g,{children:[o&&(0,p.jsx)(y,{children:(0,p.jsx)(m,{children:Array(o).fill().map(((e,t)=>t)).map((e=>(0,p.jsx)(h,{idx:e,slug:t,$colorType:i},`image-${t}-${e}`)))})}),(0,p.jsx)(r.A,{$colorType:null,label:a})]})]})};var v=o(96416);const $=()=>{const e=(0,i.g)().slug||null,t=(0,v.XJ)(e);return(0,p.jsx)(f,{colorType:(0,s.G7)(t.category),...t,back:(0,v.t9)()})}},85692(e,t,o){o.d(t,{Wx:()=>g});var i,n=o(96540),r=Object.defineProperty,a=(e,t,o)=>((e,t,o)=>t in e?r(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o)(e,"symbol"!=typeof t?t+"":t,o),s=new Map,l=new WeakMap,c=0;function p(e){return Object.keys(e).sort().filter((t=>void 0!==e[t])).map((t=>{return`${t}_${"root"===t?(o=e.root,o?(l.has(o)||(c+=1,l.set(o,c.toString())),l.get(o)):"0"):e[t]}`;var o})).toString()}function d(e,t,o={},n=i){if(void 0===window.IntersectionObserver&&void 0!==n){const i=e.getBoundingClientRect();return t(n,{isIntersecting:n,target:e,intersectionRatio:"number"==typeof o.threshold?o.threshold:0,time:0,boundingClientRect:i,intersectionRect:i,rootBounds:i}),()=>{}}const{id:r,observer:a,elements:l}=function(e){const t=p(e);let o=s.get(t);if(!o){const i=new Map;let n;const r=new IntersectionObserver((t=>{t.forEach((t=>{var o;const r=t.isIntersecting&&n.some((e=>t.intersectionRatio>=e));e.trackVisibility&&void 0===t.isVisible&&(t.isVisible=r),null==(o=i.get(t.target))||o.forEach((e=>{e(r,t)}))}))}),e);n=r.thresholds||(Array.isArray(e.threshold)?e.threshold:[e.threshold||0]),o={id:t,observer:r,elements:i},s.set(t,o)}return o}(o),c=l.get(e)||[];return l.has(e)||l.set(e,c),c.push(t),a.observe(e),function(){c.splice(c.indexOf(t),1),0===c.length&&(l.delete(e),a.unobserve(e)),0===l.size&&(a.disconnect(),s.delete(r))}}var h,u;n.Component;function g({threshold:e,delay:t,trackVisibility:o,rootMargin:i,root:r,triggerOnce:a,skip:s,initialInView:l,fallbackInView:c,onChange:p}={}){var h;const[u,g]=n.useState(null),y=n.useRef(p),m=n.useRef(l),[b,f]=n.useState({inView:!!l,entry:void 0});y.current=p,n.useEffect((()=>{if(void 0===m.current&&(m.current=l),s||!u)return;let n;return n=d(u,((e,t)=>{const o=m.current;m.current=e,(void 0!==o||e)&&(f({inView:e,entry:t}),y.current&&y.current(e,t),t.isIntersecting&&a&&n&&(n(),n=void 0))}),{root:r,rootMargin:i,threshold:e,trackVisibility:o,delay:t},c),()=>{n&&n()}}),[Array.isArray(e)?e.toString():e,u,r,i,a,s,o,c,t]);const v=null==(h=b.entry)?void 0:h.target,$=n.useRef(void 0);u||!v||a||s||$.current===v||($.current=v,f({inView:!!l,entry:void 0}),m.current=l);const w=[g,b.inView,b.entry];return w.ref=w[0],w.inView=w[1],w.entry=w[2],w}null!=(u=null!=(h=n.useInsertionEffect)?h:n.useLayoutEffect)||n.useEffect},86869(e,t,o){o.d(t,{A:()=>y});var i=o(60858),n=o(56658),r=o(59616),a=o(96540);const s=()=>{const[e,t]=(0,a.useState)(!1),o=(0,a.useRef)(null),i=(0,a.useCallback)((()=>t(!0)),[]),n=(0,a.useCallback)((()=>t(!1)),[]);return(0,a.useEffect)((()=>{const e=o.current;return e?(e.addEventListener("mouseover",i),e.addEventListener("mouseout",n),()=>{e.removeEventListener("mouseover",i),e.removeEventListener("mouseout",n)}):null}),[i,n]),[o,e]};var l=o(74848);const c=r.i7`
  0% {
    transform: translateX(100px);
    opacity: 0;
  }
  100% {
    transform: none;
    opacity: 1;
  }
`,p=(0,r.Ay)(n.N_)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 2em auto;
  padding: 0.5em;
  min-height: 40px;
  border: solid 1px ${e=>e.theme.getColor};
  box-shadow: 2px 2px 0 ${e=>e.theme.getColor};
  max-width: 400px;
  -webkit-tap-highlight-color: ${e=>e.theme.getColor};
  overflow: hidden;

  ${e=>e.theme.active}

  background: ${e=>e.$isFocus?e.theme.softGradient:"transparent"};
`,d=r.Ay.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`,h=(0,r.Ay)(i.h)`
  position: absolute;
  fill: ${e=>e.theme.getColor};
  height: 0.6em;
  opacity: 0;
  margin-left: ${e=>.1*e.$delay}px;
  
  ${e=>e.$isAnimating&&r.AH`
      animation: ${c} 400ms ease-in-out forwards;
      animation-delay: ${e=>e.$delay}ms;
    `}
`,u=r.Ay.span`
  width: 100%;
  color: ${e=>e.theme.getColor};
  ${e=>e.theme.monospace}
  font-size: 0.8em;
  letter-spacing: 0.5em;
  text-align: right;
`,g=[0,100,200,300,400],y=e=>{let{to:t,className:o,$colorType:i,label:n}=e;const[r,a]=s();return(0,l.jsxs)(p,{to:t||"/",className:o,$isFocus:a,$colorType:i,ref:r,children:[(0,l.jsx)(d,{children:a&&g.map((e=>(0,l.jsx)(h,{$colorType:i,$isAnimating:a,$delay:e},e)))}),(0,l.jsx)(u,{$colorType:i,children:n})]})}}}]);