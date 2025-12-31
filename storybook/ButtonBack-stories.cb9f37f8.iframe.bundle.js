"use strict";(globalThis.webpackChunkdovotori=globalThis.webpackChunkdovotori||[]).push([[754],{"./src/components/stories/ButtonBack.stories.jsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>ButtonBack_stories});var _path,jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),react=__webpack_require__("./node_modules/react/index.js");function _extends(){return _extends=Object.assign?Object.assign.bind():function(n){for(var e=1;e<arguments.length;e++){var t=arguments[e];for(var r in t)({}).hasOwnProperty.call(t,r)&&(n[r]=t[r])}return n},_extends.apply(null,arguments)}var chunk_JMJ3UQ3L=__webpack_require__("./node_modules/react-router/dist/development/chunk-JMJ3UQ3L.mjs"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const hooks_useHover=()=>{const[value,setValue]=(0,react.useState)(!1),ref=(0,react.useRef)(null),handleMouseOver=(0,react.useCallback)((()=>setValue(!0)),[]),handleMouseOut=(0,react.useCallback)((()=>setValue(!1)),[]);return(0,react.useEffect)((()=>{const node=ref.current;return node?(node.addEventListener("mouseover",handleMouseOver),node.addEventListener("mouseout",handleMouseOut),()=>{node.removeEventListener("mouseover",handleMouseOver),node.removeEventListener("mouseout",handleMouseOut)}):null}),[handleMouseOver,handleMouseOut]),[ref,value]},moveLeft=styled_components_browser_esm.i7`
  0% {
    transform: translateX(100px);
    opacity: 0;
  }
  100% {
    transform: none;
    opacity: 1;
  }
`,LINK=(0,styled_components_browser_esm.Ay)(chunk_JMJ3UQ3L.N_)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 2em auto;
  padding: 0.5em;
  min-height: 40px;
  border: solid 1px ${p=>p.theme.getColor};
  box-shadow: 2px 2px 0 ${p=>p.theme.getColor};
  max-width: 400px;
  -webkit-tap-highlight-color: ${p=>p.theme.getColor};
  overflow: hidden;

  ${p=>p.theme.active}

  background: ${p=>p.$isFocus?p.theme.softGradient:"transparent"};
`,ArrowsContainer=styled_components_browser_esm.Ay.div`
  position: relative;
  width: 100%;
  display: flex;
  align-items: center;
`,AnimatedArrow=(0,styled_components_browser_esm.Ay)((props=>react.createElement("svg",_extends({fill:"currentColor",viewBox:"0 0 6 10",xmlns:"http://www.w3.org/2000/svg",width:"1em",height:"1em"},props),_path||(_path=react.createElement("path",{d:"m0 5 5-5 1 1-3 4 3 4-1 1z"})))))`
  position: absolute;
  fill: ${p=>p.theme.getColor};
  height: 0.6em;
  opacity: 0;
  margin-left: ${p=>.1*p.$delay}px;
  
  ${p=>p.$isAnimating&&styled_components_browser_esm.AH`
      animation: ${moveLeft} 400ms ease-in-out forwards;
      animation-delay: ${p=>p.$delay}ms;
    `}
`,Span=styled_components_browser_esm.Ay.span`
  width: 100%;
  color: ${p=>p.theme.getColor};
  ${p=>p.theme.monospace}
  font-size: 0.8em;
  letter-spacing: 0.5em;
  text-align: right;
`,ARROW_DELAYS=[0,100,200,300,400],ButtonBack=({to,className,$colorType,label})=>{const[hoverRef,isHovered]=hooks_useHover();return(0,jsx_runtime.jsxs)(LINK,{to:to||"/",className,$isFocus:isHovered,$colorType,ref:hoverRef,children:[(0,jsx_runtime.jsx)(ArrowsContainer,{children:isHovered&&ARROW_DELAYS.map((delay=>(0,jsx_runtime.jsx)(AnimatedArrow,{$colorType,$isAnimating:isHovered,$delay:delay},delay)))}),(0,jsx_runtime.jsx)(Span,{$colorType,children:label})]})},components_ButtonBack=ButtonBack;ButtonBack.__docgenInfo={description:"",methods:[],displayName:"ButtonBack"};const ButtonBack_stories={title:"Components/ButtonBack",component:components_ButtonBack},Primary=(args=>(0,jsx_runtime.jsx)(components_ButtonBack,{...args})).bind({});Primary.args={label:"Back"};const __namedExportsOrder=["Primary"];Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:"args => <ButtonBack {...args} />",...Primary.parameters?.docs?.source}}}}}]);
//# sourceMappingURL=ButtonBack-stories.cb9f37f8.iframe.bundle.js.map