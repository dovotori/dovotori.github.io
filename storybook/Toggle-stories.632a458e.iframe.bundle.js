"use strict";(globalThis.webpackChunkdovotori=globalThis.webpackChunkdovotori||[]).push([[131],{"./src/components/stories/Toggle.stories.tsx"(__unused_webpack_module,__webpack_exports__,__webpack_require__){__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Primary:()=>Primary,__namedExportsOrder:()=>__namedExportsOrder,default:()=>Toggle_stories});var jsx_runtime=__webpack_require__("./node_modules/react/jsx-runtime.js"),react=__webpack_require__("./node_modules/react/index.js"),styled_components_browser_esm=__webpack_require__("./node_modules/styled-components/dist/styled-components.browser.esm.js");const CheckBoxWrapper=styled_components_browser_esm.Ay.div`
  position: relative;
  display: flex;
  align-items: center;
  cursor: pointer;
`,Label=styled_components_browser_esm.Ay.span`
  white-space: nowrap;
  margin-left: 1em;
  cursor: pointer;
  text-transform: uppercase;
  ${p=>p.theme.monospace}
  font-weight: normal;
`,HideInput=styled_components_browser_esm.Ay.input`
  opacity: 0;
  z-index: 0;
  width: ${60}px;
  height: ${30}px;
`,ToggleTrack=styled_components_browser_esm.Ay.label`
  cursor: pointer;
`,Background=styled_components_browser_esm.Ay.div`
  position: absolute;
  z-index: 0;
  opacity: 1;
  top: 0;
  left: 0;
  width: ${60}px;
  height: ${30}px;
  border-radius: ${15}px;
  background: ${p=>p.theme.backgroundSubtleGradient};
  transition: background-color 0.2s;
`,Circle=styled_components_browser_esm.Ay.div`
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  display: block;
  border-radius: 50%;
  width: ${30}px;
  height: ${30}px;
  background-color: ${p=>p.theme.primary};
  margin-left: ${p=>p.checked?30:0}px;
  transition:
    background-color 0.2s,
    margin-left 0.2s;
`,Toggle=({onClick,checked,className,label,id,name})=>(0,jsx_runtime.jsxs)(CheckBoxWrapper,{className,children:[(0,jsx_runtime.jsx)(HideInput,{id,name:name||id,type:"checkbox",checked,onChange:onClick}),(0,jsx_runtime.jsxs)(ToggleTrack,{htmlFor:id,children:[(0,jsx_runtime.jsx)(Background,{}),(0,jsx_runtime.jsx)(Circle,{checked}),(0,jsx_runtime.jsx)(Label,{children:label})]})]}),components_Toggle=Toggle;Toggle.__docgenInfo={description:"",methods:[],displayName:"Toggle",props:{onClick:{required:!0,tsType:{name:"signature",type:"function",raw:"() => void",signature:{arguments:[],return:{name:"void"}}},description:""},checked:{required:!0,tsType:{name:"boolean"},description:""},className:{required:!1,tsType:{name:"string"},description:""},label:{required:!0,tsType:{name:"string"},description:""},id:{required:!0,tsType:{name:"string"},description:""},name:{required:!1,tsType:{name:"string"},description:""}}};const Toggle_stories={title:"Components/Toggle",component:components_Toggle},Primary=(()=>{const[isChecked,setIsChecked]=(0,react.useState)(!1);return(0,jsx_runtime.jsx)(components_Toggle,{checked:isChecked,onClick:()=>setIsChecked(!isChecked),label:"Toggle Label",id:"toggle"})}).bind({}),__namedExportsOrder=["Primary"];Primary.parameters={...Primary.parameters,docs:{...Primary.parameters?.docs,source:{originalSource:'() => {\n  const [isChecked, setIsChecked] = useState(false);\n  return <Toggle checked={isChecked} onClick={() => setIsChecked(!isChecked)} label="Toggle Label" id="toggle" />;\n}',...Primary.parameters?.docs?.source}}}}}]);
//# sourceMappingURL=Toggle-stories.632a458e.iframe.bundle.js.map