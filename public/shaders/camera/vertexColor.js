const vertex = `
attribute vec3 position;
attribute vec4 color;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

varying vec4 fragColor;

void main() {
  fragColor = color;
  gl_Position = projection * view * model * vec4(position, 1.0);
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
  attributes: ['position', 'color'],
  uniforms: ['projection', 'model', 'view'],
};
