"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[9565],{89565:(e,t,i)=>{i.r(t),i.d(t,{default:()=>E});var o,s=i(12788),r=i(89250),n=i(50558),a=i(67294),l=i(40416),c=i(79655),h=i(97650);function p(){return p=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(e[o]=i[o])}return e},p.apply(this,arguments)}var d=i(41982),u=i(48903),g=i(54781),m=i(85893);const y=(0,s.ZP)(c.rU).attrs({className:"teaser"})`
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
  transition: opacity 1s ${e=>e.theme.elastic},
    transform 1s ${e=>e.theme.elastic}, box-shadow 800ms linear;

  ${e=>e.theme.active}
  ${e=>e.theme.media.mobile`margin: 0.5em auto; width: 100%; height: auto;`}
`,b=(0,s.ZP)(d.Z)`
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
`,v=s.ZP.div`
  overflow: hidden;
  background: ${e=>e.theme.getGradient};
  height: 100%;
`,f=s.ZP.h3`
  position: absolute;
  top: 50%;
  left: 0;
  color: ${e=>e.theme.text};
  font-size: 10em;
  letter-spacing: 0.1em;
  opacity: ${e=>e.$isFocus?.4:0};
  transition: opacity 1s ${e=>e.theme.elastic},
    transform 1s ${e=>e.theme.elastic};
  transform: ${e=>e.$isFocus?"translate3d(0, -50%, 0)":"translate3d(-100%, -50%, 0)"};
  z-index: 1;
  white-space: nowrap;
`,w=(0,s.ZP)((e=>a.createElement("svg",p({viewBox:"0 0 20 20",fill:"currentColor"},e),o||(o=a.createElement("path",{d:"M5 11 L5 9 L9 9 L9 5 L11 5 L11 9 L15 9 L15 11 L11 11 L11 15 L9 15 L9 11Z"})))))`
  position: absolute;
  top: 25%;
  left: 5%;
  width: auto;
  height: 50%;
  fill: ${e=>e.theme.getColor};
  opacity: ${e=>e.$isFocus?1:0};
  transition: opacity 1s ${e=>e.theme.elastic},
    transform 1s ${e=>e.theme.elastic};
  transform: ${e=>e.$isFocus?"none":"scale(0) rotate(45deg)"};
  z-index: 2;
`,$=s.ZP.div`
  margin: 20px auto;
`,x=e=>{let{className:t,category:i,slug:o,title:s="",currentHover:r,setCurrentHover:n=(()=>{}),isTouchDevice:l}=e;const c=(0,u.sD)(i),[p,d]=(0,a.useState)(!1),[x,k]=(0,h.YD)({threshold:0,triggerOnce:!0}),j=(0,a.useCallback)((()=>d(!0)),[d]),C=(0,a.useCallback)((()=>d(!1)),[d]);(0,a.useEffect)((()=>n(p?o:"")),[p]);const V=(0,a.useMemo)((()=>k?l||r===o||""===r?1:.65:0),[r,p,k]);return(0,m.jsxs)(y,{ref:x,className:t,to:`/project/${o}`,onMouseEnter:j,onMouseLeave:C,$levelOpacity:V,$isVisible:k,title:o,$isHover:p,$isTouchDevice:l,children:[(0,m.jsx)(v,{$colorType:c,children:(0,m.jsx)(b,{src:(0,u.e7)(o),alt:s,width:400,height:150,withGlitch:p,$isFocus:p,children:(0,m.jsx)($,{children:(0,m.jsx)(g.Z,{$colorType:c})})})}),l?null:(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(w,{$isFocus:p,$colorType:c}),(0,m.jsx)(f,{$isFocus:p,children:s})]})]})},k=(0,s.ZP)(x)`
  transition-delay: ${e=>10*e.index}ms;
`,j=s.ZP.div.attrs({className:"teasers-list"})`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  width: calc(100% - 2em);
  margin: 0 auto;
  max-width: 1400px;
`,C=e=>{let{entries:t,isTouchDevice:i,className:o}=e;const[s,r]=(0,a.useState)(""),n=(0,a.useMemo)((()=>t.concat().sort(((e,t)=>e.date>t.date?-1:1))),[t]);return(0,m.jsx)(j,{className:o,$isTouchDevice:i,children:n.map(((e,t)=>(0,m.jsx)(k,{category:e.category,slug:e.slug,title:e.title,index:t,currentHover:s,setCurrentHover:r,$isTouchDevice:i},e.id)))})};var V=i(37340);const Z=()=>{const e=(0,V.Cg)(),t=(0,V.HZ)(),i=(0,n.v9)((e=>e.device.category)),o=-1===i?e:e.filter((e=>e.category===i));return(0,m.jsx)(C,{entries:o,isTouchDevice:t})};var P;function O(){return O=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i=arguments[t];for(var o in i)Object.prototype.hasOwnProperty.call(i,o)&&(e[o]=i[o])}return e},O.apply(this,arguments)}const N=(0,s.ZP)((e=>a.createElement("svg",O({fill:"currentColor",viewBox:"0 0 10 10",xmlns:"http://www.w3.org/2000/svg"},e),P||(P=a.createElement("path",{d:"M 0 0 L 10 10 Z M 0 10 L 10 0 Z"})))))`
  width: 0.5em;
  height: 0.5em;
  min-width: 0.5em;
  stroke: ${e=>e.theme.getColor};
  fill: none;
`,M=s.ZP.div`
  text-align: center;
  max-width: 1400px;
  margin: 4em auto;
  display: flex;
  align-items: center;
  justify-content: center;
  ${e=>e.theme.media.mobile`flex-direction: column;`}
`,L=(0,s.ZP)(c.rU)`
  position: relative;
  padding: 1em 2em;
  opacity: ${e=>e.selected?1:.5};
  font-weight: ${e=>e.selected?800:400};
  transition: color 100ms ease-out, background-color 100ms ease-out,
    box-shadow 100ms ease-out;
  color: ${e=>e.theme.text};
  text-transform: uppercase;
  ${e=>e.theme.monospace}
  ${e=>e.theme.active}
  &:hover {
    opacity: 1;
  }
`,I=e=>{let{selected:t,className:i,categories:o}=e;return(0,m.jsx)(M,{className:i,children:Object.keys(o).map(((e,i)=>{const s=t===parseInt(e,10);return(0,m.jsxs)(a.Fragment,{children:[0!==i&&(0,m.jsx)(N,{$colorType:0}),(0,m.jsx)(L,{to:s?"/":`/category/${o[e].slug}`,selected:s,$colorType:(0,u.sD)(parseInt(e,10)),children:o[e].label})]},o[e].slug)}))})},D=()=>{const e=(0,V.CP)(),t=(0,V.Cg)().reduce(((e,t)=>({...e,[t.category]:!0})),{}),i=(0,n.v9)((e=>e.device.category)),o=Object.keys(t).reduce(((t,i)=>({...t,[i]:e[i]})),{});return(0,m.jsx)(I,{selected:i,categories:o})};var F=i(83873);const T=(0,s.ZP)(l.Z)`
margin: 0 auto 20vh;
@media (max-width: 570px) {
  margin-top: 10vh;
}
`,E=()=>{const e=(0,n.I0)(),t=(0,r.UO)().category||null,i=(0,V.CP)(),o=t?Object.keys(i).findIndex((e=>i[e].slug===t)):-1;return(0,a.useEffect)((()=>{e((0,F.PR)(o))}),[o]),(0,m.jsxs)(T,{children:[(0,m.jsx)(D,{}),(0,m.jsx)(Z,{})]})}},41982:(e,t,i)=>{i.d(t,{Z:()=>g});var o=i(67294),s=i(12788),r=i(85893);const n=s.F4`
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
`,a=s.F4`
  50% { 
    opacity: 0.5; 
    transform: translate3d(-10%, -10%, 0);
  }
  0%, 60%, 100% { 
    opacity: 0;
    transform: none;
  }
`,l=s.ZP.div``,c=s.ZP.div`
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
`,h=s.ZP.div`
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
`,p=e=>{let{className:t,src:i}=e;return(0,r.jsxs)(l,{className:t,children:[(0,r.jsx)(c,{src:i}),(0,r.jsx)(h,{src:i})]})},d=s.ZP.div`
  position: relative;
  overflow: hidden;
`,u=s.ZP.img`
  opacity: ${e=>e.loaded?1:0};
  visibility: ${e=>e.loaded?"visible":"hidden"};
  transition: opacity 300ms ease-out;
  text-transform: lowercase;
  letter-spacing: 0.1em;
`,g=(0,o.forwardRef)(((e,t)=>{let{className:i,withGlitch:s,alt:n,width:a,height:l,children:c,src:h}=e;const[g,m]=(0,o.useState)(!1),y=(0,o.useCallback)((()=>m(!0)),[m]);return(0,r.jsxs)(d,{ref:t,className:i,children:[(0,r.jsx)(u,{alt:`_${n}`,src:h,onLoad:y,loaded:g,width:a||"auto",height:l||"auto"}),g&&s&&(0,r.jsx)(p,{src:h}),!g&&c]})}))},97650:(e,t,i)=>{i.d(t,{YD:()=>p});var o=i(67294);const s=new Map,r=new WeakMap;let n,a=0;function l(e){return Object.keys(e).sort().filter((t=>void 0!==e[t])).map((t=>{return`${t}_${"root"===t?(i=e.root,i?(r.has(i)||(a+=1,r.set(i,a.toString())),r.get(i)):"0"):e[t]}`;var i})).toString()}function c(e,t,i={},o=n){if(void 0===window.IntersectionObserver&&void 0!==o){const s=e.getBoundingClientRect();return t(o,{isIntersecting:o,target:e,intersectionRatio:"number"==typeof i.threshold?i.threshold:0,time:0,boundingClientRect:s,intersectionRect:s,rootBounds:s}),()=>{}}const{id:r,observer:a,elements:c}=function(e){let t=l(e),i=s.get(t);if(!i){const o=new Map;let r;const n=new IntersectionObserver((t=>{t.forEach((t=>{var i;const s=t.isIntersecting&&r.some((e=>t.intersectionRatio>=e));e.trackVisibility&&void 0===t.isVisible&&(t.isVisible=s),null==(i=o.get(t.target))||i.forEach((e=>{e(s,t)}))}))}),e);r=n.thresholds||(Array.isArray(e.threshold)?e.threshold:[e.threshold||0]),i={id:t,observer:n,elements:o},s.set(t,i)}return i}(i);let h=c.get(e)||[];return c.has(e)||c.set(e,h),h.push(t),a.observe(e),function(){h.splice(h.indexOf(t),1),0===h.length&&(c.delete(e),a.unobserve(e)),0===c.size&&(a.disconnect(),s.delete(r))}}class h extends o.Component{constructor(e){super(e),this.node=null,this._unobserveCb=null,this.handleNode=e=>{this.node&&(this.unobserve(),e||this.props.triggerOnce||this.props.skip||this.setState({inView:!!this.props.initialInView,entry:void 0})),this.node=e||null,this.observeNode()},this.handleChange=(e,t)=>{e&&this.props.triggerOnce&&this.unobserve(),isPlainChildren(this.props)||this.setState({inView:e,entry:t}),this.props.onChange&&this.props.onChange(e,t)},this.state={inView:!!e.initialInView,entry:void 0}}componentDidUpdate(e){e.rootMargin===this.props.rootMargin&&e.root===this.props.root&&e.threshold===this.props.threshold&&e.skip===this.props.skip&&e.trackVisibility===this.props.trackVisibility&&e.delay===this.props.delay||(this.unobserve(),this.observeNode())}componentWillUnmount(){this.unobserve(),this.node=null}observeNode(){if(!this.node||this.props.skip)return;const{threshold:e,root:t,rootMargin:i,trackVisibility:o,delay:s,fallbackInView:r}=this.props;this._unobserveCb=c(this.node,this.handleChange,{threshold:e,root:t,rootMargin:i,trackVisibility:o,delay:s},r)}unobserve(){this._unobserveCb&&(this._unobserveCb(),this._unobserveCb=null)}render(){if(!isPlainChildren(this.props)){const{inView:e,entry:t}=this.state;return this.props.children({inView:e,entry:t,ref:this.handleNode})}const e=this.props,{children:t,as:i}=e,o=function(e,t){if(null==e)return{};var i,o,s={},r=Object.keys(e);for(0;o<r.length;o++)r[o],t.indexOf(i)>=0||(s[i]=e[i]);return s}(e,null);return React.createElement(i||"div",_extends({ref:this.handleNode},o),t)}}function p({threshold:e,delay:t,trackVisibility:i,rootMargin:s,root:r,triggerOnce:n,skip:a,initialInView:l,fallbackInView:h,onChange:p}={}){var d;const[u,g]=o.useState(null),m=o.useRef(),[y,b]=o.useState({inView:!!l,entry:void 0});m.current=p,o.useEffect((()=>{if(a||!u)return;let o;return o=c(u,((e,t)=>{b({inView:e,entry:t}),m.current&&m.current(e,t),t.isIntersecting&&n&&o&&(o(),o=void 0)}),{root:r,rootMargin:s,threshold:e,trackVisibility:i,delay:t},h),()=>{o&&o()}}),[Array.isArray(e)?e.toString():e,u,r,s,n,a,i,h,t]);const v=null==(d=y.entry)?void 0:d.target;o.useEffect((()=>{u||!v||n||a||b({inView:!!l,entry:void 0})}),[u,v,n,a,l]);const f=[g,y.inView,y.entry];return f.ref=f[0],f.inView=f[1],f.entry=f[2],f}}}]);