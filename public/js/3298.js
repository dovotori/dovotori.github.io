"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[3298,7719],{57719:(e,t,n)=>{n.r(t),n.d(t,{default:()=>r});const r="\nattribute vec3 position;\nattribute vec2 texture;\nvarying vec2 fragTexture;\nuniform float flipY; // 1 ou -1\n\nvoid main() {\n  fragTexture = texture;\n  gl_Position = vec4(position.x, position.y * flipY, position.z, 1.0);\n}\n"},43298:(e,t,n)=>{n.r(t),n.d(t,{default:()=>r});const r={vertex:n(57719).default,fragment:"\nprecision mediump float;\n\nuniform sampler2D textureMap;\nuniform sampler2D heightMap;\n\nuniform float gradientStep;\nuniform float advectStep;\nuniform float flipHeightMap;\nuniform float time;\n\nvarying vec2 fragTexture;\n\nvoid main() {\n  vec4 advectMatrix = vec4(0.1);\n  vec4 cxp = texture2D(\n    heightMap, vec2(fragTexture.x + gradientStep, flipHeightMap * fragTexture.y));\n  vec4 cxn = texture2D(\n    heightMap, vec2(fragTexture.x - gradientStep, flipHeightMap * fragTexture.y));\n  vec4 cyp = texture2D(\n    heightMap, vec2(fragTexture.x, flipHeightMap*(fragTexture.y + gradientStep)));\n  vec4 cyn = texture2D(\n    heightMap, vec2(fragTexture.x, flipHeightMap*(fragTexture.y - gradientStep)));\n\n  vec3 grey = vec3(.3, .59, .11);\n  float axp = dot(grey, cxp.xyz);\n  float axn = dot(grey, cxn.xyz);\n  float ayp = dot(grey, cyp.xyz);\n  float ayn = dot(grey, cyn.xyz);\n\n  vec2 grad = vec2(axp - axn, ayp - ayn);\n  vec2 newTexCoor = fragTexture + advectStep * normalize(advectMatrix.xy * grad) * time;\n\n  vec4 color = texture2D(textureMap, fragTexture);\n  vec3 final = texture2D(textureMap, newTexCoor).rgb * color.rgb;\n  gl_FragColor = vec4(final, color.a);\n}\n",attributes:["position","texture"],uniforms:["flipY","textureMap","heightMap","gradientStep","advectStep","time","flipHeightMap"]}}}]);