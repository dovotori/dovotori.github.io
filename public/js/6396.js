"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[6396],{14566(e,t,i){i.d(t,{A:()=>g});var o=i(96540),r=i(59616),s=i(74848);const n=r.i7`
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
`,a=r.i7`
  50% { 
    opacity: 0.5; 
    transform: translate3d(-10%, -10%, 0);
  }
  0%, 60%, 100% { 
    opacity: 0;
    transform: none;
  }
`,l=r.Ay.div``,c=r.Ay.div`
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
    animation: ${n} 1s infinite linear alternate;
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
    animation: ${a} 2s steps(1, end) infinite;
  }
`,h=e=>{let{className:t,src:i}=e;return(0,s.jsxs)(l,{className:t,children:[(0,s.jsx)(c,{src:i}),(0,s.jsx)(p,{src:i})]})},u=r.Ay.div`
  position: relative;
  overflow: hidden;
`,d=r.Ay.img`
  opacity: ${e=>e.$isLoaded?1:0};
  visibility: ${e=>e.$isLoaded?"visible":"hidden"};
  transition: opacity 300ms ease-out;
  text-transform: lowercase;
  letter-spacing: 0.1em;
`,g=e=>{let{className:t,withGlitch:i,alt:r,width:n,height:a,children:l,src:c,ref:p,placeholderImg:g}=e;const[m,y]=(0,o.useState)(!1),[f,v]=(0,o.useState)(!1),[b,$]=(0,o.useState)(c),[w,x]=(0,o.useState)(!1),k=(0,o.useCallback)((()=>{y(!0)}),[]),j=(0,o.useCallback)((()=>{g&&!w?($(g),x(!0),y(!1)):(v(!0),y(!0))}),[g,w]);return(0,s.jsxs)(u,{ref:p,className:t,children:[!f&&(0,s.jsx)(d,{alt:`_${r}`,src:b,onLoad:k,onError:j,$isLoaded:m,width:n||"auto",height:a||"auto"}),!f&&m&&i&&(0,s.jsx)(h,{src:b}),!m&&l]})}},36396(e,t,i){i.r(t),i.d(t,{default:()=>H});var o,r=i(59616),s=i(34114),n=i(96540),a=i(56658),l=i(17556);function c(){return c=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var o in i)({}).hasOwnProperty.call(i,o)&&(e[o]=i[o])}return e},c.apply(null,arguments)}const p=(0,r.Ay)((e=>n.createElement("svg",c({fill:"currentColor",viewBox:"0 0 10 10",xmlns:"http://www.w3.org/2000/svg"},e),o||(o=n.createElement("path",{d:"M 0 0 L 10 10 Z M 0 10 L 10 0 Z"})))))`
  width: 0.5em;
  height: 0.5em;
  min-width: 0.5em;
  stroke: ${e=>e.theme.getColor};
  fill: none;
`;var h=i(46936),u=i(74848);const d=r.Ay.div`
  text-align: center;
  max-width: 1400px;
  margin: 4em auto;
  display: flex;
  align-items: center;
  justify-content: center;
  ${e=>e.theme.media.mobile`flex-direction: column;`}
`,g=(0,r.Ay)(a.N_)`
  position: relative;
  padding: 1em 2em;
  opacity: ${e=>e.selected?1:.5};
  font-weight: ${e=>e.selected?800:400};
  transition:
    color 100ms ease-out,
    background-color 100ms ease-out,
    box-shadow 100ms ease-out;
  color: ${e=>e.theme.text};
  text-transform: uppercase;
  ${e=>e.theme.monospace}
  ${e=>e.theme.active}
  letter-spacing: 0.5em;
  white-space: nowrap;
  &:hover {
    opacity: 1;
  }
`,m=(0,r.Ay)(h.A)`
  text-transform: uppercase;
  letter-spacing: 0.5em;
`,y=e=>{let{selected:t,className:i,categories:o,onClickCategory:r=()=>{}}=e;const s=(0,n.useRef)({}),[,a]=(0,n.useState)(0);return(0,u.jsx)(d,{className:i,children:Object.keys(o).map(((e,i)=>{const c=t===parseInt(e,10);return(0,u.jsxs)(n.Fragment,{children:[0!==i&&(0,u.jsx)(p,{$colorType:0}),(0,u.jsx)(g,{to:c?"/":`/category/${o[e].slug}`,selected:c,$colorType:(0,l.G7)(parseInt(e,10)),onClick:r(e),onMouseEnter:()=>(e=>{s.current[e]=(s.current[e]||0)+1,a((e=>e+1))})(e),children:(0,u.jsx)(m,{message:o[e].label,firstMessage:o[e].label,delayLetter:30,trigger:s.current[e]||0})})]},o[e].slug)}))})};var f=i(96416);const v=()=>{const e=(0,f.Xr)(),t=(0,f.bW)(),i=(0,f.Fm)().reduce(((e,t)=>({...e,[t.category]:!0})),{}),o=(0,f.k0)(),r=Object.keys(i).reduce(((e,i)=>({...e,[i]:t[i]})),{});return(0,u.jsx)(y,{selected:o,categories:r,onClickCategory:t=>()=>{e((0,s.Fb)(parseInt(t,10)))}})};var b;function $(){return $=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var o in i)({}).hasOwnProperty.call(i,o)&&(e[o]=i[o])}return e},$.apply(null,arguments)}var w=i(85692),x=i(14566),k=i(51015);const j=(0,r.Ay)(a.N_).attrs({className:"teaser"})`
  position: relative;
  overflow: hidden;
  display: inline-block;
  margin: 10px;
  width: 400px;
  height: 100px;
  opacity: ${e=>e.$isVisible?1:0};
  box-shadow: ${e=>e.$isHover?`0 0 1em ${e.theme.backgroundHighlight}`:"none"};
  transform: ${e=>e.$isVisible?e.$isHover&&!e.$isTouchDevice?"scale(1.2)":"scale(1.01)":"translateY(20%)"};
  z-index: ${e=>e.$isVisible&&e.$isHover&&!e.$isTouchDevice?1:0};
  transition:
    opacity 1s ${e=>e.theme.elastic},
    transform 1s ${e=>e.theme.elastic},
    box-shadow 800ms linear;

  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - 16px),
    calc(100% - 16px) 100%,
    0 100%
  );

  ${e=>e.theme.active}
  ${e=>e.theme.media.mobile`margin: 5px auto; width: 100%; height: auto;`}
`,A=(0,r.Ay)(x.A)`
  width: 100%;
  transform: ${e=>e.$isFocus?"scale(1.1)":"none"};
  transition: transform 5000ms ${e=>e.theme.elastic};
  height: 100%;
  img {
    width: 100%;
    height: auto;
    display: block;
    margin-top: -25px;
    opacity: ${e=>e.$isFocus?.7:.8};
  }
`,L=r.Ay.div`
  overflow: hidden;
  background: ${e=>e.theme.getGradient};
  height: 100%;
`,C=r.Ay.h3`
  position: absolute;
  top: 50%;
  left: 0;
  color: ${e=>e.theme.text};
  font-size: 10em;
  letter-spacing: 0.1em;
  opacity: ${e=>e.$isFocus?.4:0};
  transition:
    opacity 1s ${e=>e.theme.elastic},
    transform 1s ${e=>e.theme.elastic};
  transform: ${e=>e.$isFocus?"translate3d(0, -50%, 0)":"translate3d(-100%, -50%, 0)"};
  z-index: 1;
  white-space: nowrap;
`,O=(0,r.Ay)((e=>n.createElement("svg",$({viewBox:"0 0 20 20",fill:"currentColor"},e),b||(b=n.createElement("path",{d:"M5 11 L5 9 L9 9 L9 5 L11 5 L11 9 L15 9 L15 11 L11 11 L11 15 L9 15 L9 11Z"})))))`
  position: absolute;
  top: 25%;
  left: 5%;
  width: auto;
  height: 50%;
  fill: ${e=>e.theme.getColor};
  opacity: ${e=>e.$isFocus?1:0};
  transition:
    opacity 1s ${e=>e.theme.elastic},
    transform 1s ${e=>e.theme.elastic};
  transform: ${e=>e.$isFocus?"none":"scale(0) rotate(45deg)"};
  z-index: 2;
`,V=r.Ay.div`
  margin: 20px auto;
`,E=e=>{let{className:t,category:i,slug:o,title:r="",currentHover:s,setCurrentHover:a=()=>{},isTouchDevice:c}=e;const p=(0,l.G7)(i),[h,d]=(0,n.useState)(!1),[g,m]=(0,w.Wx)({threshold:0,triggerOnce:!0});(0,n.useEffect)((()=>a(h?o:"")),[h,a,o]);const y=(0,n.useMemo)((()=>m?c||s===o||""===s?1:.65:0),[s,m,c,o]);return(0,u.jsxs)(j,{ref:g,className:t,to:`/project/${o}`,onMouseEnter:()=>d(!0),onMouseLeave:()=>d(!1),$levelOpacity:y,$isVisible:m,title:r,$isHover:h,$isTouchDevice:c,children:[(0,u.jsx)(L,{$colorType:p,children:(0,u.jsx)(A,{src:(0,l.uS)(o),alt:r,width:400,height:150,withGlitch:h,$isFocus:h,children:(0,u.jsx)(V,{children:(0,u.jsx)(k.A,{$colorType:p})})})}),c?null:(0,u.jsxs)(u.Fragment,{children:[(0,u.jsx)(O,{$isFocus:h,$colorType:p}),(0,u.jsx)(C,{$isFocus:h,children:r})]})]})},F=(0,r.Ay)(E)`
  transition-delay: ${e=>10*e.index}ms;
`,M=r.Ay.div.attrs({className:"teasers-list"})`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: calc(100% - 20px);
  margin: 0 auto;
  max-width: 1400px;
`,N=e=>{let{entries:t,isTouchDevice:i,className:o}=e;const[r,s]=(0,n.useState)(""),a=(0,n.useMemo)((()=>t.sort(((e,t)=>e.date>t.date?-1:1))),[t]);return(0,u.jsx)(M,{className:o,children:a.map(((e,t)=>(0,u.jsx)(F,{category:e.category,slug:e.slug,title:e.title,index:t,currentHover:r,setCurrentHover:s,isTouchDevice:i},e.id)))})},S=()=>{const e=(0,f.Fm)(),t=(0,f.qs)(),i=(0,f.k0)(),o=-1===i?e:e.filter((e=>e.category===i));return(0,u.jsx)(N,{entries:o,isTouchDevice:t})};var I=i(44476);const T=(0,r.Ay)(I.A)`
  margin: 0 auto 20vh;
  @media (max-width: 570px) {
    margin-top: 10vh;
  }
`,H=()=>(0,u.jsxs)(T,{children:[(0,u.jsx)(v,{}),(0,u.jsx)(S,{})]})},85692(e,t,i){i.d(t,{Wx:()=>g});var o,r=i(96540),s=Object.defineProperty,n=(e,t,i)=>((e,t,i)=>t in e?s(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i)(e,"symbol"!=typeof t?t+"":t,i),a=new Map,l=new WeakMap,c=0;function p(e){return Object.keys(e).sort().filter((t=>void 0!==e[t])).map((t=>{return`${t}_${"root"===t?(i=e.root,i?(l.has(i)||(c+=1,l.set(i,c.toString())),l.get(i)):"0"):e[t]}`;var i})).toString()}function h(e,t,i={},r=o){if(void 0===window.IntersectionObserver&&void 0!==r){const o=e.getBoundingClientRect();return t(r,{isIntersecting:r,target:e,intersectionRatio:"number"==typeof i.threshold?i.threshold:0,time:0,boundingClientRect:o,intersectionRect:o,rootBounds:o}),()=>{}}const{id:s,observer:n,elements:l}=function(e){const t=p(e);let i=a.get(t);if(!i){const o=new Map;let r;const s=new IntersectionObserver((t=>{t.forEach((t=>{var i;const s=t.isIntersecting&&r.some((e=>t.intersectionRatio>=e));e.trackVisibility&&void 0===t.isVisible&&(t.isVisible=s),null==(i=o.get(t.target))||i.forEach((e=>{e(s,t)}))}))}),e);r=s.thresholds||(Array.isArray(e.threshold)?e.threshold:[e.threshold||0]),i={id:t,observer:s,elements:o},a.set(t,i)}return i}(i),c=l.get(e)||[];return l.has(e)||l.set(e,c),c.push(t),n.observe(e),function(){c.splice(c.indexOf(t),1),0===c.length&&(l.delete(e),n.unobserve(e)),0===l.size&&(n.disconnect(),a.delete(s))}}var u,d;r.Component;function g({threshold:e,delay:t,trackVisibility:i,rootMargin:o,root:s,triggerOnce:n,skip:a,initialInView:l,fallbackInView:c,onChange:p}={}){var u;const[d,g]=r.useState(null),m=r.useRef(p),y=r.useRef(l),[f,v]=r.useState({inView:!!l,entry:void 0});m.current=p,r.useEffect((()=>{if(void 0===y.current&&(y.current=l),a||!d)return;let r;return r=h(d,((e,t)=>{const i=y.current;y.current=e,(void 0!==i||e)&&(v({inView:e,entry:t}),m.current&&m.current(e,t),t.isIntersecting&&n&&r&&(r(),r=void 0))}),{root:s,rootMargin:o,threshold:e,trackVisibility:i,delay:t},c),()=>{r&&r()}}),[Array.isArray(e)?e.toString():e,d,s,o,n,a,i,c,t]);const b=null==(u=f.entry)?void 0:u.target,$=r.useRef(void 0);d||!b||n||a||$.current===b||($.current=b,v({inView:!!l,entry:void 0}),y.current=l);const w=[g,f.inView,f.entry];return w.ref=w[0],w.inView=w[1],w.entry=w[2],w}null!=(d=null!=(u=r.useInsertionEffect)?u:r.useLayoutEffect)||r.useEffect}}]);