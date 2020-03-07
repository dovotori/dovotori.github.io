import vertex from './basicVertex';

const fragment = `
precision mediump float;
void main() {
  gl_FragColor = vec4(1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position'],
  uniforms: ['projection', 'model', 'view'],
};
