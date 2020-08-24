import { funcMap } from '../utils';

const vertex = `
attribute float value;
attribute float index;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform int maxfrequency;
uniform int length;

${funcMap}

varying vec3 color;

void main() {
  float normalizeValue = value / float(maxfrequency);

  float y = funcMap(normalizeValue, 0.0, 1.0, 0.0, 1.0);
  float x = funcMap(index, 0.0, float(length), -1.0, 1.0);

  vec3 position = vec3(x, y, 4.0);
  color = position;
  
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

varying vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['value', 'index'],
  uniforms: ['projection', 'model', 'view', 'length', 'maxfrequency'],
};
