import { funcLightsColor } from '../utils/light';
import { funcPBR, PBRLocations } from '../utils/pbr';
import { funcShadow } from '../utils/shadow';

const vertex = `
attribute vec3 position;
attribute vec3 normale;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat4 inverseModel;
uniform mat3 normalmatrix;
uniform mat4 shadowview;

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec4 fragShadow;
varying vec3 fragTransformPosition;

const mat4 bias = mat4(
  0.5, 0.0, 0.0, 0.0,
  0.0, 0.5, 0.0, 0.0,
  0.0, 0.0, 0.5, 0.0,
  0.5, 0.5, 0.5, 1.0
);

void main()
{
  fragPosition = normalize((view * model * vec4(position, 1.0)).xyz);
  fragNormale = normalmatrix * normalize(normale);
  fragShadow = bias * projection * shadowview * model * vec4(position, 1.0);
  fragTransformPosition = (projection * view * inverseModel * model * vec4(position, 1.0)).xyz;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

uniform vec2 resolution;
uniform sampler2D shadowMap;
uniform vec3 posEye;

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec4 fragShadow;
varying vec3 fragTransformPosition;

${funcPBR}
${funcLightsColor}
${funcShadow}

void main() {
  if (fragTransformPosition.z < -3.11 || fragTransformPosition.z > -0.99
  ) {
    gl_FragColor = vec4(0.0);
  } else {
    float epsilon = 0.0007; // Fix shadow acne
    vec3 phong = funcLightsColor(color.xyz, vec3(1.0,1.0,1.0), vec3(1.0,1.0,1.0), fragNormale, fragPosition);
    // vec3 pbr = funcPBR(fragPosition, fragNormale, posEye);
    float shadow = funcShadow(shadowMap, fragShadow, resolution, epsilon);
    gl_FragColor = vec4(phong * shadow, 1.0);
  }
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'normale'],
  uniforms: [
    'projection',
    'view',
    'model',
    'inverseModel',
    'normalmatrix',
    'resolution',
    'posEye',
    'shadowview',
    'shadowMap',
  ].concat(PBRLocations),
};
