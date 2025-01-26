"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[3797],{43797:(e,t,i)=>{i.r(t),i.d(t,{default:()=>D});var o,r=i(23697),s=i(47767),n=i(71468),a=i(96540),l=i(44476),c=i(84976),p=i(47695);function h(){return h=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(e[o]=i[o])}return e},h.apply(this,arguments)}var d=i(14566),u=i(17427),g=i(22383),m=i(74848);const y=(0,r.Ay)(c.N_).attrs({className:"teaser"})`
  position: relative;
  overflow: hidden;
  display: inline-block;
  margin: 1em;
  width: 400px;
  height: 100px;
  opacity: 1;
  box-shadow: 0 0 1em ${e=>e.theme.backgroundHighlight};
  border-radius: 0.4em;
  transform: ${e=>e.$isVisible?e.$isHover&&!e.$isTouchDevice?"scale(1.2)":"none":"translateY(20%)"};
  z-index: ${e=>e.$isVisible&&e.$isHover&&!e.$isTouchDevice?1:0};
  transition:
    opacity 1s ${e=>e.theme.elastic},
    transform 1s ${e=>e.theme.elastic},
    box-shadow 800ms linear;

  ${e=>e.theme.active}
  ${e=>e.theme.media.mobile`margin: 0.5em auto; width: 100%; height: auto;`}
`,b=(0,r.Ay)(d.A)`
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
`,v=r.Ay.div`
  overflow: hidden;
  background: ${e=>e.theme.getGradient};
  height: 100%;
`,f=r.Ay.h3`
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
`,w=(0,r.Ay)((e=>a.createElement("svg",h({viewBox:"0 0 20 20",fill:"currentColor"},e),o||(o=a.createElement("path",{d:"M5 11 L5 9 L9 9 L9 5 L11 5 L11 9 L15 9 L15 11 L11 11 L11 15 L9 15 L9 11Z"})))))`
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
`,$=r.Ay.div`
  margin: 20px auto;
`,x=e=>{let{className:t,category:i,slug:o,title:r="",currentHover:s,setCurrentHover:n=(()=>{}),isTouchDevice:l}=e;const c=(0,u.G7)(i),[h,d]=(0,a.useState)(!1),[x,k]=(0,p.Wx)({threshold:0,triggerOnce:!0}),j=(0,a.useCallback)((()=>d(!0)),[d]),A=(0,a.useCallback)((()=>d(!1)),[d]);(0,a.useEffect)((()=>n(h?o:"")),[h]);const O=(0,a.useMemo)((()=>k?l||s===o||""===s?1:.65:0),[s,h,k]);return(0,m.jsxs)(y,{ref:x,className:t,to:`/project/${o}`,onMouseEnter:j,onMouseLeave:A,$levelOpacity:O,$isVisible:k,title:o,$isHover:h,$isTouchDevice:l,children:[(0,m.jsx)(v,{$colorType:c,children:(0,m.jsx)(b,{src:(0,u.uS)(o),alt:r,width:400,height:150,withGlitch:h,$isFocus:h,children:(0,m.jsx)($,{children:(0,m.jsx)(g.A,{$colorType:c})})})}),l?null:(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(w,{$isFocus:h,$colorType:c}),(0,m.jsx)(f,{$isFocus:h,children:r})]})]})},k=(0,r.Ay)(x)`
  transition-delay: ${e=>10*e.index}ms;
`,j=r.Ay.div.attrs({className:"teasers-list"})`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: calc(100% - 2em);
  margin: 0 auto;
  max-width: 1400px;
`,A=e=>{let{entries:t,isTouchDevice:i,className:o}=e;const[r,s]=(0,a.useState)(""),n=(0,a.useMemo)((()=>t.concat().sort(((e,t)=>e.date>t.date?-1:1))),[t]);return(0,m.jsx)(j,{className:o,$isTouchDevice:i,children:n.map(((e,t)=>(0,m.jsx)(k,{category:e.category,slug:e.slug,title:e.title,index:t,currentHover:r,setCurrentHover:s,$isTouchDevice:i},e.id)))})};var O=i(85651);const L=()=>{const e=(0,O.Fm)(),t=(0,O.qs)(),i=(0,n.d4)((e=>e.device.category)),o=-1===i?e:e.filter((e=>e.category===i));return(0,m.jsx)(A,{entries:o,isTouchDevice:t})};var C;function V(){return V=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(e[o]=i[o])}return e},V.apply(this,arguments)}const F=(0,r.Ay)((e=>a.createElement("svg",V({fill:"currentColor",viewBox:"0 0 10 10",xmlns:"http://www.w3.org/2000/svg"},e),C||(C=a.createElement("path",{d:"M 0 0 L 10 10 Z M 0 10 L 10 0 Z"})))))`
  width: 0.5em;
  height: 0.5em;
  min-width: 0.5em;
  stroke: ${e=>e.theme.getColor};
  fill: none;
`,N=r.Ay.div`
  text-align: center;
  max-width: 1400px;
  margin: 4em auto;
  display: flex;
  align-items: center;
  justify-content: center;
  ${e=>e.theme.media.mobile`flex-direction: column;`}
`,T=(0,r.Ay)(c.N_)`
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
  &:hover {
    opacity: 1;
  }
`,M=e=>{let{selected:t,className:i,categories:o}=e;return(0,m.jsx)(N,{className:i,children:Object.keys(o).map(((e,i)=>{const r=t===parseInt(e,10);return(0,m.jsxs)(a.Fragment,{children:[0!==i&&(0,m.jsx)(F,{$colorType:0}),(0,m.jsx)(T,{to:r?"/":`/category/${o[e].slug}`,selected:r,$colorType:(0,u.G7)(parseInt(e,10)),children:o[e].label})]},o[e].slug)}))})},E=()=>{const e=(0,O.bW)(),t=(0,O.Fm)().reduce(((e,t)=>({...e,[t.category]:!0})),{}),i=(0,n.d4)((e=>e.device.category)),o=Object.keys(t).reduce(((t,i)=>({...t,[i]:e[i]})),{});return(0,m.jsx)(M,{selected:i,categories:o})};var I=i(65499);const S=(0,r.Ay)(l.A)`
  margin: 0 auto 20vh;
  @media (max-width: 570px) {
    margin-top: 10vh;
  }
`,D=()=>{const e=(0,n.wA)(),t=(0,s.g)().category||null,i=(0,O.bW)(),o=t?Object.keys(i).findIndex((e=>i[e].slug===t)):-1;return(0,a.useEffect)((()=>{e((0,I.Fb)(o))}),[o]),(0,m.jsxs)(S,{children:[(0,m.jsx)(E,{}),(0,m.jsx)(L,{})]})}},14566:(e,t,i)=>{i.d(t,{A:()=>g});var o=i(96540),r=i(23697),s=i(74848);const n=r.i7`
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
`,h=e=>{let{className:t,src:i}=e;return(0,s.jsxs)(l,{className:t,children:[(0,s.jsx)(c,{src:i}),(0,s.jsx)(p,{src:i})]})},d=r.Ay.div`
  position: relative;
  overflow: hidden;
`,u=r.Ay.img`
  opacity: ${e=>e.$isLoaded?1:0};
  visibility: ${e=>e.$isLoaded?"visible":"hidden"};
  transition: opacity 300ms ease-out;
  text-transform: lowercase;
  letter-spacing: 0.1em;
`,g=(0,o.forwardRef)(((e,t)=>{let{className:i,withGlitch:r,alt:n,width:a,height:l,children:c,src:p}=e;const[g,m]=(0,o.useState)(!1),y=(0,o.useCallback)((()=>m(!0)),[m]);return(0,s.jsxs)(d,{ref:t,className:i,children:[(0,s.jsx)(u,{alt:`_${n}`,src:p,onLoad:y,$isLoaded:g,width:a||"auto",height:l||"auto"}),g&&r&&(0,s.jsx)(h,{src:p}),!g&&c]})}))},47695:(e,t,i)=>{i.d(t,{Wx:()=>d});var o=i(96540),r=Object.defineProperty,s=(e,t,i)=>(((e,t,i)=>{t in e?r(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i})(e,"symbol"!=typeof t?t+"":t,i),i),n=new Map,a=new WeakMap,l=0,c=void 0;function p(e){return Object.keys(e).sort().filter((t=>void 0!==e[t])).map((t=>{return`${t}_${"root"===t?(i=e.root,i?(a.has(i)||(l+=1,a.set(i,l.toString())),a.get(i)):"0"):e[t]}`;var i})).toString()}function h(e,t,i={},o=c){if(void 0===window.IntersectionObserver&&void 0!==o){const r=e.getBoundingClientRect();return t(o,{isIntersecting:o,target:e,intersectionRatio:"number"==typeof i.threshold?i.threshold:0,time:0,boundingClientRect:r,intersectionRect:r,rootBounds:r}),()=>{}}const{id:r,observer:s,elements:a}=function(e){const t=p(e);let i=n.get(t);if(!i){const o=new Map;let r;const s=new IntersectionObserver((t=>{t.forEach((t=>{var i;const s=t.isIntersecting&&r.some((e=>t.intersectionRatio>=e));e.trackVisibility&&void 0===t.isVisible&&(t.isVisible=s),null==(i=o.get(t.target))||i.forEach((e=>{e(s,t)}))}))}),e);r=s.thresholds||(Array.isArray(e.threshold)?e.threshold:[e.threshold||0]),i={id:t,observer:s,elements:o},n.set(t,i)}return i}(i),l=a.get(e)||[];return a.has(e)||a.set(e,l),l.push(t),s.observe(e),function(){l.splice(l.indexOf(t),1),0===l.length&&(a.delete(e),s.unobserve(e)),0===a.size&&(s.disconnect(),n.delete(r))}}o.Component;function d({threshold:e,delay:t,trackVisibility:i,rootMargin:r,root:s,triggerOnce:n,skip:a,initialInView:l,fallbackInView:c,onChange:p}={}){var d;const[u,g]=o.useState(null),m=o.useRef(),[y,b]=o.useState({inView:!!l,entry:void 0});m.current=p,o.useEffect((()=>{if(a||!u)return;let o;return o=h(u,((e,t)=>{b({inView:e,entry:t}),m.current&&m.current(e,t),t.isIntersecting&&n&&o&&(o(),o=void 0)}),{root:s,rootMargin:r,threshold:e,trackVisibility:i,delay:t},c),()=>{o&&o()}}),[Array.isArray(e)?e.toString():e,u,s,r,n,a,i,c,t]);const v=null==(d=y.entry)?void 0:d.target,f=o.useRef();u||!v||n||a||f.current===v||(f.current=v,b({inView:!!l,entry:void 0}));const w=[g,y.inView,y.entry];return w.ref=w[0],w.inView=w[1],w.entry=w[2],w}}}]);