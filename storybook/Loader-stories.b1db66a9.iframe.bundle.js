"use strict";(globalThis.webpackChunkdovotori=globalThis.webpackChunkdovotori||[]).push([[182],{"./src/components/Loader.tsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.d(__webpack_exports__,{A:()=>components_Loader});var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),react=__webpack_require__("./node_modules/react/index.js"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const blink=styled_components_browser_esm.i7`
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
`,CHARS=["/","-","\\","=","<",">","+","#"],Loader=({className})=>{const charsRef=(0,react.useRef)([]),streamRef=(0,react.useRef)(null);return(0,react.useEffect)((()=>{const interval=setInterval((()=>{const newChar=CHARS[Math.floor(Math.random()*CHARS.length)];charsRef.current=[newChar,...charsRef.current],charsRef.current.length>10&&(charsRef.current=charsRef.current.slice(0,10)),streamRef.current&&(streamRef.current.textContent=charsRef.current.join(""))}),100);return()=>clearInterval(interval)}),[]),(0,jsx_runtime.jsx)(Div,{className,children:(0,jsx_runtime.jsxs)(CharStream,{children:[(0,jsx_runtime.jsx)(Blink,{children:"_"}),(0,jsx_runtime.jsx)("span",{ref:streamRef})]})})},components_Loader=Loader;Loader.__docgenInfo={description:"",methods:[],displayName:"Loader",props:{className:{required:!1,tsType:{name:"string"},description:""}}}},"./src/components/stories/Loader.stories.jsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/jsx-runtime.js"),_Loader__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/Loader.tsx");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Loader",component:_Loader__WEBPACK_IMPORTED_MODULE_1__.A},Primary=(args=>(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(_Loader__WEBPACK_IMPORTED_MODULE_1__.A,{...args})).bind({});Primary.args={};const __namedExportsOrder=["Primary"];Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:"args => <Loader {...args} />",...Primary.parameters?.docs?.source}}}}}]);
//# sourceMappingURL=Loader-stories.b1db66a9.iframe.bundle.js.map