import { funcMap, PI } from "../utils";

const vertex = `
attribute float value;
attribute float index;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform int maxfrequency;
uniform int length;

${funcMap}
${PI}

#define SIZE 4.0

varying vec3 color;

void main() {
  float normalizeValue = value / float(maxfrequency);

  float y = funcMap(normalizeValue, 0.0, 1.0, 0.0, 1.0);
  
  float radian = funcMap(index, 0.0, float(length), 0.0, PI * 2.0);
  float x = cos(radian) * SIZE;
  float z = sin(radian) * SIZE;

  vec3 position = vec3(x, y, z);
  color = vec3(1.0 - y, 0.7, 0.9);
  
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
  attributes: ["value", "index"],
  uniforms: ["projection", "model", "view", "length", "maxfrequency"],
};
