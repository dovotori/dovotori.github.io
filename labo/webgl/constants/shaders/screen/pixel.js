import vertex from './basicVertex';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform vec2 delta;
uniform vec2 resolution;

void main() {
  float dx = delta.x * 1.0 / resolution.x;
  float dy = delta.y * 1.0 / resolution.y;
  vec2 coord = vec2(dx * floor(fragTexture.x / dx), dy * floor(fragTexture.y / dy));
  gl_FragColor = texture2D(textureMap, coord);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'delta', 'resolution'],
};
