"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[2362],{32362:(n,e,a)=>{a.r(e),a.d(e,{funcRand:()=>t,funcRandFloat:()=>r,funcRandRange:()=>o,randRGBA:()=>c});var t="\n// between 0 - 1\nfloat rand(vec2 n) {\n  return fract(sin(dot(n.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n",o="\n".concat(t,"\nfloat randomRange(vec2 seed, float min, float max) {\n\treturn min + rand(seed) * (max - min);\n}\n"),r="\nfloat randFloat(float n){ return fract(sin(n) * 43758.5453123); }\n",c="\n#define PHI 1.61803398874989484820459\n\nfloat goldNoise(vec2 xy, float seed) {\n  return fract(tan(distance(xy * PHI, xy) * seed) * xy.x);\n}\n\nvec4 randRGBA (vec2 nn, float time) {\n  vec2 n = nn; \n  return vec4(\n    goldNoise(n, fract(time) + 1.0), // r\n    goldNoise(n, fract(time) + 2.0), // g\n    goldNoise(n, fract(time) + 3.0), // b\n    1.0);\n}\n"}}]);