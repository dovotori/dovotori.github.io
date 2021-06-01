import { PI } from '../utils';
import vertex from './basicVertex';

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform float time;

varying vec2 fragTexture;

${PI}

mat2 rot(float th){ float cs = cos(th), si = sin(th); return mat2(cs, -si, si, cs); }

#define SHARP_X 4.0
#define SHARP_Y 4.0

void main() {
	vec2 p = fragTexture * 2.0 - 1.0;

  float rotZ = PI * 0.25;
  p *= rot(rotZ);

  float a = atan(p.y, p.x);
  float r = pow(pow(p.x * p.x, SHARP_X) + pow(p.y * p.y, SHARP_Y), 1.0 / 8.0);
  
  // index texture by (animated inverse) radious and angle
  vec2 uv = vec2( 0.3 / r + 0.2 * time, a / PI);

  vec4 color = vec4(0.5, 0.3, 0.6, 0.0);
  
  if (fragTexture.y > 0.5) {
    float stripX = mod(uv.y, 0.1);
    if (stripX > 0.0 && stripX < 0.005) {
      color.a = cos(uv.x * 2.0) * 6.0;
    }

    float stripX2 = 0.1 + mod(uv.y, 0.2);
    if (stripX2 > 0.15 && stripX2 < 0.155) {
      color.a = sin(uv.x) * 4.0;
    }
  }

  // color.xyz *= r; // darken at the center   
	gl_FragColor = color;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'time'],
};
