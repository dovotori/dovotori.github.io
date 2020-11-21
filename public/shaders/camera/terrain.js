import { getFogAmount, fogFactorExp2 } from '../utils/fog';
import { locations, getNaturalHeight } from '../utils/terrain';

const vertex = `
attribute vec3 position;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

uniform vec2 moving;
uniform float fogStart;
uniform float fogEnd;
uniform vec2 gridSize;

varying vec3 fragPosition;
varying vec3 fragColor;
varying float fragFog;
varying vec2 fragTexture;
varying vec3 fragNormale;

${getFogAmount}

${getNaturalHeight}

vec3 computeNormale(vec3 p0, vec3 p1, vec3 p2) {
  return cross(p1 - p0, p2 - p0);
}

vec3 roundNormale(vec3 position, vec2 moving) {
  vec2 betweenPoints = 2.0 / gridSize;

  vec2 coordP0 = position.xz + vec2(betweenPoints.x, 0.0) + moving;
  vec2 coordP1 = position.xz + vec2(betweenPoints.x, 0.0) + moving;
  vec2 coordP2 = position.xz + vec2(0.0, betweenPoints.y) + moving;
  
  vec3 p0 = vec3(0.0, position.y, 0.0);
  vec3 p1 = vec3(betweenPoints.x, getNaturalHeight(coordP1), 0.0);
  vec3 p2 = vec3(0.0, getNaturalHeight(coordP2), betweenPoints.y);

  return normalize(computeNormale(p0, p2, p1));
}

void main() {
  gl_PointSize = 4.0;
  vec3 tranformed = position;

  vec3 normale = vec3(0.0);
  if (position.y == 0.0) {
    vec2 coord = position.xz + moving;
    tranformed.y = getNaturalHeight(coord);
    normale = roundNormale(tranformed, moving);
  }
  if (position.x == 1.0) {
    normale = vec3(1.0 ,0.0, 0.0);
  } else if (position.x == -1.0) {
    normale = vec3(-1.0 ,0.0, 0.0);
  } else if (position.z == 1.0) {
    normale = vec3(0.0 ,0.0, 1.0);
  } else if (position.z == -1.0) {
    normale = vec3(0.0 ,0.0, -1.0);
  }
  fragNormale = normale;
  fragTexture = position.xz * 0.5 + 0.5;
  fragPosition = tranformed;
  fragColor = vec3(position.xz, 0.0);
  
  vec4 pos = projection * view * model * vec4(tranformed, 1.0);
  fragFog = getFogAmount(pos.xyz, fogStart, fogEnd);

  gl_Position = pos;
}
`;

const NB_COLORS = 8;

const fragment = `
precision mediump float;

uniform vec4 fogColor;
uniform sampler2D textureMap;

varying float fragFog;
varying vec3 fragPosition;
varying vec3 fragColor;
varying vec2 fragTexture;
varying vec3 fragNormale;

#define NB_COLORS ${NB_COLORS}
uniform vec3 colors[NB_COLORS];

vec3 getColor(float height) {
  float relHeight = height * float(NB_COLORS);
  vec3 color = colors[0];
  for(int i = 0; i < NB_COLORS; i += 1) {
    if (relHeight > float(i)) {
      float mixFactor = smoothstep(float(i), float(i + 1), relHeight);
      color = mix(colors[i], colors[i + 1], mixFactor);
    }
  }
  return color;
}

#define FOG_DENSITY 0.3
${fogFactorExp2}

float getFogAmount() {
  float fogDistance = gl_FragCoord.z / gl_FragCoord.w;
  return fogFactorExp2(fogDistance, FOG_DENSITY);
}

void main() {
  vec3 color = getColor(fragPosition.y);
  // vec3 color = vec3(fragPosition.y);

  // float modulo = mod(fragHeight, 0.05);
  // if (modulo > 0.0 && modulo < 0.002) {
    // color *= 0.1;
  // }

  // float fogAmount = getFogAmount(); 
  float fogAmount = fragFog;

  // vec3 noiseColor = texture2D(textureMap, fragTexture).xyz;

  vec3 posLum = vec3(4.0,4.0,4.0);
  vec3 N = normalize(fragNormale);
  vec3 L = normalize(posLum - fragPosition);
  float lambertian = max(dot(N, L), 0.0);

  vec4 finalColor = vec4(color, 1.0);
  finalColor.xyz *= (lambertian + 0.4);

  // vec4 finalColor = vec4(mix(color, noiseColor, 0.1), 1.0);
  finalColor = mix(finalColor, fogColor, fogAmount);

  gl_FragColor = finalColor;
  // gl_FragColor = vec4(fragNormale, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position'],
  uniforms: [
    'projection',
    'model',
    'view',
    'textureMap',
    'moving',
    'fogStart',
    'fogEnd',
    'fogColor',
    'gridSize',
  ]
    .concat(locations)
    .concat(Array.from({ length: NB_COLORS }).map((_, i) => `colors[${i}]`)),
};
