import vertex from './basicVertex';

const fragment = `
precision mediump float;
uniform vec4 color;

void main() {
  gl_FragColor = color;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position'],
  uniforms: ['projection', 'model', 'view', 'color'],
};
