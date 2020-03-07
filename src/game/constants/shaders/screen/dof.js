import vertex from './basicVertex';
import { funcBlur2 } from '../utils';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform sampler2D depthMap; // depth
uniform vec2 resolution;
uniform vec2 range; // near far
uniform float focusDistance;
uniform float blur;
uniform float ppm;

#define MAX_BLUR 20.0

${funcBlur2}

void main() {
  vec2 resolution = vec2(resolution) - vec2(1.0);
  float ndc = 2.0 * texture2D(depthMap, fragTexture).r - 1.0;
  float depth = -(2.0 * range.y * range.x) / (ndc * (range.y - range.x) - range.y - range.x);
  float deltaDepth = abs(focusDistance - depth) * 0.6;
  
  // Blur more quickly in the foreground.
  float xdd = depth < focusDistance ? abs(focusDistance - deltaDepth) : abs(focusDistance + deltaDepth);
  float blurRadius = min(floor(blur * (deltaDepth / xdd) * ppm), MAX_BLUR);
  
  vec4 color = vec4(0.0);
  if (blurRadius > 1.0) {
    color = funcBlur(textureMap, fragTexture, resolution, vec2(blurRadius * 0.1, 0.0));
  } else {
    color = texture2D(textureMap, fragTexture);
  }
  float fog = (1.0 - texture2D(depthMap, fragTexture).r) * (range.y - range.x);
  gl_FragColor = color * fog;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: [
    'flipY',
    'textureMap',
    'depthMap',
    'resolution',
    'range',
    'focusDistance',
    'blur',
    'ppm',
  ],
};
