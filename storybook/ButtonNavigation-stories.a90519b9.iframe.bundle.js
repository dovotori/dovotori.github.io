"use strict";(globalThis.webpackChunkdovotori=globalThis.webpackChunkdovotori||[]).push([[649],{"./src/components/stories/ButtonNavigation.stories.jsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>ButtonNavigation_stories});var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),chunk_JMJ3UQ3L=__webpack_require__("./node_modules/react-router/dist/development/chunk-JMJ3UQ3L.mjs"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const StyledLink=(0,styled_components_browser_esm.Ay)(chunk_JMJ3UQ3L.N_)`
  position: relative;
  width: 100%;
  padding: 1.5em 0 1.5em 2%;
  color: ${p=>p.theme.light};
  ${p=>p.theme.active};
  padding: 0.5em;
  min-height: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow-wrap: break-word;
  overflow: hidden;

  background-color: none;
  transition:
    background-color 1000ms ease-out,
    color 1000ms ease-out;

  &:focus {
    color: ${p=>p.theme.getColor};
  }

  &:hover {
    color: ${p=>p.theme.getColor};
    background-color: ${p=>p.theme.backgroundHighlight};

    span {
      opacity: 1;
    }
  }
  ${p=>p.theme.media.mobile`
    justify-content: center;
  `}
`,Span=styled_components_browser_esm.Ay.span`
  transition: opacity 1000ms ease-out;
  opacity: 0;
  margin: 0 0 0 1em;
  ${p=>p.theme.monospace}
  ${p=>p.theme.media.mobile`
    display: none;
  `}
`,ButtonNavigation=({children,className,to,$colorType,label})=>(0,jsx_runtime.jsxs)(StyledLink,{className,$colorType,to,children:[children,(0,jsx_runtime.jsx)(Span,{children:label})]}),components_ButtonNavigation=ButtonNavigation;ButtonNavigation.__docgenInfo={description:"",methods:[],displayName:"ButtonNavigation"};const ButtonNavigation_stories={title:"Components/ButtonNavigation",component:components_ButtonNavigation},Primary=(args=>(0,jsx_runtime.jsx)(components_ButtonNavigation,{...args,children:"Custom"})).bind({});Primary.args={label:"Back"};const __namedExportsOrder=["Primary"];Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:"args => <ButtonNavigation {...args}>Custom</ButtonNavigation>",...Primary.parameters?.docs?.source}}}}}]);
//# sourceMappingURL=ButtonNavigation-stories.a90519b9.iframe.bundle.js.map