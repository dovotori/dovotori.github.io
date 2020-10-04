const vertex = `
attribute vec3 position;
attribute vec3 normale;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;
varying vec3 fragNormale;

void main() {
  fragNormale = normalMatrix * normale;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;
varying vec3 fragNormale;

void main() {
  gl_FragColor = vec4(fragNormale, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'normale'],
  uniforms: ['projection', 'model', 'view', 'normalMatrix'],
};
