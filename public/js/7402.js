"use strict";(self.webpackChunkdovotori=self.webpackChunkdovotori||[]).push([[7402,8735],{7402:(n,t,i)=>{i.r(t),i.d(t,{default:()=>e});var o=i(8735);const e={vertex:"\nattribute vec3 position;\nattribute vec3 normale;\nattribute vec4 tangent;\nuniform mat4 projection;\nuniform mat4 model;\nuniform mat4 view;\nuniform mat3 normalMatrix;\nuniform float time;\n\nvarying vec3 fragPosition;\nvarying vec3 fragNormale;\n\nvoid main()\n{\n  float displacement = 0.0;\n  vec3 newPosition = position + normale * displacement;\n  \n  fragPosition = normalize((view * model * vec4(newPosition, 1.0)).xyz);\n  fragNormale = normalMatrix * normalize(normale);\n  gl_Position = projection * view * model * vec4(newPosition, 1.0);\n}\n",fragment:"\nprecision mediump float;\nvarying vec3 fragPosition;\nvarying vec3 fragNormale;\n\nuniform vec4 color;\nuniform float rough; \nuniform float metal;\n\n".concat(o.uniformLights,"\n").concat(o.funcLightsColor,"\n\nvoid main() {\n  vec3 phong = funcLightsColor(\n    color.xyz,\n    vec3(1.0,1.0,1.0),\n    vec3(1.0,1.0,1.0),\n    fragNormale,\n    fragPosition\n  );\n  gl_FragColor = vec4(phong, 1.0);\n  // gl_FragColor = vec4(fragNormale, 1.0);\n}\n"),attributes:["position","normale","tangent"],uniforms:["projection","model","view","normalMatrix","color","rough","metal","posLum","posEye","time"].concat((0,o.addLightLocations)())}},8735:(n,t,i)=>{i.r(t),i.d(t,{MAX_LIGHTS:()=>o,addLightLocations:()=>a,funcLightAttenuation:()=>r,funcLightConeAttenuation:()=>c,funcLightsColor:()=>s,funcPhong:()=>l,uniformLights:()=>e});var o=10,e="\n#define MAX_LIGHTS ".concat(o,"\nuniform int numLights;\nuniform struct Light {\n   int type;\n   vec3 position;\n   vec3 ambiant;\n   vec3 diffuse;\n   vec3 specular;\n   float radius;\n   vec3 direction;\n   float strength;\n   float brillance;\n} lights[MAX_LIGHTS];\n"),a=function(){for(var n=[],t=0;t<o;t+=1)n.push("lights[".concat(t,"].type")),n.push("lights[".concat(t,"].position")),n.push("lights[".concat(t,"].ambiant")),n.push("lights[".concat(t,"].diffuse")),n.push("lights[".concat(t,"].specular")),n.push("lights[".concat(t,"].radius")),n.push("lights[".concat(t,"].direction")),n.push("lights[".concat(t,"].brillance")),n.push("lights[".concat(t,"].strength"));return n.push("numLights"),n},c="\nfloat funcLightConeAttenuation(vec3 posLum, vec3 posDirection, vec3 normale, vec3 position) {\n  float intensity = 0.0;\n  float cutoff = 0.9;\n\n  vec3 lightDirection = normalize(posLum - position); \n  vec3 spotDirection = normalize(posDirection);\n\n  // inside the cone ?\n  if (dot(spotDirection, lightDirection) > cutoff) {\n\n    vec3 n = normalize(normale);\n    intensity = max(dot(n, lightDirection), 0.0);\n\n    // if (intensity > 0.0) {\n    // vec3 eye = normalize(DataIn.eye);\n    // vec3 h = normalize(lightDirection + eye);\n    // float intSpec = max(dot(h,n), 0.0);\n    // spec = specular * pow(intSpec, shininess);\n    // }\n  }\n  return intensity;\n}\n",r="\nfloat funcLightAttenuation(vec3 posLum, float radius, vec3 normale, vec3 position) {\n  float cutoff = 0.1;\n  vec3 lightDirection = posLum - position;\n  float distance = length(lightDirection);\n  float d = max(distance - radius, 0.0);\n  lightDirection /= distance;\n  float denom = d / radius + 1.0;\n  float attenuation = 1.0 / (denom * denom);\n    \n  attenuation = (attenuation - cutoff) / (1.0 - cutoff);\n  attenuation = max(attenuation, 0.0);\n\n  float dot = max(dot(lightDirection, normale), 0.0);\n  return attenuation * dot;\n}\n",l="\nvec3 funcPhong(\n  vec3 position,\n  vec3 normale,\n  vec3 ambiant,\n  vec3 diffuse,\n  vec3 specular,\n  vec3 posLum,\n  float brillance\n  ) {\n  vec3 N = normalize(normale);\n  vec3 L = normalize(posLum - position);\n\n  // Lambert's cosine law\n  float lambertian = max(dot(N, L), 0.0);\n\n  float specularValue = 0.0;\n  if(lambertian > 0.0) {\n    vec3 R = reflect(-L, N); // Reflected light vector\n    vec3 V = normalize(-position); // Vector to viewer\n    float specAngle = max(dot(R, V), 0.0);\n    specularValue = pow(specAngle, brillance);\n  }\n\n  return vec3(ambiant * ((lambertian * diffuse) + (specularValue * specular)));\n}\n",s="\n".concat(l,"\n").concat(c,"\n").concat(r,"\nvec3 funcLightsColor(vec3 ambiant, vec3 diffuse, vec3 specular, vec3 normale, vec3 position) {\n  vec3 finalColor = vec3(0.0);\n  for(int i = 0; i < MAX_LIGHTS; i += 1) {\n    if(i < numLights) {\n      vec3 color = funcPhong(\n        position,\n        normale,\n        ambiant * (lights[i].ambiant * lights[i].strength),\n        diffuse * (lights[i].diffuse * lights[i].strength),\n        specular * (lights[i].specular * lights[i].strength),\n        lights[i].position,\n        lights[i].brillance\n      );\n      float att = 1.0;\n      if (lights[i].type == 1) {\n        att = funcLightAttenuation(lights[i].position, lights[i].radius, normale, position);\n      } else if (lights[i].type == 2) {\n        att = funcLightConeAttenuation(lights[i].position, lights[i].direction, normale, position);\n      }\n      color *= att;\n      finalColor += color;\n    }\n  }\n  finalColor /= vec3(numLights);\n  return finalColor;\n}\n")}}]);