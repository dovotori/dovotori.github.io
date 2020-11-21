import { getFogAmount } from '../utils/fog';
import { funcWave } from '../utils/terrain';

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

${funcWave}

void main() {
  gl_PointSize = 4.0;
  vec3 tranformed = position;

  vec3 normale = vec3(0.0);
  if (position.y == 0.0) {
    vec2 coord = position.xz;

    // for normale
    vec3 tangent = vec3(1.0, 0.0,0.0);
		vec3 binormal = vec3(0.0, 0.0, 1.0);

    Wave wave1 = funcWave(coord, 0.5, 0.1, vec2(1.0, 0.0), moving, tangent, binormal);
    Wave wave2 = funcWave(coord, 0.25, 0.2, vec2(0.0, 1.0), moving, wave1.tangent, wave1.binormal);
    
    tranformed = wave1.position + wave2.position;
    normale = normalize(cross(wave2.tangent, wave2.binormal));
  }
  if (position.x == 1.0) {
    normale = vec3(1.0, 0.0, 0.0);
  } else if (position.x == -1.0) {
    normale = vec3(-1.0, 0.0, 0.0);
  } else if (position.z == 1.0) {
    normale = vec3(0.0, 0.0, 1.0);
  } else if (position.z == -1.0) {
    normale = vec3(0.0, 0.0, -1.0);
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

const fragment = `
precision mediump float;

uniform vec4 fogColor;
uniform sampler2D textureMap;

varying float fragFog;
varying vec3 fragPosition;
varying vec3 fragColor;
varying vec2 fragTexture;
varying vec3 fragNormale;

void main() {
  float fogAmount = fragFog;

  vec3 posLum = vec3(4.0,4.0,4.0);
  vec3 N = normalize(fragNormale);
  vec3 L = normalize(posLum - fragPosition);
  float lambertian = max(dot(N, L), 0.0);

  vec4 finalColor = vec4(0.0, fragPosition.y * 20.0, 1.0, 1.0);
  // finalColor.xyz *= (lambertian + 0.4);

  // vec4 finalColor = vec4(mix(color, noiseColor, 0.1), 1.0);
  // finalColor = mix(finalColor, fogColor, fogAmount);

  // gl_FragColor = finalColor;
  gl_FragColor = vec4(fragNormale, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position'],
  uniforms: ['projection', 'model', 'view', 'moving', 'fogStart', 'fogEnd', 'fogColor', 'gridSize'],
};
