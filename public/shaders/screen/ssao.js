import { PI } from '../utils';

import vertex from './basicVertex';

export const NUM_SAMPLES = 64;

// https://github.com/spite/Wagner/blob/master/fragment-shaders/ssao-simple-fs.glsl

const fragment = `
precision mediump float;
#define NUM_SAMPLES ${NUM_SAMPLES}
${PI}

varying vec2 fragTexture;

uniform sampler2D textureMap; // depth map
uniform vec2 resolution;
uniform float near;
uniform float far;
uniform float strength;
uniform float radius; // 5.0

float width = resolution.x; //texture width
float height = resolution.y; //texture height

float aoclamp = 0.125; //depth clamp - reduces haloing at screen edges
bool noise = false; //use noise instead of pattern for sample dithering
float noiseamount = 0.0002; //dithering amount

float diffarea = 0.3; //self-shadowing reduction
float gdisplace = 0.4; //gauss bell center //0.4

vec2 rand(vec2 coord) {
  float noiseX = ((fract(1.0-coord.s*(width/2.0))*0.25)+(fract(coord.t*(height/2.0))*0.75))*2.0-1.0;
  float noiseY = ((fract(1.0-coord.s*(width/2.0))*0.75)+(fract(coord.t*(height/2.0))*0.25))*2.0-1.0;

  if (noise) {
    noiseX = clamp(fract(sin(dot(coord, vec2(12.9898,78.233))) * 43758.5453),0.0,1.0)*2.0-1.0;
    noiseY = clamp(fract(sin(dot(coord, vec2(12.9898,78.233)*2.0)) * 43758.5453),0.0,1.0)*2.0-1.0;
  }
  return vec2(noiseX,noiseY)*noiseamount;
}

float readDepth(vec2 coord) {
  float z_b = texture2D(textureMap, coord).x;
  float z_n = 2.0 * z_b - 1.0;
  return (2.0 * near) / (far + near - z_n * (far-near));
}

int compareDepthsFar(float depth1, float depth2) {
  float garea = 2.0; //gauss bell width
  float diff = (depth1 - depth2)*100.0; //depth difference (0-100)
  //reduce left bell width to avoid self-shadowing
  if (diff<gdisplace) {
    return 0;
  } else {
    return 1;
  }
}

float compareDepths(float depth1, float depth2) {
  float garea = 2.0; //gauss bell width
  float diff = (depth1 - depth2)*100.0; //depth difference (0-100)
  //reduce left bell width to avoid self-shadowing
  if (diff < gdisplace) {
    garea = diffarea;
  }

  float gauss = pow(2.7182,-2.0*(diff-gdisplace)*(diff-gdisplace)/(garea*garea));
  return gauss;
}

float calAO(float depth,float dw, float dh) {
  float dd = (1.0-depth)*radius;

  float temp = 0.0;
  float temp2 = 0.0;
  float coordw = fragTexture.x + dw*dd;
  float coordh = fragTexture.y + dh*dd;
  float coordw2 = fragTexture.x - dw*dd;
  float coordh2 = fragTexture.y - dh*dd;

  vec2 coord = vec2(coordw , coordh);
  vec2 coord2 = vec2(coordw2, coordh2);

  float cd = readDepth(coord);
  int far = compareDepthsFar(depth, cd);
  temp = compareDepths(depth, cd);
  //DEPTH EXTRAPOLATION:
  if (far > 0) {
    temp2 = compareDepths(readDepth(coord2),depth);
    temp += (1.0-temp)*temp2;
  }

  return temp;
}

void main(void) {
  vec2 noise = rand(fragTexture);
  float depth = readDepth(fragTexture);

  float w = (1.0 / width)/clamp(depth,aoclamp,1.0)+(noise.x*(1.0-noise.x));
  float h = (1.0 / height)/clamp(depth,aoclamp,1.0)+(noise.y*(1.0-noise.y));

  float pw = 0.0;
  float ph = 0.0;

  float ao = 0.0;

  float dl = PI * (3.0 - sqrt(5.0));
  float dz = 1.0 / float(NUM_SAMPLES);
  float l = 0.0;
  float z = 1.0 - dz/2.0;

  for (int i = 0; i < NUM_SAMPLES; i++) {
    float r = sqrt(1.0 - z);

    pw = cos(l) * r;
    ph = sin(l) * r;
    ao += calAO(depth,pw*w,ph*h);
    z = z - dz;
    l = l + dl;
  }

  ao /= float(NUM_SAMPLES);
  ao *= strength;
  ao = 1.0 - ao;

  vec3 final = vec3(ao);
  gl_FragColor = vec4(final,1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'radius', 'resolution', 'near', 'far', 'strength'],
};
