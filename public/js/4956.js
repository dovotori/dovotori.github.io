"use strict";(self.webpackChunkdovotori_portfolio=self.webpackChunkdovotori_portfolio||[]).push([[4956],{44956:(n,o,a)=>{a.r(o),a.d(o,{fragment:()=>t,funcShadow:()=>r,shadowLocations:()=>i,uniformFragShadow:()=>s,uniformVertShadow:()=>e});var e="\nuniform mat4 shadowView;\nuniform mat4 shadowProjection;\n\nconst mat4 bias = mat4(\n  0.5, 0.0, 0.0, 0.0,\n  0.0, 0.5, 0.0, 0.0,\n  0.0, 0.0, 0.5, 0.0,\n  0.5, 0.5, 0.5, 1.0\n);\n",r="\nfloat funcShadow(\n  vec4 pos, \n  vec2 resolution, \n  float lambertCosinus\n) {\n  if (pos.z > 1.0) {\n    return 1.0; // outside light frustum, ignore\n  }\n\n  float bias = max(shadowEpsilon * (1.0 - lambertCosinus), shadowEpsilon * 0.01);\n  vec2 texelSize = 1.0 / resolution;\n\n  // PCF (percentage closer filter)\n  float shadow = 0.0;\n  for(float y = -1.0; y <= 1.0; y += 1.0) {\n    for(float x = -1.0; x <= 1.0; x += 1.0) {\n      float depth = texture2D(shadowMap, pos.xy + vec2(x,y) * texelSize).r;\n      shadow += (depth + bias) < pos.z ? 0.0 : 1.0;\n    } \n  }\n  shadow /= 9.0;\n  return (shadow * lambertCosinus) + lighten;\n}\n",s="\nuniform sampler2D shadowMap;\nuniform float shadowEpsilon;\nuniform float lighten;\nuniform vec3 posLum;\n",i=["shadowView","shadowProjection","shadowMap","lighten","shadowEpsilon","posLum"],t="\nprecision mediump float;\n\n".concat(s,"\n\nuniform vec2 resolution;\n\nvarying vec3 fragPosition;\nvarying vec4 fragShadow;\nvarying vec3 fragNormale;\n\n").concat(r,"\n\nvoid main() {\n  vec3 N = normalize(fragNormale);\n  vec3 L = normalize(posLum - fragPosition);\n  float lambertCosinus = max(dot(N, L), 0.0);\n  \n  float shadow = funcShadow(fragShadow, resolution, lambertCosinus);\n  gl_FragColor = vec4(vec3(shadow), 1.0);\n}\n")}}]);