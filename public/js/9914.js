"use strict";(self.webpackChunkdovotori_portfolio=self.webpackChunkdovotori_portfolio||[]).push([[9914,7719,2362],{57719:(n,e,t)=>{t.r(e),t.d(e,{default:()=>o});const o="\nattribute vec3 position;\nattribute vec2 texture;\nvarying vec2 fragTexture;\nuniform float flipY; // 1 ou -1\n\nvoid main() {\n  fragTexture = texture;\n  gl_Position = vec4(position.x, position.y * flipY, position.z, 1.0);\n}\n"},59914:(n,e,t)=>{t.r(e),t.d(e,{default:()=>r});var o=t(57719),a=t(32362),f="\nprecision mediump float;\n\nuniform sampler2D textureMap;\nuniform float time;\nuniform float delta; // 0 - 1 glitch amount\nuniform float speed; // 0 - 1 speed\nvarying vec2 fragTexture;\n\n".concat(a.funcRandRange,"\n\n// return 1 if v inside 1d range\nfloat insideRange(float v, float bottom, float top) {\n  return step(bottom, v) - step(top, v);\n}\n   \nvec4 applyGlitch(sampler2D tex, vec2 uv, float speed, float AMT) {\n  float time = floor(time * speed * 60.0);    \n  vec4 outCol = texture2D(tex, uv);\n    \n  // randomly offset slices horizontally\n  float maxOffset = AMT / 2.0;\n  const float LIMIT =  2.0;\n  for (float i = 0.0; i < LIMIT; i += 1.0) {\n    float sliceY = rand(vec2(time , 2345.0 + float(i)));\n    float sliceH = rand(vec2(time , 9035.0 + float(i))) * 0.25;\n    float hOffset = randomRange(vec2(time , 9625.0 + float(i)), -maxOffset, maxOffset);\n    vec2 uvOff = uv;\n    uvOff.x += hOffset;\n    if (insideRange(uv.y, sliceY, fract(sliceY+sliceH)) == 1.0 ){\n      outCol = texture2D(tex, uvOff);\n    }\n  }\n    \n  // do slight offset on one entire channel\n  float maxColOffset = AMT / 6.0;\n  float rnd = rand(vec2(time , 9545.0));\n  vec2 colOffset = vec2(randomRange(vec2(time , 9545.0), -maxColOffset,maxColOffset), \n                      randomRange(vec2(time , 7205.0), -maxColOffset,maxColOffset));\n  if (rnd < 0.33) {\n    outCol.r = texture2D(tex, uv + colOffset).r;  \n  } else if (rnd < 0.66){\n    outCol.g = texture2D(tex, uv + colOffset).g;  \n  } else {\n    outCol.b = texture2D(tex, uv + colOffset).b;  \n  }\n\n\treturn vec4(outCol);\n}\n\nvoid main() {\n\tgl_FragColor = applyGlitch(textureMap, fragTexture, speed, delta);\n}\n");const r={vertex:o.default,fragment:f,attributes:["position","texture"],uniforms:["flipY","textureMap","time","delta","speed"]}},32362:(n,e,t)=>{t.r(e),t.d(e,{funcRand:()=>o,funcRandFloat:()=>f,funcRandRange:()=>a,randRGBA:()=>r});var o="\n// between 0 - 1\nfloat rand(vec2 n) {\n  return fract(sin(dot(n.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n",a="\n".concat(o,"\nfloat randomRange(vec2 seed, float min, float max) {\n\treturn min + rand(seed) * (max - min);\n}\n"),f="\nfloat randFloat(float n){ return fract(sin(n) * 43758.5453123); }\n",r="\n#define PHI 1.61803398874989484820459\n\nfloat goldNoise(vec2 xy, float seed) {\n  return fract(tan(distance(xy * PHI, xy) * seed) * xy.x);\n}\n\nvec4 randRGBA (vec2 nn, float time) {\n  vec2 n = nn; \n  return vec4(\n    goldNoise(n, fract(time) + 1.0), // r\n    goldNoise(n, fract(time) + 2.0), // g\n    goldNoise(n, fract(time) + 3.0), // b\n    1.0);\n}\n"}}]);