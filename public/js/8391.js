"use strict";(self.webpackChunkdovotori_portfolio=self.webpackChunkdovotori_portfolio||[]).push([[8391,552,8735,568,9060],{28391:(n,o,t)=>{t.r(o),t.d(o,{default:()=>r});var e=t(8735),i=t(60568),a=t(99060);const r={vertex:"\nattribute vec3 position;\nattribute vec3 normale;\nattribute vec4 tangent;\nuniform mat4 projection;\nuniform mat4 model;\nuniform mat4 view;\nuniform mat3 normalMatrix;\n\nvarying vec3 fragPosition;\nvarying vec3 fragNormale;\n\nvoid main() {\n  vec4 VMpos = view * model * vec4(position, 1.0);\n  fragPosition = normalize(VMpos.xyz);\n  fragNormale = normalize(normalMatrix * normale);\n  gl_Position = projection * VMpos;\n}\n",fragment:"\nprecision mediump float;\nvarying vec3 fragPosition;\nvarying vec3 fragNormale;\n\nuniform vec3 posEye;\n\n".concat(e.uniformLights,"\n").concat(i.uniformPBR,"\n").concat(a.funcLightsToon,"\n\nvoid main() {\n  // vec3 phong = funcLightsColor(\n  //   color.xyz, vec3(1.0,1.0,1.0), vec3(1.0,1.0,1.0), fragNormale, fragPosition\n  // );\n  // gl_FragColor = vec4(phong, 1.0);\n\n  // vec3 colorPbr = funcPBR(fragPosition, fragNormale, posEye);\n  // gl_FragColor = vec4(colorPbr, 1.0);\n  \n  vec3 colorToon = funcLightsToon(color.xyz, fragPosition, fragNormale);\n  gl_FragColor = vec4(colorToon, 1.0);\n}\n"),attributes:["position","normale","tangent"],uniforms:["projection","model","view","normalMatrix","posEye"].concat(i.locationsPBR)}},20552:(n,o,t)=>{t.r(o),t.d(o,{PI:()=>e,TWO_PI:()=>i,attributeColors:()=>a,funcGradiant:()=>s,funcGrain:()=>l,funcMap:()=>c,varyingColors:()=>r});var e="\n#define PI 3.14159265359\n",i="\n#define TWO_PI 6.28318530718\n",a="\nattribute vec3 ambiant;\nattribute vec3 diffuse;\nattribute vec3 specular;\nattribute float specDensity;\nattribute float opacity;\n",r="\nvarying vec3 fragAmbiant;\nvarying vec3 fragDiffuse;\nvarying vec3 fragSpecular;\nvarying float fragSpecDensity;\nvarying float fragOpacity;\n",c="\nfloat funcMap(float valeur, float minRef, float maxRef, float minDest, float maxDest) {\n  float result = minDest + (valeur - minRef) * (maxDest - minDest) / (maxRef - minRef);\n  if(result > maxDest){ result = maxDest; } else if(result < minDest){ result = minDest; }\n  return result;\n}\n",l="\nvec4 funcGrain(vec2 uv, float time, float strength) {\n  float x = (uv.x + 4.0 ) * (uv.y + 4.0 ) * (time * 10.0);\n  return vec4(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.005) * strength;\n}\n",s="\n".concat(c,"\nvec4 funcGradiant(vec4 color1, vec4 color2, float start, float end, float uvAxe) {\n  float mixValue = funcMap(uvAxe, start, end, 0.0, 1.0);\n  return mix(color1, color2, mixValue);\n}\n")},8735:(n,o,t)=>{t.r(o),t.d(o,{MAX_LIGHTS:()=>e,addLightLocations:()=>a,funcLightAttenuation:()=>c,funcLightConeAttenuation:()=>r,funcLightsColor:()=>s,funcPhong:()=>l,uniformLights:()=>i});var e=10,i="\n#define MAX_LIGHTS ".concat(e,"\nuniform int numLights;\nuniform struct Light {\n   int type;\n   vec3 position;\n   vec3 ambiant;\n   vec3 diffuse;\n   vec3 specular;\n   float radius;\n   vec3 direction;\n   float strength;\n   float brillance;\n} lights[MAX_LIGHTS];\n"),a=function(){for(var n=[],o=0;o<e;o+=1)n.push("lights[".concat(o,"].type")),n.push("lights[".concat(o,"].position")),n.push("lights[".concat(o,"].ambiant")),n.push("lights[".concat(o,"].diffuse")),n.push("lights[".concat(o,"].specular")),n.push("lights[".concat(o,"].radius")),n.push("lights[".concat(o,"].direction")),n.push("lights[".concat(o,"].brillance")),n.push("lights[".concat(o,"].strength"));return n.push("numLights"),n},r="\nfloat funcLightConeAttenuation(vec3 posLum, vec3 posDirection, vec3 normale, vec3 position) {\n  float intensity = 0.0;\n  float cutoff = 0.9;\n\n  vec3 lightDirection = normalize(posLum - position); \n  vec3 spotDirection = normalize(posDirection);\n\n  // inside the cone ?\n  if (dot(spotDirection, lightDirection) > cutoff) {\n\n    vec3 n = normalize(normale);\n    intensity = max(dot(n, lightDirection), 0.0);\n\n    // if (intensity > 0.0) {\n    // vec3 eye = normalize(DataIn.eye);\n    // vec3 h = normalize(lightDirection + eye);\n    // float intSpec = max(dot(h,n), 0.0);\n    // spec = specular * pow(intSpec, shininess);\n    // }\n  }\n  return intensity;\n}\n",c="\nfloat funcLightAttenuation(vec3 posLum, float radius, vec3 normale, vec3 position) {\n  float cutoff = 0.1;\n  vec3 lightDirection = posLum - position;\n  float distance = length(lightDirection);\n  float d = max(distance - radius, 0.0);\n  lightDirection /= distance;\n  float denom = d / radius + 1.0;\n  float attenuation = 1.0 / (denom * denom);\n    \n  attenuation = (attenuation - cutoff) / (1.0 - cutoff);\n  attenuation = max(attenuation, 0.0);\n\n  float dot = max(dot(lightDirection, normale), 0.0);\n  return attenuation * dot;\n}\n",l="\nvec3 funcPhong(\n  vec3 position,\n  vec3 normale,\n  vec3 ambiant,\n  vec3 diffuse,\n  vec3 specular,\n  vec3 posLum,\n  float brillance\n  ) {\n  vec3 N = normalize(normale);\n  vec3 L = normalize(posLum - position);\n\n  // Lambert's cosine law\n  float lambertian = max(dot(N, L), 0.0);\n\n  float specularValue = 0.0;\n  if(lambertian > 0.0) {\n    vec3 R = reflect(-L, N); // Reflected light vector\n    vec3 V = normalize(-position); // Vector to viewer\n    float specAngle = max(dot(R, V), 0.0);\n    specularValue = pow(specAngle, brillance);\n  }\n\n  return vec3(ambiant * ((lambertian * diffuse) + (specularValue * specular)));\n}\n",s="\n".concat(l,"\n").concat(r,"\n").concat(c,"\nvec3 funcLightsColor(vec3 ambiant, vec3 diffuse, vec3 specular, vec3 normale, vec3 position) {\n  vec3 finalColor = vec3(0.0);\n  for(int i = 0; i < MAX_LIGHTS; i += 1) {\n    if(i < numLights) {\n      vec3 color = funcPhong(\n        position,\n        normale,\n        ambiant * (lights[i].ambiant * lights[i].strength),\n        diffuse * (lights[i].diffuse * lights[i].strength),\n        specular * (lights[i].specular * lights[i].strength),\n        lights[i].position,\n        lights[i].brillance\n      );\n      float att = 1.0;\n      if (lights[i].type == 1) {\n        att = funcLightAttenuation(lights[i].position, lights[i].radius, normale, position);\n      } else if (lights[i].type == 2) {\n        att = funcLightConeAttenuation(lights[i].position, lights[i].direction, normale, position);\n      }\n      color *= att;\n      finalColor += color;\n    }\n  }\n  finalColor /= vec3(numLights);\n  return finalColor;\n}\n")},60568:(n,o,t)=>{t.r(o),t.d(o,{funcPBR:()=>r,locationsPBR:()=>c,uniformPBR:()=>a});var e=t(8735),i=t(20552),a="\nuniform vec4 color;\nuniform float metal;\nuniform float rough;\nuniform float ao;\n",r="\n".concat(i.PI,"\n").concat(e.uniformLights,"\n").concat(a,"\n\nfloat DistributionGGX(vec3 N, vec3 H, float roughness) {\n  float a      = roughness * roughness;\n  float a2     = a * a;\n  float NdotH  = max(dot(N, H), 0.0);\n  float NdotH2 = NdotH * NdotH;\n  float num   = a2;\n  float denom = (NdotH2 * (a2 - 1.0) + 1.0);\n  denom = PI * denom * denom;\n  return num / denom;\n}\n\nfloat GeometrySchlickGGX(float NdotV, float roughness) {\n  float r = (roughness + 1.0);\n  float k = (r * r) / 8.0;\n  float num   = NdotV;\n  float denom = NdotV * (1.0 - k) + k;\n  return num / denom;\n}\n\nfloat GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness) {\n  float NdotV = max(dot(N, V), 0.0);\n  float NdotL = max(dot(N, L), 0.0);\n  float ggx2  = GeometrySchlickGGX(NdotV, roughness);\n  float ggx1  = GeometrySchlickGGX(NdotL, roughness);\n  return ggx1 * ggx2;\n}\n\nvec3 fresnelSchlick(float cosTheta, vec3 F0) {\n  return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);\n}\n\nvec3 funcPBR(vec3 position, vec3 normale, vec3 posEye) {\t\t\n  vec3 N = normalize(normale);\n  vec3 V = normalize(posEye - position);\n\n  vec3 F0 = vec3(0.04); \n  F0 = mix(F0, color.xyz, metal);\n\n  // reflectance equation\n  vec3 Lo = vec3(0.0);\n  \n  for (int i = 0; i < MAX_LIGHTS; ++i) {\n    if (i < numLights) {\n      // calculate per-light radiance\n      vec3 L = normalize(lights[i].position - position);\n      vec3 H = normalize(V + L);\n      float distance    = length(lights[i].position - position);\n      float attenuation = lights[i].strength / (distance * distance);\n      vec3 radiance     = lights[i].ambiant * attenuation;        \n      \n      // cook-torrance brdf\n      float NDF = DistributionGGX(N, H, rough);        \n      float G   = GeometrySmith(N, V, L, rough);      \n      vec3 F    = fresnelSchlick(max(dot(H, V), 0.0), F0);       \n      \n      vec3 kS = F;\n      vec3 kD = vec3(1.0) - kS;\n      kD *= 1.0 - metal;\t  \n      \n      vec3 numerator    = NDF * G * F;\n      float denominator = 4.0 * max(dot(N, V), 0.0) * max(dot(N, L), 0.0);\n      vec3 specular     = numerator / max(denominator, 0.001);  \n          \n      // add to outgoing radiance Lo\n      float NdotL = max(dot(N, L), 0.0);                \n      Lo += (kD * color.xyz / PI + specular) * radiance * NdotL; \n    }\n  }\n\n  vec3 ambient = vec3(0.03) * color.xyz * ao;\n  vec3 finalColor = ambient + Lo;\n  finalColor = finalColor / (finalColor + vec3(1.0));\n  finalColor = pow(finalColor, vec3(1.0 / 2.2));  \n  return finalColor;\n}\n"),c=(0,e.addLightLocations)().concat(["color","metal","rough","ao"])},99060:(n,o,t)=>{t.r(o),t.d(o,{funcLightsToon:()=>a,funcToon:()=>i,getToonStrength:()=>e});var e="\nfloat getToonStrength(float lambertCosinus) {\n  if (lambertCosinus > 0.7) {\n    return 0.8;\n  } else if (lambertCosinus > 0.3) {\n    return 0.5;\n  }\n  return 0.3;\n}\n",i="\n".concat(e,"\nvec3 funcToon(\n  vec3 position,\n  vec3 normale,\n  vec3 ambiant,\n  vec3 posLum\n  ) {\n  vec3 N = normalize(normale);\n  vec3 L = normalize(posLum - position);\n  // Lambert's cosine law\n  float lambertian = max(dot(N, L), 0.0);\n  float strength = getToonStrength(lambertian);\n  return vec3(ambiant) * vec3(strength);\n}\n"),a="\n".concat(i,"\nvec3 funcLightsToon(vec3 ambiant, vec3 position, vec3 normale) {\n  vec3 finalColor = vec3(0.0);\n  for(int i = 0; i < MAX_LIGHTS; i += 1) {\n    if(i < numLights) {\n      vec3 color = funcToon(\n        position,\n        normale,\n        ambiant * (lights[i].ambiant * lights[i].strength),\n        lights[i].position\n      );\n      finalColor += color;\n    }\n  }\n  finalColor /= vec3(numLights);\n  return finalColor;\n}\n")}}]);