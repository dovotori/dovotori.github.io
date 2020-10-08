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
  vec3 hdr = texture2D(textureMap, fragTexture).xyz;      
  vec3 bloom = texture2D(bloomMap, fragTexture).xyz;
  vec3 color = hdr + bloom;
  // gl_FragColor = vec4(color, 1.0);
  vec3 result = vec3(1.0) - exp(-color * exposure);
  result = pow(result, vec3(1.0 / gamma));
  gl_FragColor = vec4(result, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'bloomMap', 'resolution', 'gamma', 'exposure'],
};
