import { getFogAmount } from '../utils/fog';
import { funcWave } from '../utils/terrain';
import { uniformLights, addLightLocations, funcLightsColor } from '../utils/light';

const vertex = `
attribute vec3 position;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;

uniform vec2 moving;
uniform float time;
uniform float fogStart;
uniform float fogEnd;
uniform float waterLevel;
uniform vec2 gridSize;
uniform vec3 posEye;

varying vec3 fragPosition;
varying vec3 fragColor;
varying float fragFog;
varying vec2 fragTexture;
varying vec2 fragMoving;
varying vec3 fragNormale;
varying vec4 fragClipPosition;
varying vec3 fragEyeDir;

${getFogAmount}

${funcWave}

#define THRESHOLD 0.005

void main() {
  gl_PointSize = 4.0;
  vec3 transformed = position;

  vec3 normale = vec3(0.0);
  if (position.y == 0.0) {
    vec2 coord = position.xz;

    // for normale
    vec3 tangent = vec3(1.0, 0.0,0.0);
		vec3 binormal = vec3(0.0, 0.0, 1.0);

    Wave wave1 = funcWave(coord, 0.1, 0.1, vec2(1.0, 0.0), moving, tangent, binormal);
    Wave wave2 = funcWave(coord, 0.05, 0.2, vec2(0.0, 1.0), moving, wave1.tangent, wave1.binormal);
    
    transformed = wave1.position + wave2.position;
    transformed *= vec3(0.5, 1.0, 0.5); // rescale wave
    transformed += vec3(0.0, waterLevel, 0.0); // water level
    transformed *= vec3(1.0 - THRESHOLD, 1.0, 1.0 - THRESHOLD); // rescale 
    normale = vec3(0.0, 1.0, 0.0); // normalize(cross(wave2.tangent, wave2.binormal));
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

  fragNormale = normalMatrix * normale;
  fragTexture = position.xz * 0.5 + 0.5;
  fragPosition = transformed;
  fragColor = vec3(position.xz, 0.0);
  fragMoving = moving;
  
  vec4 worldPos = model * vec4(transformed, 1.0);
  fragClipPosition = projection * view * worldPos;
  fragFog = getFogAmount(fragClipPosition.xyz, fogStart, fogEnd);

  fragEyeDir = posEye - worldPos.xyz;

  gl_Position = fragClipPosition;
}
`;

const fragment = `
precision mediump float;

uniform vec4 fogColor;
uniform sampler2D reflectMap;
uniform sampler2D refractMap;
uniform sampler2D normaleMap;
uniform sampler2D distortionMap;

${uniformLights}

varying float fragFog;
varying vec3 fragPosition;
varying vec3 fragColor;
varying vec2 fragTexture;
varying vec3 fragNormale;
varying vec4 fragClipPosition;
varying vec3 fragEyeDir;
varying vec2 fragMoving;

${funcLightsColor}

void main() {
  float fogAmount = fragFog;

  vec3 waterColor = vec3(0.5);

  vec2 tilingCoor = fragMoving + fragTexture * 4.0;

  float correction = 0.203; // ?? coor to low
  vec3 ndc = (fragClipPosition.xyz / fragClipPosition.w) / 2.0 + 0.5;
  vec2 reflectCoor = vec2(ndc.x, 1.0 - ndc.y + correction);
  vec2 refractCoor = vec2(ndc.x, ndc.y);

  float fresnel = pow(dot(normalize(fragEyeDir), normalize(fragNormale)), 2.0);

  vec2 distortionCoor1 = vec2(tilingCoor.x + fragMoving.x, tilingCoor.y);
  vec2 distortionCoor2 = vec2(tilingCoor.x, tilingCoor.y + fragMoving.y);
  vec2 distortion1 = texture2D(distortionMap, distortionCoor1).rg * 2.0 - 1.0;
  vec2 distortion2 = texture2D(distortionMap, distortionCoor2).rg * 2.0 - 1.0;
  vec2 distortion = distortion1 + distortion2;
  distortion *= 0.004; // distorsion strength

  reflectCoor += distortion;
  refractCoor += distortion;

  reflectCoor = clamp(reflectCoor, vec2(0.0001), vec2(0.9999));
  refractCoor = clamp(refractCoor, vec2(0.0001), vec2(0.9999));

  vec4 reflectColor = texture2D(reflectMap, reflectCoor) * 0.5;
  vec4 refractColor = texture2D(refractMap, refractCoor);

  vec4 color = mix(reflectColor, refractColor, fresnel);

  vec2 normCoor = (tilingCoor * 2.0) + (fragMoving * 0.1);

  vec3 normale = texture2D(normaleMap, normCoor).xyz;
  // normale = normale * 2.0 - 1.0;
  normale = normalize(normale);

  if (fragNormale.y <= 0.99) {
    normale = fragNormale;
  }

  vec3 lightColor = funcLightsColor(
    waterColor,
    waterColor,
    vec3(1.0),
    normale,
    fragPosition
  );

  vec4 finalColor = color + vec4(lightColor, 0.0);
  finalColor = mix(finalColor, fogColor, fogAmount);

  gl_FragColor = finalColor;
  
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
    'normalMatrix',
    'moving',
    'fogStart',
    'fogEnd',
    'fogColor',
    'gridSize',
    'waterLevel',
    'reflectMap',
    'refractMap',
    'normaleMap',
    'distortionMap',
    'posEye',
    'time',
  ].concat(addLightLocations()),
};
