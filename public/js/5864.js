"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[5864],{65864:(i,e,n)=>{n.r(e),n.d(e,{default:()=>o});const o={vertex:"\nattribute vec3 position;\nattribute vec3 emissive;\nuniform mat4 projection;\nuniform mat4 model;\nuniform mat4 view;\nvarying vec3 fragEmissive;\n\nvoid main() {\n  fragEmissive = emissive;\n  gl_Position = projection * view * model * vec4(position, 1.0);\n}\n",fragment:"\nprecision mediump float;\nvarying vec3 fragEmissive;\n\nvoid main() {\n  float opacity = (fragEmissive.x + fragEmissive.y + fragEmissive.z) / 3.0;\n  if (opacity == 0.0) {\n    gl_FragColor = vec4(0.0);\n  } else {\n    gl_FragColor = vec4(fragEmissive, 1.0);\n  }\n}\n",attributes:["position","emissive"],uniforms:["projection","model","view"]}}}]);