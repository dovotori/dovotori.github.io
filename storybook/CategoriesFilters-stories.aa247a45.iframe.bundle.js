"use strict";(globalThis.webpackChunkdovotori=globalThis.webpackChunkdovotori||[]).push([[652],{"./src/components/TypingMessage.jsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js"),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const Wrap=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.div`
  position: relative;

  p {
    display: flex;
    flex-wrap: wrap;
    flex-direction: ${p=>p.$isVertical?"column":"row"};
    line-height: 1;
    align-items: center;
    justify-content: ${p=>p.$isCenter?"center":"flex-start"};

    span {
      margin: 0 ${p=>p.$isVertical?0:"0.2em"} 0 0;
    }
  }
`,Hidden=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.p`
  visibility: ${p=>p.$isVisible?"visible":"hidden"};
`,Anim=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.p`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  transition: color 500ms linear;
`,CHARS="!<>-_\\/[]{}—=+*^?#",Modes_DISAPPEAR=-1,Modes_APPEAR=1,Modes_STOP=0,TypingMessage=({message="",isDisabled=!1,isVertical=!1,isCenter=!1,firstMessage="",className,isLoop=!1,delayLoop=5e3,delayLetter=100,trigger=0,triggerDebounce=500})=>{const count=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(0),lastFrame=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(Date.now()),req=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),timeout=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),fromMessage=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(firstMessage),toMessage=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(message),mode=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(Modes_STOP),lastTriggerTime=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(0),displayMessage=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(firstMessage),animRef=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),randomChar=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((()=>CHARS[Math.floor(18*Math.random())]),[]),randomStr=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((length=>new Array(length).fill(0).map(randomChar).join("")),[randomChar]),randomCurrentStr=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((str=>str.split("").map((car=>" "===car?car:Math.random()>.5?randomChar():car)).join("")),[randomChar]),updateDOM=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((text=>{displayMessage.current=text,animRef.current&&(animRef.current.innerHTML=text.split("").map((letter=>`<span>${" "===letter?"_":letter}</span>`)).join(""))}),[]),update=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((()=>{const now=Date.now();if(now-lastFrame.current<delayLetter)return void(req.current=requestAnimationFrame(update));let text="";switch(mode.current){case Modes_APPEAR:count.current<toMessage.current.length?(count.current++,text=toMessage.current.substring(0,count.current),text=randomCurrentStr(text)):(text=toMessage.current,fromMessage.current=toMessage.current,mode.current=Modes_STOP);break;case Modes_DISAPPEAR:count.current>0?(count.current--,text=fromMessage.current.substring(0,count.current),text=randomCurrentStr(text)):(count.current++,mode.current=Modes_APPEAR,text=randomStr(count.current))}updateDOM(text),lastFrame.current=now,mode.current!==Modes_STOP?req.current=requestAnimationFrame(update):mode.current===Modes_STOP&&isLoop&&(timeout.current&&clearTimeout(timeout.current),timeout.current=setTimeout((()=>{mode.current=Modes_DISAPPEAR,req.current=requestAnimationFrame(update)}),delayLoop))}),[isLoop,delayLoop,delayLetter,randomStr,randomCurrentStr,updateDOM]);return(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>{if(timeout.current&&clearTimeout(timeout.current),!isDisabled){const old=displayMessage.current;let nextMode=Modes_STOP;0===old.length&&message.length>0?(nextMode=Modes_APPEAR,count.current=0):old.length>0&&message.length>0?(nextMode=Modes_DISAPPEAR,count.current=old.length):nextMode=Modes_STOP,req.current&&cancelAnimationFrame(req.current),nextMode!==Modes_STOP&&(fromMessage.current=old,toMessage.current=message,lastFrame.current=Date.now(),mode.current=nextMode,req.current=requestAnimationFrame(update))}return()=>{req.current&&cancelAnimationFrame(req.current)}}),[message,isDisabled,update]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>(timeout.current&&clearTimeout(timeout.current),isLoop&&(timeout.current=setTimeout((()=>{mode.current=Modes_DISAPPEAR,req.current=requestAnimationFrame(update)}),delayLoop)),()=>{timeout.current&&clearTimeout(timeout.current)})),[isLoop,delayLoop,update]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>{req.current&&cancelAnimationFrame(req.current),timeout.current&&clearTimeout(timeout.current)}),[]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>{if(trigger>0&&!isDisabled){const now=Date.now();if(now-lastTriggerTime.current<triggerDebounce)return;lastTriggerTime.current=now,req.current&&cancelAnimationFrame(req.current),timeout.current&&clearTimeout(timeout.current),count.current=displayMessage.current.length,fromMessage.current=displayMessage.current,toMessage.current=message,mode.current=Modes_DISAPPEAR,lastFrame.current=now,req.current=requestAnimationFrame(update)}}),[trigger]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>{updateDOM(firstMessage)}),[firstMessage,updateDOM]),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(Wrap,{className,$isVertical:isVertical,$isCenter:isCenter,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Hidden,{$isVisible:isDisabled,children:message.split("").map(((letter,index)=>{const key=`${message}${letter}${index}`;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{children:" "===letter?"_":letter},key)}))}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Anim,{ref:animRef})]})},__WEBPACK_DEFAULT_EXPORT__=TypingMessage;TypingMessage.__docgenInfo={description:"",methods:[],displayName:"TypingMessage",props:{message:{defaultValue:{value:'""',computed:!1},required:!1},isDisabled:{defaultValue:{value:"false",computed:!1},required:!1},isVertical:{defaultValue:{value:"false",computed:!1},required:!1},isCenter:{defaultValue:{value:"false",computed:!1},required:!1},firstMessage:{defaultValue:{value:'""',computed:!1},required:!1},isLoop:{defaultValue:{value:"false",computed:!1},required:!1},delayLoop:{defaultValue:{value:"5000",computed:!1},required:!1},delayLetter:{defaultValue:{value:"100",computed:!1},required:!1},trigger:{defaultValue:{value:"0",computed:!1},required:!1},triggerDebounce:{defaultValue:{value:"500",computed:!1},required:!1}}}},"./src/components/stories/CategoriesFilters.stories.jsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>CategoriesFilters_stories});var _path,jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),react=__webpack_require__("./node_modules/react/index.js"),chunk_JMJ3UQ3L=__webpack_require__("./node_modules/react-router/dist/development/chunk-JMJ3UQ3L.mjs"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),utils=__webpack_require__("./src/utils/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}const Cross=(0,styled_components_browser_esm.Ay)((props=>react.createElement("svg",_extends({fill:"currentColor",viewBox:"0 0 10 10",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em"},props),_path||(_path=react.createElement("path",{d:"M 0 0 L 10 10 Z M 0 10 L 10 0 Z"})))))`
  width: 0.5em;
  height: 0.5em;
  min-width: 0.5em;
  stroke: ${p=>p.theme.getColor};
  fill: none;
`;var TypingMessage=__webpack_require__("./src/components/TypingMessage.jsx");const Wrap=styled_components_browser_esm.Ay.div`
  text-align: center;
  max-width: 1400px;
  margin: 4em auto;
  display: flex;
  align-items: center;
  justify-content: center;
  ${p=>p.theme.media.mobile`flex-direction: column;`}
`,StyledLink=(0,styled_components_browser_esm.Ay)(chunk_JMJ3UQ3L.N_)`
  position: relative;
  padding: 1em 2em;
  opacity: ${p=>p.selected?1:.5};
  font-weight: ${p=>p.selected?800:400};
  transition:
    color 100ms ease-out,
    background-color 100ms ease-out,
    box-shadow 100ms ease-out;
  color: ${p=>p.theme.text};
  text-transform: uppercase;
  ${p=>p.theme.monospace}
  ${p=>p.theme.active}
  letter-spacing: 0.5em;
  white-space: nowrap;
  &:hover {
    opacity: 1;
  }
`,StyledTypingMessage=(0,styled_components_browser_esm.Ay)(TypingMessage.A)`
  text-transform: uppercase;
  letter-spacing: 0.5em;
`,CategoriesFilters=({selected,className,categories,onClickCategory=()=>{}})=>{const triggers=(0,react.useRef)({}),[,forceUpdate]=(0,react.useState)(0);return(0,jsx_runtime.jsx)(Wrap,{className,children:Object.keys(categories).map(((categoryId,index)=>{const isLinkSelected=selected===parseInt(categoryId,10);return(0,jsx_runtime.jsxs)(react.Fragment,{children:[0!==index&&(0,jsx_runtime.jsx)(Cross,{$colorType:0}),(0,jsx_runtime.jsx)(StyledLink,{to:isLinkSelected?"/":`/category/${categories[categoryId].slug}`,selected:isLinkSelected,$colorType:(0,utils.G7)(parseInt(categoryId,10)),onClick:onClickCategory(categoryId),onMouseEnter:()=>(categoryId=>{triggers.current[categoryId]=(triggers.current[categoryId]||0)+1,forceUpdate((n=>n+1))})(categoryId),children:(0,jsx_runtime.jsx)(StyledTypingMessage,{message:categories[categoryId].label,firstMessage:categories[categoryId].label,delayLetter:30,trigger:triggers.current[categoryId]||0})})]},categories[categoryId].slug)}))})},components_CategoriesFilters=CategoriesFilters;CategoriesFilters.__docgenInfo={description:"",methods:[],displayName:"CategoriesFilters",props:{onClickCategory:{defaultValue:{value:"() => {}",computed:!1},required:!1}}};const CategoriesFilters_stories={title:"Components/CategoriesFilters",component:components_CategoriesFilters},Primary=(args=>(0,jsx_runtime.jsx)(components_CategoriesFilters,{...args})).bind({});Primary.args={categories:new Array(4).fill(0).map(((_,id)=>({label:`category ${id}`,slug:`cat${id}`,id})))};const __namedExportsOrder=["Primary"];Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:"args => <CategoriesFilters {...args} />",...Primary.parameters?.docs?.source}}}},"./src/utils/index.js"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{G7:()=>getColorType,uS:()=>getTeaserPath,wR:()=>timeout});const Locales=Object.freeze({FR:"fr",EN:"en",JP:"jp"}),getEnvPath=(Locales.FR,Locales.EN,Locales.JP,path=>`${{NODE_ENV:"production",NODE_PATH:[],STORYBOOK:"true",PUBLIC_URL:"."}.ASSET_PATH}${path}`),getTeaserPath=slug=>getEnvPath(`/img/teasers/${slug}.webp`),getColorType=category=>{switch(category){case 1:return 0;case 2:return 2;default:return 1}},timeout=ms=>new Promise((resolve=>{setTimeout(resolve,ms)}))}}]);
//# sourceMappingURL=CategoriesFilters-stories.aa247a45.iframe.bundle.js.map