import vertex from "./basicVertex";

const fragment = `
precision mediump float;

varying vec3 fragSpecular;
varying float fragSpecDensity;

void main() {
  gl_FragColor = color;
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position"],
  uniforms: ["projection", "model", "view", "color"],
};
