"use strict";(globalThis.webpackChunkdovotori=globalThis.webpackChunkdovotori||[]).push([[113],{"./src/components/Tag.jsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js"),styled_components__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_utils__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/utils/index.js");const Wrap=styled_components__WEBPACK_IMPORTED_MODULE_1__.Ay.span`
  font-size: 0.8em;
  color: ${p=>p.theme.text};
  white-space: nowrap;
  margin: 0;
  border-bottom: solid 2px ${p=>p.theme.getColor??p.theme.primary};
`,__WEBPACK_DEFAULT_EXPORT__=({className,label,category,picto,hidePicto=!0})=>{const $colorType=(0,_utils__WEBPACK_IMPORTED_MODULE_2__.G7)(category);return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Wrap,{className,$colorType,children:label})}},"./src/components/TagsList.jsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js"),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),_Tag__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/Tag.jsx");const Wrap=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.p`
  letter-spacing: 0.1em;
  margin: 0 0 1em;
`,Span=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.span`
  color: ${p=>p.theme.midl};
`,TagsList=({className,tags})=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Wrap,{className,children:tags.map((({label,slug,categoryId,picto},id)=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(react__WEBPACK_IMPORTED_MODULE_1__.Fragment,{children:[0!==id?(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Span,{children:" / "}):null,(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Tag__WEBPACK_IMPORTED_MODULE_3__.A,{label,category:categoryId,picto})]},slug)))}),__WEBPACK_DEFAULT_EXPORT__=TagsList;TagsList.__docgenInfo={description:"",methods:[],displayName:"TagsList"}},"./src/components/TypingMessage.jsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js"),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/index.js"),styled_components__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const Wrap=styled_components__WEBPACK_IMPORTED_MODULE_2__.Ay.div`
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
`,CHARS="!<>-_\\/[]{}—=+*^?#",Modes_DISAPPEAR=-1,Modes_APPEAR=1,Modes_STOP=0,TypingMessage=({message="",isDisabled=!1,isVertical=!1,isCenter=!1,firstMessage="",className,isLoop=!1,delayLoop=5e3,delayLetter=100,trigger=0,triggerDebounce=500})=>{const count=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(0),lastFrame=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(Date.now()),req=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),timeout=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),fromMessage=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(firstMessage),toMessage=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(message),mode=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(Modes_STOP),lastTriggerTime=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(0),displayMessage=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(firstMessage),animRef=(0,react__WEBPACK_IMPORTED_MODULE_1__.useRef)(null),randomChar=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((()=>CHARS[Math.floor(18*Math.random())]),[]),randomStr=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((length=>new Array(length).fill(0).map(randomChar).join("")),[randomChar]),randomCurrentStr=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((str=>str.split("").map((car=>" "===car?car:Math.random()>.5?randomChar():car)).join("")),[randomChar]),updateDOM=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((text=>{displayMessage.current=text,animRef.current&&(animRef.current.innerHTML=text.split("").map((letter=>`<span>${" "===letter?"_":letter}</span>`)).join(""))}),[]),update=(0,react__WEBPACK_IMPORTED_MODULE_1__.useCallback)((()=>{const now=Date.now();if(now-lastFrame.current<delayLetter)return void(req.current=requestAnimationFrame(update));let text="";switch(mode.current){case Modes_APPEAR:count.current<toMessage.current.length?(count.current++,text=toMessage.current.substring(0,count.current),text=randomCurrentStr(text)):(text=toMessage.current,fromMessage.current=toMessage.current,mode.current=Modes_STOP);break;case Modes_DISAPPEAR:count.current>0?(count.current--,text=fromMessage.current.substring(0,count.current),text=randomCurrentStr(text)):(count.current++,mode.current=Modes_APPEAR,text=randomStr(count.current))}updateDOM(text),lastFrame.current=now,mode.current!==Modes_STOP?req.current=requestAnimationFrame(update):mode.current===Modes_STOP&&isLoop&&(timeout.current&&clearTimeout(timeout.current),timeout.current=setTimeout((()=>{mode.current=Modes_DISAPPEAR,req.current=requestAnimationFrame(update)}),delayLoop))}),[isLoop,delayLoop,delayLetter,randomStr,randomCurrentStr,updateDOM]);return(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>{if(timeout.current&&clearTimeout(timeout.current),!isDisabled){const old=displayMessage.current;let nextMode=Modes_STOP;0===old.length&&message.length>0?(nextMode=Modes_APPEAR,count.current=0):old.length>0&&message.length>0?(nextMode=Modes_DISAPPEAR,count.current=old.length):nextMode=Modes_STOP,req.current&&cancelAnimationFrame(req.current),nextMode!==Modes_STOP&&(fromMessage.current=old,toMessage.current=message,lastFrame.current=Date.now(),mode.current=nextMode,req.current=requestAnimationFrame(update))}return()=>{req.current&&cancelAnimationFrame(req.current)}}),[message,isDisabled,update]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>(timeout.current&&clearTimeout(timeout.current),isLoop&&(timeout.current=setTimeout((()=>{mode.current=Modes_DISAPPEAR,req.current=requestAnimationFrame(update)}),delayLoop)),()=>{timeout.current&&clearTimeout(timeout.current)})),[isLoop,delayLoop,update]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>()=>{req.current&&cancelAnimationFrame(req.current),timeout.current&&clearTimeout(timeout.current)}),[]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>{if(trigger>0&&!isDisabled){const now=Date.now();if(now-lastTriggerTime.current<triggerDebounce)return;lastTriggerTime.current=now,req.current&&cancelAnimationFrame(req.current),timeout.current&&clearTimeout(timeout.current),count.current=displayMessage.current.length,fromMessage.current=displayMessage.current,toMessage.current=message,mode.current=Modes_DISAPPEAR,lastFrame.current=now,req.current=requestAnimationFrame(update)}}),[trigger]),(0,react__WEBPACK_IMPORTED_MODULE_1__.useEffect)((()=>{updateDOM(firstMessage)}),[firstMessage,updateDOM]),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)(Wrap,{className,$isVertical:isVertical,$isCenter:isCenter,children:[(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Hidden,{$isVisible:isDisabled,children:message.split("").map(((letter,index)=>{const key=`${message}${letter}${index}`;return(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span",{children:" "===letter?"_":letter},key)}))}),(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Anim,{ref:animRef})]})},__WEBPACK_DEFAULT_EXPORT__=TypingMessage;TypingMessage.__docgenInfo={description:"",methods:[],displayName:"TypingMessage",props:{message:{defaultValue:{value:'""',computed:!1},required:!1},isDisabled:{defaultValue:{value:"false",computed:!1},required:!1},isVertical:{defaultValue:{value:"false",computed:!1},required:!1},isCenter:{defaultValue:{value:"false",computed:!1},required:!1},firstMessage:{defaultValue:{value:'""',computed:!1},required:!1},isLoop:{defaultValue:{value:"false",computed:!1},required:!1},delayLoop:{defaultValue:{value:"5000",computed:!1},required:!1},delayLetter:{defaultValue:{value:"100",computed:!1},required:!1},trigger:{defaultValue:{value:"0",computed:!1},required:!1},triggerDebounce:{defaultValue:{value:"500",computed:!1},required:!1}}}},"./src/components/stories/ProjectHeader.stories.jsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>ProjectHeader_stories});var _path,_path2,_path3,jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js"),react=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}var TagsList=__webpack_require__("./src/components/TagsList.jsx"),TypingMessage=__webpack_require__("./src/components/TypingMessage.jsx");const WrapContent=styled_components_browser_esm.Ay.div`
  margin: 0 auto;
  max-width: 800px;
`,WrapTexte=styled_components_browser_esm.Ay.div`
  margin-top: 6em;
`,Description=styled_components_browser_esm.Ay.div`
  color: ${p=>p.theme.light};
  width: 100%;
  padding: 10px;

  ${p=>p.theme.media.tablet`
    width: 100%;
  `};
`,Text=styled_components_browser_esm.Ay.p`
  margin: 10px 0;
  width: 100%;
`,ProjectHeader_Date=styled_components_browser_esm.Ay.p.attrs({className:"numbers"})`
  text-align: left;
  margin: 0;
  padding: 0.4em 10px 0;
  color: ${p=>p.theme.getColor};
  ${p=>p.theme.monospace}
`,StyledTitle=styled_components_browser_esm.Ay.h1`
  ${p=>p.theme.title}
  position: relative;
  margin: 0;
  padding: 0 10px;

  & > span > span > span {
    ${p=>p.theme.primaryGradientText}
  }
`,StyledTypingMessage=(0,styled_components_browser_esm.Ay)(TypingMessage.A)``,Bar=styled_components_browser_esm.Ay.div`
  width: 100%;
  height: 1px;
  margin: 0;
  background: ${p=>p.theme.getGradient};
`,StyledTagsList=(0,styled_components_browser_esm.Ay)(TagsList.A)`
  margin: 1.4em 0;
`,A=styled_components_browser_esm.Ay.a`
  color: ${p=>p.theme.getColor};
`,LinkIcon=(0,styled_components_browser_esm.Ay)((props=>react.createElement("svg",_extends({fill:"currentColor",viewBox:"0 0 26.458 26.458",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em"},props),_path||(_path=react.createElement("path",{d:"m13.229 2.6458h10.583v10.583"})),_path2||(_path2=react.createElement("path",{d:"m19.844 6.6146-10.583 10.583"})),_path3||(_path3=react.createElement("path",{d:"m9.2604 7.9375h-3.9688l-2.6458 2.6458v10.583l2.6458 2.6458h11.906l2.6458-2.6458v-2.6458"})))))`
  stroke: ${p=>p.theme.getColor};
  fill: none;
  width: 1em;
  height: 1em;
  margin-left: 0.5em;
  transform: translateY(1px);
`,ProjectHeader=({title,inverseTitle,descriptions,tags,date,links,textSite,$colorType})=>(0,jsx_runtime.jsx)(WrapContent,{children:(0,jsx_runtime.jsxs)(WrapTexte,{children:[date&&(0,jsx_runtime.jsx)(ProjectHeader_Date,{$colorType,children:date}),title&&(0,jsx_runtime.jsx)(StyledTitle,{$colorType,children:(0,jsx_runtime.jsx)(StyledTypingMessage,{message:title})}),descriptions||tags||link?(0,jsx_runtime.jsxs)(jsx_runtime.Fragment,{children:[(0,jsx_runtime.jsx)(Bar,{$colorType}),(0,jsx_runtime.jsxs)(Description,{children:[descriptions?.map((text=>(0,jsx_runtime.jsx)(Text,{children:text},text))),tags?.length?(0,jsx_runtime.jsx)(StyledTagsList,{tags}):null,links?links.map((link1=>(0,jsx_runtime.jsxs)(A,{href:link1.url,target:"_blank",rel:"noreferrer",$colorType,children:[link1.label,(0,jsx_runtime.jsx)(LinkIcon,{$colorType})]},link1.url))):null]})]}):null]})}),components_ProjectHeader=ProjectHeader;ProjectHeader.__docgenInfo={description:"",methods:[],displayName:"ProjectHeader"};const ProjectHeader_stories={title:"Components/ProjectHeader",component:components_ProjectHeader},Primary=(args=>(0,jsx_runtime.jsx)(components_ProjectHeader,{...args})).bind({});Primary.args={title:"Title",inverseTitle:"Invert title",descriptions:["Hello c'est un project.","Avec plusieurs descriptions  "],date:2e3};const __namedExportsOrder=["Primary"];Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:"args => <ProjectHeader {...args} />",...Primary.parameters?.docs?.source}}}},"./src/utils/index.js"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{G7:()=>getColorType,uS:()=>getTeaserPath,wR:()=>timeout});const Locales=Object.freeze({FR:"fr",EN:"en",JP:"jp"}),getEnvPath=(Locales.FR,Locales.EN,Locales.JP,path=>`${{NODE_ENV:"production",NODE_PATH:[],STORYBOOK:"true",PUBLIC_URL:"."}.ASSET_PATH}${path}`),getTeaserPath=slug=>getEnvPath(`/img/teasers/${slug}.png`),getColorType=category=>{switch(category){case 1:return 0;case 2:return 2;default:return 1}},timeout=ms=>new Promise((resolve=>{setTimeout(resolve,ms)}))}}]);
//# sourceMappingURL=ProjectHeader-stories.f8d74ed8.iframe.bundle.js.map