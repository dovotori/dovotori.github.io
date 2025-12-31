import vertex from './basicVertex';

import { funcBlur2 } from '../utils/blur';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform vec2 direction;
uniform vec2 resolution;

${funcBlur2}

void main() {
  // vec3 blur = funcBlur(textureMap, fragTexture, resolution, direction);
  // float alpha = texture2D(textureMap, fragTexture).a;
  // gl_FragColor = vec4(blur, alpha);
  gl_FragColor = funcBlur(textureMap, fragTexture, resolution, direction);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'resolution', 'direction'],
};
