"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[9904],{99904:(n,t,i)=>{i.r(t),i.d(t,{default:()=>o});const o={vertex:"\nattribute vec3 position;\nattribute vec4 joint;\nattribute vec4 weight;\n\nuniform mat4 projection;\nuniform mat4 model;\nuniform mat4 view;\nuniform mat4 jointMat[".concat(4,"];\n\nvarying vec3 color;\n\nvoid main() {\n  mat4 skinMat =\n    weight.x * jointMat[int(joint.x)] +\n    weight.y * jointMat[int(joint.y)] +\n    weight.z * jointMat[int(joint.z)] +\n    weight.w * jointMat[int(joint.w)];\n  color = (weight).xyz;\n  gl_Position = projection * view * model * skinMat * vec4(position, 1.0);\n}\n"),fragment:"\nprecision mediump float;\nvarying vec3 color;\n\nvoid main() {\n  gl_FragColor = vec4(color, 1.0);\n}\n",attributes:["position","joint","weight"],uniforms:["projection","model","view"].concat(function(){for(var n=[],t=0;t<4;t++)n.push("jointMat[".concat(t,"]"));return n}())}}}]);