"use strict";(self.webpackChunkdovotori_portfolio=self.webpackChunkdovotori_portfolio||[]).push([[4365],{4365:(e,t,n)=>{n.r(t),n.d(t,{default:()=>r});const r={vertex:"\nattribute vec3 position;\nattribute vec2 texture;\n\nvarying vec2 fragTexture;\n\nvoid main() {\n  fragTexture = texture;\n  gl_Position = vec4(position, 1.0);\n}\n",fragment:"\nprecision mediump float;\n\nvarying vec2 fragTexture;\nuniform sampler2D textureMap;\n\nvoid main() {\n  gl_FragColor = texture2D(textureMap, fragTexture);\n}\n",attributes:["position","texture"],uniforms:["textureMap"]}}}]);