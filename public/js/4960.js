"use strict";(self.webpackChunkdovotori_portfolio=self.webpackChunkdovotori_portfolio||[]).push([[4960,552,6215,2362],{20552:(n,t,e)=>{e.r(t),e.d(t,{PI:()=>o,TWO_PI:()=>a,attributeColors:()=>c,funcGradiant:()=>l,funcGrain:()=>s,funcMap:()=>i,varyingColors:()=>r});var o="\n#define PI 3.14159265359\n",a="\n#define TWO_PI 6.28318530718\n",c="\nattribute vec3 ambiant;\nattribute vec3 diffuse;\nattribute vec3 specular;\nattribute float specDensity;\nattribute float opacity;\n",r="\nvarying vec3 fragAmbiant;\nvarying vec3 fragDiffuse;\nvarying vec3 fragSpecular;\nvarying float fragSpecDensity;\nvarying float fragOpacity;\n",i="\nfloat funcMap(float valeur, float minRef, float maxRef, float minDest, float maxDest) {\n  float result = minDest + (valeur - minRef) * (maxDest - minDest) / (maxRef - minRef);\n  if(result > maxDest){ result = maxDest; } else if(result < minDest){ result = minDest; }\n  return result;\n}\n",s="\nvec4 funcGrain(vec2 uv, float time, float strength) {\n  float x = (uv.x + 4.0 ) * (uv.y + 4.0 ) * (time * 10.0);\n  return vec4(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.005) * strength;\n}\n",l="\n".concat(i,"\nvec4 funcGradiant(vec4 color1, vec4 color2, float start, float end, float uvAxe) {\n  float mixValue = funcMap(uvAxe, start, end, 0.0, 1.0);\n  return mix(color1, color2, mixValue);\n}\n")},96215:(n,t,e)=>{e.r(t),e.d(t,{anothorNoise1D:()=>s,anothorNoise2D:()=>l,funcNoise:()=>c,funcPnoise:()=>r,funcSnoise:()=>i});var o=e(32362),a=e(20552),c="\n".concat(o.funcRand,"\nfloat noise(vec2 n) {\n\tconst vec2 d = vec2(0.0, 1.0);\n  vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));\n\treturn mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);\n}\n"),r="\n".concat(a.PI,"\n").concat(o.funcRand,"\nfloat noise(vec2 p, float freq) {\n\tfloat unit = freq;\n\tvec2 ij = floor(p / unit);\n\tvec2 xy = mod(p, unit) / unit;\n\t//xy = 3. * xy * xy -2. * xy * xy * xy;\n\txy = .5 * (1. - cos(PI * xy));\n\tfloat a = rand((ij + vec2(0.,0.)));\n\tfloat b = rand((ij + vec2(1.,0.)));\n\tfloat c = rand((ij + vec2(0.,1.)));\n\tfloat d = rand((ij + vec2(1.,1.)));\n\tfloat x1 = mix(a, b, xy.x);\n\tfloat x2 = mix(c, d, xy.x);\n\treturn mix(x1, x2, xy.y);\n}\n\nfloat pnoise(vec2 p){\n\tfloat persistance = .5;\n\tfloat n = 0.;\n\tfloat normK = 0.;\n\tfloat f = 4.;\n\tfloat amp = 1.;\n\tint iCount = 0;\n\tfor (int i = 0; i<50; i++){\n\t\tn+=amp*noise(p, f);\n\t\tf*=2.;\n\t\tnormK+=amp;\n\t\tamp*=persistance;\n\t\tiCount++;\n\t}\n\tfloat nf = n/normK;\n\treturn nf*nf*nf*nf;\n}\n"),i="\n//\tSimplex 3D Noise \n//\tby Ian McEwan, Ashima Arts\n//\nvec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}\nvec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}\n\nfloat snoise(vec3 v){ \n  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;\n  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);\n\n// First corner\n  vec3 i  = floor(v + dot(v, C.yyy) );\n  vec3 x0 =   v - i + dot(i, C.xxx) ;\n\n// Other corners\n  vec3 g = step(x0.yzx, x0.xyz);\n  vec3 l = 1.0 - g;\n  vec3 i1 = min( g.xyz, l.zxy );\n  vec3 i2 = max( g.xyz, l.zxy );\n\n  //  x0 = x0 - 0. + 0.0 * C \n  vec3 x1 = x0 - i1 + 1.0 * C.xxx;\n  vec3 x2 = x0 - i2 + 2.0 * C.xxx;\n  vec3 x3 = x0 - 1. + 3.0 * C.xxx;\n\n// Permutations\n  i = mod(i, 289.0 ); \n  vec4 p = permute( permute( permute( \n             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))\n           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) \n           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));\n\n// Gradients\n// ( N*N points uniformly over a square, mapped onto an octahedron.)\n  float n_ = 1.0/7.0; // N=7\n  vec3  ns = n_ * D.wyz - D.xzx;\n\n  vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)\n\n  vec4 x_ = floor(j * ns.z);\n  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)\n\n  vec4 x = x_ *ns.x + ns.yyyy;\n  vec4 y = y_ *ns.x + ns.yyyy;\n  vec4 h = 1.0 - abs(x) - abs(y);\n\n  vec4 b0 = vec4( x.xy, y.xy );\n  vec4 b1 = vec4( x.zw, y.zw );\n\n  vec4 s0 = floor(b0)*2.0 + 1.0;\n  vec4 s1 = floor(b1)*2.0 + 1.0;\n  vec4 sh = -step(h, vec4(0.0));\n\n  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;\n  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;\n\n  vec3 p0 = vec3(a0.xy,h.x);\n  vec3 p1 = vec3(a0.zw,h.y);\n  vec3 p2 = vec3(a1.xy,h.z);\n  vec3 p3 = vec3(a1.zw,h.w);\n\n//Normalise gradients\n  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));\n  p0 *= norm.x;\n  p1 *= norm.y;\n  p2 *= norm.z;\n  p3 *= norm.w;\n\n// Mix final noise value\n  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);\n  m = m * m;\n  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), \n                                dot(p2,x2), dot(p3,x3) ) );\n}\n",s="\nfloat hash(float p) {\n  p = fract(p * 0.011);\n  p *= p + 7.5;\n  p *= p + p;\n  return fract(p);\n}\n\nfloat noise(float x) {\n  float i = floor(x);\n  float f = fract(x);\n  float u = f * f * (3.0 - 2.0 * f);\n  return mix(hash(i), hash(i + 1.0), u);\n}\n",l="\nfloat hash(vec2 p) {\n  vec3 p3 = fract(vec3(p.xyx) * 0.13);\n  p3 += dot(p3, p3.yzx + 3.333);\n  return fract((p3.x + p3.y) * p3.z);\n}\n\nfloat noise(vec2 x) {\n  vec2 i = floor(x);\n  vec2 f = fract(x);\n\n\t// Four corners in 2D of a tile\n\tfloat a = hash(i);\n  float b = hash(i + vec2(1.0, 0.0));\n  float c = hash(i + vec2(0.0, 1.0));\n  float d = hash(i + vec2(1.0, 1.0));\n\n  // Simple 2D lerp using smoothstep envelope between the values.\n\t// return vec3(mix(mix(a, b, smoothstep(0.0, 1.0, f.x)),\n\t//\t\t\tmix(c, d, smoothstep(0.0, 1.0, f.x)),\n\t//\t\t\tsmoothstep(0.0, 1.0, f.y)));\n\n\t// Same code, with the clamps in smoothstep and common subexpressions\n\t// optimized away.\n  vec2 u = f * f * (3.0 - 2.0 * f);\n\treturn mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;\n}\n"},32362:(n,t,e)=>{e.r(t),e.d(t,{funcRand:()=>o,funcRandFloat:()=>c,funcRandRange:()=>a,randRGBA:()=>r});var o="\n// between 0 - 1\nfloat rand(vec2 n) {\n  return fract(sin(dot(n.xy, vec2(12.9898, 78.233))) * 43758.5453);\n}\n",a="\n".concat(o,"\nfloat randomRange(vec2 seed, float min, float max) {\n\treturn min + rand(seed) * (max - min);\n}\n"),c="\nfloat randFloat(float n){ return fract(sin(n) * 43758.5453123); }\n",r="\n#define PHI 1.61803398874989484820459\n\nfloat goldNoise(vec2 xy, float seed) {\n  return fract(tan(distance(xy * PHI, xy) * seed) * xy.x);\n}\n\nvec4 randRGBA (vec2 nn, float time) {\n  vec2 n = nn; \n  return vec4(\n    goldNoise(n, fract(time) + 1.0), // r\n    goldNoise(n, fract(time) + 2.0), // g\n    goldNoise(n, fract(time) + 3.0), // b\n    1.0);\n}\n"},94960:(n,t,e)=>{e.r(t),e.d(t,{circle:()=>r,concentricCircles:()=>f,distanceField:()=>i,fluid:()=>v,planet:()=>x,polar:()=>s,polygon:()=>l,rect:()=>c});var o=e(20552),a=e(96215),c="\nfloat rect(vec2 uv, vec2 start, vec2 size) {\n  vec2 leftTop = step(start, uv);\n  // vec2 bottomRight = step(vec2(1.0 - (x + w), 1.0 - (y + h)), 1.0 - uv);\n  vec2 bottomRight = step(vec2(1.0) - (start + size), 1.0 - uv);\n  return leftTop.x * leftTop.y * bottomRight.x * bottomRight.y;\n}\n",r="\nfloat circle(vec2 uv , vec2 center, float radius){\n  vec2 dist = uv - center;\n\treturn 1.0 - smoothstep(\n    radius - (radius * 0.01), radius + (radius * 0.01), dot(dist, dist) * 4.0\n  );\n}",i="\nfloat distanceField(vec2 uv, float size, float distorsion) {\n  // Remap the space to -1. to 1.\n  vec2 st = uv * 2.0 - 1.0;\n\n  // Make the distance field\n  float d = length( abs(st) - distorsion ); \n  // float d = length( min(abs(st) - distorsion, 0.0) );\n  // float d = length( max(abs(st) - distorsion, 0.0) ); \n\n  return fract(d * size);\n}",s="\nfloat polar(vec2 uv, vec2 center, float size) {\n  vec2 pos = center - uv;\n\n  float r = length(pos) * size;\n  float a = atan(pos.y, pos.x);\n\n  float f = 0.0;\n  f = cos(a * 3.0);\n  // f = abs(cos(a * 3.0));\n  // f = abs(cos(a * 2.5)) * 0.5 + 0.3;\n  // f = abs(cos(a * 12.0) * sin(a * 3.0)) * 0.8 + 0.1;\n  // f = smoothstep(-0.5, 1.0, cos(a * 10.0)) * 0.2 + 0.5;\n\n  return 1.0 - smoothstep(f, f + 0.02, r);\n}",l="\n".concat(o.PI).concat(o.TWO_PI,"\n\nfloat polygon(vec2 uv, int nb, float size) {\n  float d = 0.0;\n\n  // Remap the space to -1. to 1.\n  vec2 st = uv  * 2.0 - 1.0;\n\n  // Number of sides of your shape\n  int N = nb;\n\n  // Angle and radius from the current pixel\n  float a = atan(st.x, st.y) + PI;\n  float r = TWO_PI / float(N);\n\n  // Shaping function that modulate the distance\n  d = cos(floor(0.5 + a / r) * r - a) * length(st) * (1.0 / size);\n\n  return 1.0 - smoothstep(0.4, 0.41, d);\n}"),f="\nfloat concentricCircles(vec2 uv, float distance, float step) {\n  vec2 center = 2.0 * (uv - vec2(0.5));\n  float r = length(center);\n  float a = atan(center.y, center.x);\n  return pow(max(0.0, sin(step * log(r))), distance);\n}\n",v="\n".concat(o.PI,"\nvec4 fluid(vec2 uv, vec2 scale, float time) {\n  float v = 0.0;\n    vec2 c = uv * scale - scale / 2.0;\n    v += sin((c.x + time));\n    v += sin((c.y + time) / 2.0);\n    v += sin((c.x + c.y + time)/2.0);\n    c += scale / 2.0 * vec2(sin(time / 3.0), cos(time / 2.0));\n    v += sin(sqrt(c.x * c.x + c.y * c.y + 1.0) + time);\n    v = v/2.0;\n    vec3 col = vec3(1.0, sin(PI * v), cos(PI * v));\n    return vec4(col * 0.5 + 0.5, 1.0);\n}\n"),x="\n".concat(o.PI,"\n").concat(a.funcNoise,"\n").concat(a.funcPnoise,"\n").concat(a.funcSnoise,"\nfloat clouds( vec2 coord ) {\n  // standard fractal\n  float n = snoise(vec3(coord, 1.0));\n  n += 0.5 * snoise(vec3(coord * 2.0, 1.0));\n  n += 0.25 * snoise(vec3(coord * 4.0, 1.0));\n  n += 0.125 * snoise(vec3(coord * 8.0, 1.0));\n  n += 0.0625 * snoise(vec3(coord * 16.0, 1.0));\n  n += 0.03125 * snoise(vec3(coord * 32.0, 1.0));\n  n += 0.03125 * snoise(vec3(coord * 32.0, 1.0));\n  return n;\n}\n\nvec4 planet(vec2 uv, float size, vec2 rotation) {\n  vec2 norm = 2.0 * uv - 1.0;\n\n  float r = length(norm) / size;\n  float phi = atan(norm.y, norm.x);\n  \n  // spherize\n  r = 2.0 * asin(r) / PI;\n  \n  vec2 coord = vec2(r * cos(phi), r * sin(phi));\n  coord = coord / 2.0 + 0.5;\n\n  coord += rotation;\n  float n = clouds(coord * 3.0);\n  \n  vec2 position = uv - 0.5;\n  float len = length(position);\n  \n  // block out some terrain\n  float terrain = smoothstep(0.1, 0.0, n); \n  \n  // green\n  vec3 terrainColor = vec3(76.0 / 255.0, 147.0 / 255.0, 65.0 / 255.0); \n  terrainColor = mix(\n    vec3(131.0 / 255.0, 111.0 / 255.0, 39.0 / 255.0),\n    terrainColor,\n    smoothstep(0.2, .7, 1.0 - n)\n  );\n  \n  //mix in brown edge\n  terrainColor = mix(\n    vec3(94.0 / 255.0, 67.0 / 255.0, 31.0 / 255.0), \n    terrainColor, \n    smoothstep(0.0, 0.18, n)\n  );\n  terrainColor += n * 0.3;\n  \n  // water\n  vec3 color = vec3(81.0 / 255.0, 121.0 / 255.0, 181.0 / 255.0); \n  color -= (1.0 - n * 4.0) * 0.03;\n  \n  // mix terrain with water\n  color = mix(terrainColor, color, terrain); \n  \n  // anti-alias\n  color *= smoothstep(0.5 * size, 0.495 * size, len);\n  // shadow\n  color *= smoothstep(0.625 * size, 0.25 * size, len);\n  color = clamp(color, 0.0, 1.0);\n  float opacity = 1.0;\n  if (color == vec3(0.0)) {\n    opacity = 0.0;\n  }\n  return vec4(color, opacity);\n}\n")}}]);