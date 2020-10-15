import vertex from './basicVertex';
import { funcBlurOnePass } from '../utils/blur';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform vec2 resolution;
uniform float intensity;

${funcBlurOnePass}

void main() {
  vec3 color = funcBlur(textureMap, fragTexture, resolution);
  // vec3 color = funcRadialBlur(textureMap, fragTexture, vec2(1.0), vec2(0.5, 0.5));
  // vec3 color = funcRadialBlur2(textureMap, fragTexture, vec2(1.0));
  gl_FragColor = vec4(color * intensity, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'resolution', 'intensity'],
};
