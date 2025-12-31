import vertex from './basicVertex';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform float delta;
uniform vec2 resolution;

mat3 colorMatrix = mat3(
  0.3588, 0.7044, 0.1368,
  0.2990, 0.5870, 0.1140,
  0.2392, 0.4696, 0.0912
);

void main() {
  vec4 color = texture2D(textureMap, fragTexture);
  vec3 outputColor = color.xyz * colorMatrix;
  vec3 finalColor = (delta * outputColor) + ((1.0 - delta) * color.xyz);
  gl_FragColor = vec4(finalColor, color.w);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'delta', 'resolution'],
};
