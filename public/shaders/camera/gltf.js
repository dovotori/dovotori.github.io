import { uniformLights } from '../utils/light';
import { /* funcPBR, */ PBRLocations, uniformPBR } from '../utils/pbr';
import { funcLightsToon } from '../utils/toon';

const vertex = `
attribute vec3 position;
attribute vec3 normale;
attribute vec4 tangent;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;

varying vec3 fragPosition;
varying vec3 fragNormale;

void main() {
  vec4 VMpos = view * model * vec4(position, 1.0);
  fragPosition = normalize(VMpos.xyz);
  fragNormale = normalize(normalMatrix * normale);
  gl_Position = projection * VMpos;
}
`;

const fragment = `
precision mediump float;
varying vec3 fragPosition;
varying vec3 fragNormale;

uniform vec3 posEye;

${uniformLights}
${uniformPBR}
${funcLightsToon}

void main() {
  // vec3 phong = funcLightsColor(
  //   color.xyz, vec3(1.0,1.0,1.0), vec3(1.0,1.0,1.0), fragNormale, fragPosition
  // );
  // gl_FragColor = vec4(phong, 1.0);

  // vec3 colorPbr = funcPBR(fragPosition, fragNormale, posEye);
  // gl_FragColor = vec4(colorPbr, 1.0);
  
  vec3 colorToon = funcLightsToon(color.xyz, fragPosition, fragNormale);
  gl_FragColor = vec4(colorToon, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'normale', 'tangent'],
  uniforms: ['projection', 'model', 'view', 'normalMatrix', 'posEye'].concat(PBRLocations),
};
