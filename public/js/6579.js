"use strict";(self.webpackChunkdovotori_portfolio=self.webpackChunkdovotori_portfolio||[]).push([[6579],{96579:(e,t,n)=>{n.r(t),n.d(t,{default:()=>o});const o={vertex:"\nattribute vec2 texture;\n\nuniform sampler2D textureMap;\n\nvoid main() {\n  vec3 particulePos = texture2D(textureMap, texture).xyz;\n  vec3 position = (particulePos * vec3(2.0)) - vec3(1.0);\n  gl_PointSize = 2.0;\n  gl_Position = vec4(position, 1.0);\n}\n",fragment:"\nprecision mediump float;\n\nvoid main() {\n  gl_FragColor = vec4(1.0);\n}\n",attributes:["texture"],uniforms:["textureMap"]}}}]);