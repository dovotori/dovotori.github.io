import { anothorNoise } from '../utils/noise';

const vertex = `
attribute vec3 position;
attribute vec2 texture;
attribute vec3 offset;
attribute vec3 acolor;
attribute float size;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform float time;

varying vec3 fragColor;

${anothorNoise}

void main() {
  fragColor = acolor;
  vec2 coord = offset.xz + vec2(time, 0.0);
  float height = noise(coord);

  mat4 scale;
  scale[0] = vec4(size, 0.0, 0.0, 0.0);
  scale[1] = vec4(0.0, size, 0.0, 0.0);
  scale[2] = vec4(0.0, 0.0, size, 0.0);
  scale[3] = vec4(0.0, 0.0, 0.0, 1.0);
  
  mat4 translate;
  translate[0] = vec4(1.0, 0.0, 0.0, 0.0);
  translate[1] = vec4(0.0, 1.0, 0.0, 0.0);
  translate[2] = vec4(0.0, 0.0, 1.0, 0.0);
  translate[3] = vec4(offset.x, height, offset.z, 1.0);


  gl_Position = projection * view  * model * translate * scale * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

varying vec3 fragColor;

void main() {
  gl_FragColor = vec4(fragColor, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture', 'offset', 'acolor', 'size'],
  uniforms: ['projection', 'model', 'view', 'time'],
};
