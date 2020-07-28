import {
  uniformLights,
  addLightLocations,
  funcLightAttenuation,
  funcLightConeAttenuation,
} from '../utils/light';

import vertex from './basicVertex';

const fragment = `
precision mediump float;

#define CAP_MAX_DEPTH 0.99 // z limit to compute

uniform sampler2D depthMap;
uniform sampler2D normalMap;
uniform sampler2D positionMap;
varying vec2 fragTexture;

${uniformLights}

${funcLightAttenuation}
${funcLightConeAttenuation}

vec4 funcDiffuseColor() {
  vec3 finalColor = vec3(0.0);
  float fragDepth = texture2D(depthMap, fragTexture).r * 2.0 - 1.0;
  if (fragDepth > CAP_MAX_DEPTH) { return vec4(0.0); } // if too far

  vec3 N = texture2D(normalMap, fragTexture).xyz;
  vec3 P = texture2D(positionMap, fragTexture).xyz;
  
  for(int i = 0; i < MAX_LIGHTS; i += 1) {
    if(i < numLights) {
      vec3 lightPos = lights[i].position;
      vec3 L = normalize(lightPos - P);
      float lambertCosinus = max(dot(N, L), 0.0);
      vec3 color = lights[i].diffuse * lambertCosinus;
      float att = 1.0;
      // if (lights[i].type == 1) {
      //   att = funcLightAttenuation(lights[i].position, lights[i].radius, N, P);
      // } else if (lights[i].type == 2) {
      //   att = funcLightConeAttenuation(lights[i].position, lights[i].direction, N, P);
      // }
      color *= lights[i].strength;
      color *= att;
      finalColor += color;
    }
  }
  return vec4(finalColor, 1.0);
}

void main() {
  gl_FragColor = funcDiffuseColor();
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'depthMap', 'normalMap', 'positionMap'].concat(addLightLocations()),
};
