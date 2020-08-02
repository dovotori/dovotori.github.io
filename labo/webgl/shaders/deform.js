import { uniformLights, addLightLocations, funcLightsColor } from './utils/light';
import { funcMap, PI } from './utils';

const vertex = `
attribute vec3 position;
attribute vec3 normale;
attribute vec4 tangent;
attribute vec2 texture;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalmatrix;
uniform float time;
uniform sampler2D noiseMap;
uniform sampler2D displacementMap;

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec2 fragTexture;

${PI}
${funcMap}

void main() {
  gl_PointSize = 2.0;

  float noise = texture2D(noiseMap, texture + vec2(time * 0.005)).x;

  float SIZE = 0.1;
  float fromCenterY = funcMap(texture.y, 0.0, 1.0, -SIZE, SIZE);
  float wave = 1.0 + (funcMap(cos(fromCenterY * time), -1.0, 1.0, 0.0, PI / 2.0) * 0.2);

  float frequency = texture2D(displacementMap, texture).a;
  float displacement = frequency + wave;
  
  vec3 newPosition = position + normale * displacement;
  if (position.x == 0.0 && position.z == 0.0) {
    newPosition = position;
  }
  
  fragPosition = normalize((view * model * vec4(newPosition, 1.0)).xyz);
  fragNormale = normalmatrix * normalize(normale * displacement);
  fragTexture = texture;

  gl_Position = projection * view * model * vec4(newPosition, 1.0);
}
`;

const fragment = `
precision mediump float;
varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec2 fragTexture;

uniform sampler2D colorMap;
uniform vec4 color;
uniform float rough; 
uniform float metal;

${uniformLights}
${funcLightsColor}

void main() {
  vec3 texColor = texture2D(colorMap, fragTexture).xyz;
  vec3 phong = funcLightsColor(texColor, vec3(1.0,1.0,1.0), vec3(1.0,1.0,1.0), fragNormale, fragPosition);
  gl_FragColor = vec4(phong * vec3(3.0), 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'normale', 'texture', 'tangent'],
  uniforms: [
    'projection',
    'model',
    'view',
    'normalmatrix',
    'noiseMap',
    'colorMap',
    'displacementMap',
    'color',
    'rough',
    'metal',
    'posLum',
    'posEye',
    'time',
  ].concat(addLightLocations()),
};
