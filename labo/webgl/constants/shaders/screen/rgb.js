import vertex from './basicVertex';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform vec2 delta;
uniform vec2 resolution;
uniform vec2 center;
void main() {
  vec2 dir = fragTexture - center;
  vec2 value = dir * delta;
	vec4 c1 = texture2D(textureMap, fragTexture - value / resolution.x);
	vec4 c2 = texture2D(textureMap, fragTexture);
	vec4 c3 = texture2D(textureMap, fragTexture + value / resolution.y);

  gl_FragColor = vec4(c1.r, c2.g, c3.b, c1.a + c2.a + c3.b);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'delta', 'resolution', 'center'],
};
