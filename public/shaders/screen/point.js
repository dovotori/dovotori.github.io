const vertex = `
attribute vec3 position;

uniform float time;

void main() {
  gl_PointSize = 4.0;
  gl_Position = vec4(position, 1.0);
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
  attributes: ["position"],
  uniforms: ["time"],
};
