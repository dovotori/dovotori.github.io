"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[9383,552],{69383:(n,e,t)=>{t.r(e),t.d(e,{default:()=>o});var a=t(20552);const o={vertex:"\nattribute float value;\nattribute float index;\nuniform mat4 projection;\nuniform mat4 model;\nuniform mat4 view;\nuniform int maxfrequency;\nuniform int length;\n\n".concat(a.funcMap,"\n").concat(a.PI,"\n\n#define SIZE 3.0\n\nvarying vec3 color;\n\nvoid main() {\n  gl_PointSize = 1.5;\n\n  float normalizeValue = value / float(maxfrequency);\n\n  float y = funcMap(normalizeValue, 0.0, 1.0, 0.0, 1.0);\n  \n  float square = sqrt(float(length));\n  float modulo = mod(index, square);\n  float row = floor(index / square);\n  float x = funcMap(modulo, 0.0, square, -SIZE, SIZE);\n  float z = funcMap(row, 0.0, square, -SIZE, SIZE);\n\n  vec3 position = vec3(x, y, z);\n  color = vec3(1.0 - y, 0.7, 0.9);\n  gl_Position = projection * view * model * vec4(position, 1.0);\n}\n"),fragment:"\nprecision mediump float;\n\nvarying vec3 color;\n\nvoid main() {\n  gl_FragColor = vec4(color, 1.0);\n}\n",attributes:["value","index"],uniforms:["projection","model","view","length","maxfrequency"]}},20552:(n,e,t)=>{t.r(e),t.d(e,{PI:()=>a,TWO_PI:()=>o,attributeColors:()=>r,funcGradiant:()=>u,funcGrain:()=>f,funcMap:()=>l,varyingColors:()=>i});var a="\n#define PI 3.14159265359\n",o="\n#define TWO_PI 6.28318530718\n",r="\nattribute vec3 ambiant;\nattribute vec3 diffuse;\nattribute vec3 specular;\nattribute float specDensity;\nattribute float opacity;\n",i="\nvarying vec3 fragAmbiant;\nvarying vec3 fragDiffuse;\nvarying vec3 fragSpecular;\nvarying float fragSpecDensity;\nvarying float fragOpacity;\n",l="\nfloat funcMap(float valeur, float minRef, float maxRef, float minDest, float maxDest) {\n  float result = minDest + (valeur - minRef) * (maxDest - minDest) / (maxRef - minRef);\n  if(result > maxDest){ result = maxDest; } else if(result < minDest){ result = minDest; }\n  return result;\n}\n",f="\nvec4 funcGrain(vec2 uv, float time, float strength) {\n  float x = (uv.x + 4.0 ) * (uv.y + 4.0 ) * (time * 10.0);\n  return vec4(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.005) * strength;\n}\n",u="\n".concat(l,"\nvec4 funcGradiant(vec4 color1, vec4 color2, float start, float end, float uvAxe) {\n  float mixValue = funcMap(uvAxe, start, end, 0.0, 1.0);\n  return mix(color1, color2, mixValue);\n}\n")}}]);