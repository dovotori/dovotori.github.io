import { getFogAmount, fogFactorExp2 } from '../utils/fog';
import { locations, getNaturalHeight } from '../utils/terrain';

const vertex = `
attribute vec3 position;
attribute vec2 texture;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

uniform sampler2D textureMap;
uniform vec2 moving;
uniform float fogStart;
uniform float fogEnd;

varying float fragHeight;
varying vec3 fragColor;
varying float fragFog;

${getFogAmount}

${getNaturalHeight}

void main() {
  gl_PointSize = 4.0;
  vec3 tranformed = position;

  if (position.y == 0.0) {
    vec2 coord = position.xz + moving;
    tranformed.y = getNaturalHeight(coord);
  }
  fragHeight = tranformed.y;
  fragColor = vec3(position.xz, 0.0);
  
  vec4 pos = projection * view * model * vec4(tranformed, 1.0);
  fragFog = getFogAmount(pos.xyz, fogStart, fogEnd);
  gl_Position = pos;
}
`;

const fragment = `
precision mediump float;

uniform vec4 fogColor;

varying float fragHeight;
varying float fragFog;
varying vec3 fragColor;

vec3 colorA = vec3(1.0,0.0,0.0);
vec3 colorB = vec3(0.0,0.0,1.0);

vec3 getColor(float height) {
  return mix(colorA, colorB, height);
}

#define FOG_DENSITY 0.3
${fogFactorExp2}

float getFogAmount() {
  float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
  return fogFactorExp2(fogDistance, FOG_DENSITY);
}

void main() {
  // vec3 color = getColor(fragHeight);
  vec3 color = vec3(fragHeight);
  gl_FragColor = mix(vec4(color, 1.0), fogColor, fragFog);
  // gl_FragColor = mix(vec4(color, 1.0), fogColor, getFogAmount());
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: [
    'projection',
    'model',
    'view',
    'textureMap',
    'moving',
    'fogStart',
    'fogEnd',
    'fogColor',
  ].concat(locations),
};
