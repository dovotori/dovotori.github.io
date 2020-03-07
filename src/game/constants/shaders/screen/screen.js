import vertex from './basicVertex';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
void main() {
  gl_FragColor = texture2D(textureMap, fragTexture);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap'],
};
