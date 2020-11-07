import { anothorNoise } from '../utils/noise';

const vertex = `
attribute vec3 position;
attribute vec2 texture;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

uniform sampler2D textureMap;
uniform float time;

varying vec4 fragColor;

${anothorNoise}

void main() {
  // gl_PointSize = 2.0;
  float speed = time * 0.001;
  vec2 coord = texture * 6.0 + vec2(speed, 0.0);
  // float height = texture2D(textureMap, coord).x;
  float height = 1.0; // noise(coord);
  fragColor = vec4(position + 0.4, 1.0);
  // vec3 tranformed = vec3(position.x, height, position.z);
  vec3 tranformed = vec3(position.x, position.y, position.z);
  gl_Position = projection * view * model * vec4(tranformed, 1.0);
}
`;

const fragment = `
precision mediump float;

varying vec4 fragColor;

void main() {
  gl_FragColor = fragColor;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['projection', 'model', 'view', 'textureMap', 'time'],
};
