import { uniformLights, addLightLocations, funcLightsColor } from '../utils/light';

const vertex = `
attribute vec3 position;
attribute vec3 normale;
attribute vec4 tangent;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalmatrix;
uniform float time;

varying vec3 fragPosition;
varying vec3 fragNormale;

void main()
{
  float displacement = 0.0;
  vec3 newPosition = position + normale * displacement;
  
  fragPosition = normalize((view * model * vec4(newPosition, 1.0)).xyz);
  fragNormale = normalmatrix * normalize(normale);
  gl_Position = projection * view * model * vec4(newPosition, 1.0);
}
`;

const fragment = `
precision mediump float;
varying vec3 fragPosition;
varying vec3 fragNormale;

uniform vec4 color;
uniform float rough; 
uniform float metal;

${uniformLights}
${funcLightsColor}

void main() {
  vec3 phong = funcLightsColor(color.xyz, vec3(1.0,1.0,1.0), vec3(1.0,1.0,1.0), fragNormale, fragPosition);
  gl_FragColor = vec4(phong, 1.0);
  // gl_FragColor = vec4(fragNormale, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'normale', 'tangent'],
  uniforms: [
    'projection',
    'model',
    'view',
    'normalmatrix',
    'color',
    'rough',
    'metal',
    'posLum',
    'posEye',
    'time',
  ].concat(addLightLocations()),
};
