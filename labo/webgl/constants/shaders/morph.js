const vertex = `
attribute vec3 position;
attribute vec3 targetposition0;
attribute vec3 targetposition1;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform float weights[2];

void main() {
  vec3 newposition = position + weights[0] * targetposition0 + weights[1] * targetposition1;
  gl_Position = projection * view * model * vec4(newposition, 1.0);
}
`;

const fragment = `
precision mediump float;
void main() {
  gl_FragColor = vec4(1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'targetposition0', 'targetposition1'],
  uniforms: ['projection', 'model', 'view', 'weights[0]', 'weights[1]'],
};
