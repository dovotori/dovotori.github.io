import vertex from './basicVertex';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform sampler2D bloomMap;
uniform vec2 resolution;
uniform float gamma;
uniform float exposure;

void main() {
  vec4 color;
  vec4 hdr = texture2D(textureMap, fragTexture);      
  vec4 bloom = texture2D(bloomMap, fragTexture);
  float bloomOpacity = (bloom.x + bloom.y + bloom.z) * 1.0;
  color = hdr + vec4(bloom.xyz, bloomOpacity);
  vec4 result = vec4(1.0) - exp(-color * exposure);
  result = pow(result, vec4(1.0 / gamma));
  gl_FragColor = color;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'bloomMap', 'resolution', 'gamma', 'exposure'],
};
