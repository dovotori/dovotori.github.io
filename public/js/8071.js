"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[8071],{87691:(e,t,o)=>{o.d(t,{Z:()=>g});var i=o(79655),r=o(12788),n=o(50558),s=o(26533),l=o(67294);const a=()=>{const[e,t]=(0,l.useState)(!1),o=(0,l.useRef)(null),i=()=>t(!0),r=()=>t(!1);return(0,l.useEffect)((()=>{const e=o.current;return e?(e.addEventListener("mouseover",i),e.addEventListener("mouseout",r),()=>{e.removeEventListener("mouseover",i),e.removeEventListener("mouseout",r)}):null}),[o.current]),[o,e]};var p=o(85893);const c=(0,r.ZP)(i.rU)`
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
`,h=(0,r.ZP)(s.r)`
  position: relative;
  fill: ${e=>e.theme.getColor};
  width: auto;
  height: 0.6em;
  margin: 0 0.2em;
`,d=r.ZP.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  transition: transform 300ms ${e=>e.theme.elastic};
  background: ${e=>e.theme.backgroundHighlight};
  transform-origin: 100% 0;
  transform: ${e=>e.$isFocus?"none":"scale(0, 1)"};
`,u=r.ZP.span`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate3d(0, -50%, 0);
  display: inline-block;
  color: ${e=>e.theme.getColor};
  font-size: 0.8em;
  ${e=>e.theme.monospace}
`,g=(0,n.$j)((e=>({text:e.content.back})))((e=>{let{to:t,className:o,$colorType:i,text:r}=e;const[n,s]=a();return(0,p.jsxs)(c,{to:t||"/",className:o,$isFocus:s,$colorType:i,ref:n,children:[(0,p.jsx)(d,{$isFocus:s}),(0,p.jsx)(h,{$colorType:i}),(0,p.jsx)(u,{$colorType:i,children:r})]})}))},41982:(e,t,o)=>{o.d(t,{Z:()=>g});var i=o(67294),r=o(12788),n=o(85893);const s=r.F4`
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
`,l=r.F4`
  50% { 
    opacity: 0.5; 
    transform: translate3d(-10%, -10%, 0);
  }
  0%, 60%, 100% { 
    opacity: 0;
    transform: none;
  }
`,a=r.ZP.div``,p=r.ZP.div`
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
`,c=r.ZP.div`
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
`,h=e=>{let{className:t,src:o}=e;return(0,n.jsxs)(a,{className:t,children:[(0,n.jsx)(p,{src:o}),(0,n.jsx)(c,{src:o})]})},d=r.ZP.div`
  position: relative;
  overflow: hidden;
`,u=r.ZP.img`
  opacity: ${e=>e.loaded?1:0};
  visibility: ${e=>e.loaded?"visible":"hidden"};
  transition: opacity 300ms ease-out;
  text-transform: lowercase;
  letter-spacing: 0.1em;
`,g=(0,i.forwardRef)(((e,t)=>{let{className:o,withGlitch:r,alt:s,width:l,height:a,children:p,src:c}=e;const[g,b]=(0,i.useState)(!1),m=(0,i.useCallback)((()=>b(!0)),[b]);return(0,n.jsxs)(d,{ref:t,className:o,children:[(0,n.jsx)(u,{alt:`_${s}`,src:c,onLoad:m,loaded:g,width:l||"auto",height:a||"auto"}),g&&r&&(0,n.jsx)(h,{src:c}),!g&&p]})}))},78071:(e,t,o)=>{o.r(t),o.d(t,{default:()=>v});var i=o(89250),r=o(48903),n=o(12788),s=o(87691),l=o(97650),a=o(41982),p=o(54781),c=o(85893);const h=(0,n.ZP)(a.Z)`
  margin: 0 auto 1em;
  min-height: 50px;
  background: ${e=>e.theme.getGradient};
  box-shadow: 0 0 2em ${e=>e.theme.backgroundHighlight};
  opacity: ${e=>e.$isVisible?1:0};
  transform: ${e=>e.$isVisible?"none":"translateY(20%)"};
  transition: opacity 1s ${e=>e.theme.elastic},
    transform 1s ${e=>e.theme.elastic}, box-shadow 800ms linear;
`,d=e=>{let{slug:t,$colorType:o,idx:i,className:n}=e;const[s,a]=(0,l.YD)({threshold:0,triggerOnce:!0});return(0,c.jsx)(h,{ref:s,$colorType:o,src:(0,r.K_)(t,i),className:n,$isVisible:a,children:(0,c.jsx)(p.Z,{$colorType:o})})};var u=o(56634);const g=n.ZP.div`
  margin: 0 auto;
  max-width: 800px;

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
`,b=(0,n.ZP)(u.Z)`
  background: ${e=>e.noBackground?"transparent":e.theme.getGradient};
  --project-color: ${e=>e.theme.getColor};
`,m=e=>{let{slug:t,images:o,colorType:i,labo:r}=e;return(0,c.jsxs)(c.Fragment,{children:[!!r&&(0,c.jsx)(b,{slug:t,$colorType:i,colorType:i,noBackground:!!r.noBackground,hasHtml:!!r.hasHtml,hasJs:!!r.hasJs}),o&&(0,c.jsx)(g,{children:Array(o).fill().map(((e,t)=>t)).map((e=>(0,c.jsx)(d,{idx:e,slug:t,$colorType:i},`image-${t}-${e}`)))}),(0,c.jsx)(s.Z,{$colorType:null})]})};var y=o(37340);const v=()=>{const e=(0,i.UO)().slug||null,t=(0,y.e9)(e);return(0,c.jsx)(m,{colorType:(0,r.sD)(t.category),...t})}},97650:(e,t,o)=>{o.d(t,{YD:()=>h});var i=o(67294);const r=new Map,n=new WeakMap;let s,l=0;function a(e){return Object.keys(e).sort().filter((t=>void 0!==e[t])).map((t=>{return`${t}_${"root"===t?(o=e.root,o?(n.has(o)||(l+=1,n.set(o,l.toString())),n.get(o)):"0"):e[t]}`;var o})).toString()}function p(e,t,o={},i=s){if(void 0===window.IntersectionObserver&&void 0!==i){const r=e.getBoundingClientRect();return t(i,{isIntersecting:i,target:e,intersectionRatio:"number"==typeof o.threshold?o.threshold:0,time:0,boundingClientRect:r,intersectionRect:r,rootBounds:r}),()=>{}}const{id:n,observer:l,elements:p}=function(e){let t=a(e),o=r.get(t);if(!o){const i=new Map;let n;const s=new IntersectionObserver((t=>{t.forEach((t=>{var o;const r=t.isIntersecting&&n.some((e=>t.intersectionRatio>=e));e.trackVisibility&&void 0===t.isVisible&&(t.isVisible=r),null==(o=i.get(t.target))||o.forEach((e=>{e(r,t)}))}))}),e);n=s.thresholds||(Array.isArray(e.threshold)?e.threshold:[e.threshold||0]),o={id:t,observer:s,elements:i},r.set(t,o)}return o}(o);let c=p.get(e)||[];return p.has(e)||p.set(e,c),c.push(t),l.observe(e),function(){c.splice(c.indexOf(t),1),0===c.length&&(p.delete(e),l.unobserve(e)),0===p.size&&(l.disconnect(),r.delete(n))}}class c extends i.Component{constructor(e){super(e),this.node=null,this._unobserveCb=null,this.handleNode=e=>{this.node&&(this.unobserve(),e||this.props.triggerOnce||this.props.skip||this.setState({inView:!!this.props.initialInView,entry:void 0})),this.node=e||null,this.observeNode()},this.handleChange=(e,t)=>{e&&this.props.triggerOnce&&this.unobserve(),isPlainChildren(this.props)||this.setState({inView:e,entry:t}),this.props.onChange&&this.props.onChange(e,t)},this.state={inView:!!e.initialInView,entry:void 0}}componentDidUpdate(e){e.rootMargin===this.props.rootMargin&&e.root===this.props.root&&e.threshold===this.props.threshold&&e.skip===this.props.skip&&e.trackVisibility===this.props.trackVisibility&&e.delay===this.props.delay||(this.unobserve(),this.observeNode())}componentWillUnmount(){this.unobserve(),this.node=null}observeNode(){if(!this.node||this.props.skip)return;const{threshold:e,root:t,rootMargin:o,trackVisibility:i,delay:r,fallbackInView:n}=this.props;this._unobserveCb=p(this.node,this.handleChange,{threshold:e,root:t,rootMargin:o,trackVisibility:i,delay:r},n)}unobserve(){this._unobserveCb&&(this._unobserveCb(),this._unobserveCb=null)}render(){if(!isPlainChildren(this.props)){const{inView:e,entry:t}=this.state;return this.props.children({inView:e,entry:t,ref:this.handleNode})}const e=this.props,{children:t,as:o}=e,i=function(e,t){if(null==e)return{};var o,i,r={},n=Object.keys(e);for(0;i<n.length;i++)n[i],t.indexOf(o)>=0||(r[o]=e[o]);return r}(e,null);return React.createElement(o||"div",_extends({ref:this.handleNode},i),t)}}function h({threshold:e,delay:t,trackVisibility:o,rootMargin:r,root:n,triggerOnce:s,skip:l,initialInView:a,fallbackInView:c,onChange:h}={}){var d;const[u,g]=i.useState(null),b=i.useRef(),[m,y]=i.useState({inView:!!a,entry:void 0});b.current=h,i.useEffect((()=>{if(l||!u)return;let i;return i=p(u,((e,t)=>{y({inView:e,entry:t}),b.current&&b.current(e,t),t.isIntersecting&&s&&i&&(i(),i=void 0)}),{root:n,rootMargin:r,threshold:e,trackVisibility:o,delay:t},c),()=>{i&&i()}}),[Array.isArray(e)?e.toString():e,u,n,r,s,l,o,c,t]);const v=null==(d=m.entry)?void 0:d.target;i.useEffect((()=>{u||!v||s||l||y({inView:!!a,entry:void 0})}),[u,v,s,l,a]);const f=[g,m.inView,m.entry];return f.ref=f[0],f.inView=f[1],f.entry=f[2],f}}}]);