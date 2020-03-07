import vertex from './basicVertex';

import { funcBlur2 } from '../utils';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform vec2 direction;
uniform vec2 resolution;

${funcBlur2}

void main() {
  gl_FragColor = funcBlur(textureMap, fragTexture, resolution, direction);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'resolution', 'direction'],
};
