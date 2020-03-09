import { funcShadow } from './utils';

const vertex = `
attribute vec3 position;
attribute vec3 normale;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat3 normalmatrix;
uniform mat4 shadowview;

const mat4 bias = mat4(
  0.5, 0.0, 0.0, 0.0,
  0.0, 0.5, 0.0, 0.0,
  0.0, 0.0, 0.5, 0.0,
  0.5, 0.5, 0.5, 1.0
);

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec4 fragShadow;

void main() {
  vec4 modelPos = (model * vec4(position, 1.0));
  fragPosition = modelPos.xyz;
  fragNormale = normalmatrix * normale;
  fragShadow = bias * projection * shadowview * modelPos;
  gl_Position = projection * view * modelPos;
}
`;

const fragment = `
precision mediump float;
uniform int type;
uniform sampler2D shadowMap;
uniform vec2 resolution;

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec4 fragShadow;

${funcShadow}

void main() {
  vec4 color;
  if (type == 1) {
		color = vec4(fragNormale, 1.0);
	} else if (type == 2) {
		color = vec4(fragPosition, 1.0);
  } else if(type == 3) {
    float epsilon = 0.01; // Fix shadow acne
    float shadow = funcShadow(shadowMap, fragShadow, resolution, epsilon);
    color = vec4(vec3(1.0) * shadow, 1.0);
	} else {
		color = vec4(1.0);
  }
  gl_FragColor = color;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture', 'normale'],
  uniforms: [
    'projection',
    'model',
    'view',
    'normalmatrix',
    'shadowview',
    'type',
    'resolution',
    'shadowMap',
  ],
};
