"use strict";(self.webpackChunkdovotori_portfolio=self.webpackChunkdovotori_portfolio||[]).push([[8919,7719],{57719:(e,t,r)=>{r.r(t),r.d(t,{default:()=>n});const n="\nattribute vec3 position;\nattribute vec2 texture;\nvarying vec2 fragTexture;\nuniform float flipY; // 1 ou -1\n\nvoid main() {\n  fragTexture = texture;\n  gl_Position = vec4(position.x, position.y * flipY, position.z, 1.0);\n}\n"},58919:(e,t,r)=>{r.r(t),r.d(t,{default:()=>n});const n={vertex:r(57719).default,fragment:"\nprecision mediump float;\nvarying vec2 fragTexture;\nuniform sampler2D textureMap;\nuniform vec2 delta;\nuniform vec2 resolution;\nuniform vec2 center;\nvoid main() {\n  vec2 dir = fragTexture - center;\n  vec2 value = dir * delta;\n\tvec4 c1 = texture2D(textureMap, fragTexture - value / resolution.x);\n\tvec4 c2 = texture2D(textureMap, fragTexture);\n\tvec4 c3 = texture2D(textureMap, fragTexture + value / resolution.y);\n\n  float alpha = c2.a;\n  gl_FragColor = vec4(c1.r, c2.g, c3.b, alpha);\n}\n",attributes:["position","texture"],uniforms:["flipY","textureMap","delta","resolution","center"]}}}]);