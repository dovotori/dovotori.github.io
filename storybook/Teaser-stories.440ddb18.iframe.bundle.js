"use strict";(globalThis.webpackChunkdovotori=globalThis.webpackChunkdovotori||[]).push([[111],{"./src/components/Loader.tsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{A:()=>components_Loader});var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),react=__webpack_require__("./node_modules/react/index.js"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const blink=styled_components_browser_esm.i7`
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
`,Div=(styled_components_browser_esm.i7`
  0%   { transform: translate3d(-2px, 2px, 0); }
  25%  { transform: translate3d(-2px, -2px, 0); }
  50%  { transform: translate3d(2px, 2px, 0); }
  75%  { transform: translate3d(2px, -2px, 0); }
  100%  { transform: translate3d(-2px, 2px, 0); }
`,styled_components_browser_esm.i7`
  0% { background-position: 0% 0%; }
  100% { background-position: 100% 0%; }
`,styled_components_browser_esm.i7`
  0% { transform: translateX(0%) scaleX(0); }
  50% { transform: translateX(0%) scaleX(1); }
  100% { transform: translateX(100%) scaleX(0); }
`,styled_components_browser_esm.Ay.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`),Blink=styled_components_browser_esm.Ay.span`
  animation: ${blink} 1s linear infinite;
  color: ${p=>p.theme.primary};
`,CharStream=styled_components_browser_esm.Ay.div`
  color: ${p=>p.theme.primary};
  ${p=>p.theme.monospace}
  font-family: monospace;
  letter-spacing: 2px;
  min-width: 120px;
  text-align: left;
`,CHARS=["/","-","\\","=","<",">","+","#"],Loader=({className})=>{const charsRef=(0,react.useRef)([]),streamRef=(0,react.useRef)(null);return(0,react.useEffect)((()=>{const interval=setInterval((()=>{const newChar=CHARS[Math.floor(Math.random()*CHARS.length)];charsRef.current=[newChar,...charsRef.current],charsRef.current.length>10&&(charsRef.current=charsRef.current.slice(0,10)),streamRef.current&&(streamRef.current.textContent=charsRef.current.join(""))}),100);return()=>clearInterval(interval)}),[]),(0,jsx_runtime.jsx)(Div,{className,children:(0,jsx_runtime.jsxs)(CharStream,{children:[(0,jsx_runtime.jsx)(Blink,{children:"_"}),(0,jsx_runtime.jsx)("span",{ref:streamRef})]})})},components_Loader=Loader;Loader.__docgenInfo={description:"",methods:[],displayName:"Loader",props:{className:{required:!1,tsType:{name:"string"},description:""}}}},"./src/components/stories/Teaser.stories.jsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Teaser_stories});var _path,jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),react=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}var unsupportedValue,__defProp=Object.defineProperty,__publicField=(obj,key,value)=>((obj,key,value)=>key in obj?__defProp(obj,key,{enumerable:!0,configurable:!0,writable:!0,value}):obj[key]=value)(obj,"symbol"!=typeof key?key+"":key,value),observerMap=new Map,RootIds=new WeakMap,rootId=0;function optionsToId(options){return Object.keys(options).sort().filter((key=>void 0!==options[key])).map((key=>`${key}_${"root"===key?function getRootId(root){return root?(RootIds.has(root)||(rootId+=1,RootIds.set(root,rootId.toString())),RootIds.get(root)):"0"}(options.root):options[key]}`)).toString()}function observe(element,callback,options={},fallbackInView=unsupportedValue){if(void 0===window.IntersectionObserver&&void 0!==fallbackInView){const bounds=element.getBoundingClientRect();return callback(fallbackInView,{isIntersecting:fallbackInView,target:element,intersectionRatio:"number"==typeof options.threshold?options.threshold:0,time:0,boundingClientRect:bounds,intersectionRect:bounds,rootBounds:bounds}),()=>{}}const{id,observer,elements}=function createObserver(options){const id=optionsToId(options);let instance=observerMap.get(id);if(!instance){const elements=new Map;let thresholds;const observer=new IntersectionObserver((entries=>{entries.forEach((entry=>{var _a2;const inView=entry.isIntersecting&&thresholds.some((threshold=>entry.intersectionRatio>=threshold));options.trackVisibility&&void 0===entry.isVisible&&(entry.isVisible=inView),null==(_a2=elements.get(entry.target))||_a2.forEach((callback=>{callback(inView,entry)}))}))}),options);thresholds=observer.thresholds||(Array.isArray(options.threshold)?options.threshold:[options.threshold||0]),instance={id,observer,elements},observerMap.set(id,instance)}return instance}(options),callbacks=elements.get(element)||[];return elements.has(element)||elements.set(element,callbacks),callbacks.push(callback),observer.observe(element),function unobserve(){callbacks.splice(callbacks.indexOf(callback),1),0===callbacks.length&&(elements.delete(element),observer.unobserve(element)),0===elements.size&&(observer.disconnect(),observerMap.delete(id))}}var _a,_b;react.Component;null!=(_b=null!=(_a=react.useInsertionEffect)?_a:react.useLayoutEffect)||react.useEffect;var chunk_JMJ3UQ3L=__webpack_require__("./node_modules/react-router/dist/development/chunk-JMJ3UQ3L.mjs"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),utils=__webpack_require__("./src/utils/index.js");const glitchHorizontal=styled_components_browser_esm.i7`
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
`,glitchFlash=styled_components_browser_esm.i7`
  50% { 
    opacity: 0.5; 
    transform: translate3d(-10%, -10%, 0);
  }
  0%, 60%, 100% { 
    opacity: 0;
    transform: none;
  }
`,Wrap=styled_components_browser_esm.Ay.div``,Glitch=styled_components_browser_esm.Ay.div`
  @supports (
    (clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%)) or
      (-webkit-clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%))
  ) {
    position: absolute;
    top: -40px;
    left: -40px;
    width: calc(100% + 80px);
    height: calc(100% + 80px);
    background: url(${p=>p.src}) no-repeat 50% 0;
    background-size: cover;
    background-blend-mode: multiply;
    transform: translate3d(40px, 0, 0);
    animation: ${glitchHorizontal} 1s infinite linear alternate;
  }
`,GlitchBlink=styled_components_browser_esm.Ay.div`
  @supports (
    (clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%)) or
      (-webkit-clip-path: polygon(0 0, 100% 0, 100% 75%, 0 100%))
  ) {
    position: absolute;
    top: 0;
    left: 0;
    width: 110%;
    height: 110%;
    background: url(${p=>p.src}) no-repeat 50% 0;
    background-size: cover;
    background-blend-mode: multiply;
    animation: ${glitchFlash} 2s steps(1, end) infinite;
  }
`,GlitchImage=({className,src})=>(0,jsx_runtime.jsxs)(Wrap,{className,children:[(0,jsx_runtime.jsx)(Glitch,{src}),(0,jsx_runtime.jsx)(GlitchBlink,{src})]}),components_GlitchImage=GlitchImage;GlitchImage.__docgenInfo={description:"",methods:[],displayName:"GlitchImage"};const LazyImage_Wrap=styled_components_browser_esm.Ay.div`
  position: relative;
  overflow: hidden;
`,IMG=styled_components_browser_esm.Ay.img`
  opacity: ${p=>p.$isLoaded?1:0};
  visibility: ${p=>p.$isLoaded?"visible":"hidden"};
  transition: opacity 300ms ease-out;
  text-transform: lowercase;
  letter-spacing: 0.1em;
`,LazyImage=({className,withGlitch,alt,width,height,children,src,ref,placeholderImg})=>{const[isLoaded,setIsLoaded]=(0,react.useState)(!1),[hasError,setHasError]=(0,react.useState)(!1),[finalSrc,setFinalSrc]=(0,react.useState)(src),[usedPlaceholder,setUsedPlaceholder]=(0,react.useState)(!1),onLoad=(0,react.useCallback)((()=>{setIsLoaded(!0)}),[]),onError=(0,react.useCallback)((()=>{placeholderImg&&!usedPlaceholder?(setFinalSrc(placeholderImg),setUsedPlaceholder(!0),setIsLoaded(!1)):(setHasError(!0),setIsLoaded(!0))}),[placeholderImg,usedPlaceholder]);return(0,jsx_runtime.jsxs)(LazyImage_Wrap,{ref,className,children:[!hasError&&(0,jsx_runtime.jsx)(IMG,{alt:`_${alt}`,src:finalSrc,onLoad,onError,$isLoaded:isLoaded,width:width||"auto",height:height||"auto"}),!hasError&&isLoaded&&withGlitch&&(0,jsx_runtime.jsx)(components_GlitchImage,{src:finalSrc}),!isLoaded&&children]})},components_LazyImage=LazyImage;LazyImage.__docgenInfo={description:"",methods:[],displayName:"LazyImage"};var Loader=__webpack_require__("./src/components/Loader.tsx");const StyledLink=(0,styled_components_browser_esm.Ay)(chunk_JMJ3UQ3L.N_).attrs({className:"teaser"})`
  position: relative;
  overflow: hidden;
  display: inline-block;
  margin: 10px;
  width: 400px;
  height: 100px;
  opacity: ${p=>p.$isVisible?1:0};
  box-shadow: ${p=>p.$isHover?`0 0 1em ${p.theme.backgroundHighlight}`:"none"};
  transform: ${p=>p.$isVisible?p.$isHover&&!p.$isTouchDevice?"scale(1.2)":"scale(1.01)":"translateY(20%)"};
  z-index: ${p=>p.$isVisible&&p.$isHover&&!p.$isTouchDevice?1:0};
  transition:
    opacity 1s ${p=>p.theme.elastic},
    transform 1s ${p=>p.theme.elastic},
    box-shadow 800ms linear;

  clip-path: polygon(
    0 0,
    100% 0,
    100% calc(100% - 16px),
    calc(100% - 16px) 100%,
    0 100%
  );

  ${p=>p.theme.active}
  ${p=>p.theme.media.mobile`margin: 5px auto; width: 100%; height: auto;`}
`,StyledLazyImage=(0,styled_components_browser_esm.Ay)(components_LazyImage)`
  width: 100%;
  transform: ${p=>p.$isFocus?"scale(1.1)":"none"};
  transition: transform 5000ms ${p=>p.theme.elastic};
  height: 100%;
  img {
    width: 100%;
    height: auto;
    display: block;
    margin-top: -25px;
    opacity: ${p=>p.$isFocus?.7:.8};
  }
`,Infos=styled_components_browser_esm.Ay.div`
  overflow: hidden;
  background: ${p=>p.theme.getGradient};
  height: 100%;
`,Title=styled_components_browser_esm.Ay.h3`
  position: absolute;
  top: 50%;
  left: 0;
  color: ${p=>p.theme.text};
  font-size: 10em;
  letter-spacing: 0.1em;
  opacity: ${p=>p.$isFocus?.4:0};
  transition:
    opacity 1s ${p=>p.theme.elastic},
    transform 1s ${p=>p.theme.elastic};
  transform: ${p=>p.$isFocus?"translate3d(0, -50%, 0)":"translate3d(-100%, -50%, 0)"};
  z-index: 1;
  white-space: nowrap;
`,Plus=(0,styled_components_browser_esm.Ay)((props=>react.createElement("svg",_extends({viewBox:"0 0 20 20",fill:"currentColor",width:"1em",height:"1em"},props),_path||(_path=react.createElement("path",{d:"M5 11 L5 9 L9 9 L9 5 L11 5 L11 9 L15 9 L15 11 L11 11 L11 15 L9 15 L9 11Z"})))))`
  position: absolute;
  top: 25%;
  left: 5%;
  width: auto;
  height: 50%;
  fill: ${p=>p.theme.getColor};
  opacity: ${p=>p.$isFocus?1:0};
  transition:
    opacity 1s ${p=>p.theme.elastic},
    transform 1s ${p=>p.theme.elastic};
  transform: ${p=>p.$isFocus?"none":"scale(0) rotate(45deg)"};
  z-index: 2;
`,WrapLoader=styled_components_browser_esm.Ay.div`
  margin: 20px auto;
`,Teaser=({className,category,slug,title="",currentHover,setCurrentHover=()=>{},isTouchDevice})=>{const $colorType=(0,utils.G7)(category),[isHovered,setIsHovered]=(0,react.useState)(!1),[refInView,inView]=function useInView({threshold,delay,trackVisibility,rootMargin,root,triggerOnce,skip,initialInView,fallbackInView,onChange}={}){var _a2;const[ref,setRef]=react.useState(null),callback=react.useRef(onChange),lastInViewRef=react.useRef(initialInView),[state,setState]=react.useState({inView:!!initialInView,entry:void 0});callback.current=onChange,react.useEffect((()=>{if(void 0===lastInViewRef.current&&(lastInViewRef.current=initialInView),skip||!ref)return;let unobserve;return unobserve=observe(ref,((inView,entry)=>{const previousInView=lastInViewRef.current;lastInViewRef.current=inView,(void 0!==previousInView||inView)&&(setState({inView,entry}),callback.current&&callback.current(inView,entry),entry.isIntersecting&&triggerOnce&&unobserve&&(unobserve(),unobserve=void 0))}),{root,rootMargin,threshold,trackVisibility,delay},fallbackInView),()=>{unobserve&&unobserve()}}),[Array.isArray(threshold)?threshold.toString():threshold,ref,root,rootMargin,triggerOnce,skip,trackVisibility,fallbackInView,delay]);const entryTarget=null==(_a2=state.entry)?void 0:_a2.target,previousEntryTarget=react.useRef(void 0);ref||!entryTarget||triggerOnce||skip||previousEntryTarget.current===entryTarget||(previousEntryTarget.current=entryTarget,setState({inView:!!initialInView,entry:void 0}),lastInViewRef.current=initialInView);const result=[setRef,state.inView,state.entry];return result.ref=result[0],result.inView=result[1],result.entry=result[2],result}({threshold:0,triggerOnce:!0});(0,react.useEffect)((()=>setCurrentHover(isHovered?slug:"")),[isHovered,setCurrentHover,slug]);const opacity=(0,react.useMemo)((()=>inView?isTouchDevice||currentHover===slug||""===currentHover?1:.65:0),[currentHover,inView,isTouchDevice,slug]);return(0,jsx_runtime.jsxs)(StyledLink,{ref:refInView,className,to:`/project/${slug}`,onMouseEnter:()=>setIsHovered(!0),onMouseLeave:()=>setIsHovered(!1),$levelOpacity:opacity,$isVisible:inView,title,$isHover:isHovered,$isTouchDevice:isTouchDevice,children:[(0,jsx_runtime.jsx)(Infos,{$colorType,children:(0,jsx_runtime.jsx)(StyledLazyImage,{src:(0,utils.uS)(slug),alt:title,width:400,height:150,withGlitch:isHovered,$isFocus:isHovered,children:(0,jsx_runtime.jsx)(WrapLoader,{children:(0,jsx_runtime.jsx)(Loader.A,{$colorType})})})}),isTouchDevice?null:(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(Plus,{$isFocus:isHovered,$colorType}),(0,jsx_runtime.jsx)(Title,{$isFocus:isHovered,children:title})]})]})},components_Teaser=Teaser;Teaser.__docgenInfo={description:"",methods:[],displayName:"Teaser",props:{title:{defaultValue:{value:'""',computed:!1},required:!1},setCurrentHover:{defaultValue:{value:"() => {}",computed:!1},required:!1}}};const Teaser_stories={title:"Components/Teaser",component:components_Teaser},Primary=(args=>(0,jsx_runtime.jsx)(components_Teaser,{...args})).bind({});Primary.args={title:"Teaser"};const __namedExportsOrder=["Primary"];Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:"args => <Teaser {...args} />",...Primary.parameters?.docs?.source}}}},"./src/utils/index.js"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{G7:()=>getColorType,uS:()=>getTeaserPath,wR:()=>timeout});const Locales=Object.freeze({FR:"fr",EN:"en",JP:"jp"}),getEnvPath=(Locales.FR,Locales.EN,Locales.JP,path=>`${{NODE_ENV:"production",NODE_PATH:[],STORYBOOK:"true",PUBLIC_URL:"."}.ASSET_PATH}${path}`),getTeaserPath=slug=>getEnvPath(`/img/teasers/${slug}.png`),getColorType=category=>{switch(category){case 1:return 0;case 2:return 2;default:return 1}},timeout=ms=>new Promise((resolve=>{setTimeout(resolve,ms)}))}}]);
//# sourceMappingURL=Teaser-stories.440ddb18.iframe.bundle.js.map