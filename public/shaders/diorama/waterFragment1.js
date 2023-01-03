import { getFogAmount, fogUniforms } from "../utils/fog";
import { uniformLights, funcLightsColor } from "../utils/light";

export default `
precision mediump float;

uniform sampler2D reflectMap;
uniform sampler2D refractMap;
uniform sampler2D normaleMap;
uniform sampler2D distortionMap;
uniform sampler2D depthMap;

${uniformLights}
${fogUniforms}

varying vec3 fragPosition;
varying vec3 fragColor;
varying vec2 fragTexture;
varying vec3 fragNormale;
varying vec4 fragClipPosition;
varying vec3 fragEyeDir;
varying vec2 fragMoving;

${getFogAmount}
${funcLightsColor}

void main() {
  vec3 waterColor = vec3(0.5, 0.6, 0.75);

  vec2 tilingCoor = fragMoving + fragTexture * 4.0;

  float correction = 0.205; // ?? coor to low
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

  vec4 reflectColor = texture2D(reflectMap, reflectCoor);
  vec4 refractColor = texture2D(refractMap, refractCoor);

  vec2 normCoor = (tilingCoor * 2.0) + (fragMoving * 0.2);

  vec3 normale = texture2D(normaleMap, normCoor).xyz;
  normale = normalize(normale);

  if (fragNormale.y <= 0.5) {
    normale = fragNormale;
  }

  vec3 lightColor = funcLightsColor(
    waterColor,
    waterColor,
    vec3(1.0),
    normale,
    fragPosition
  );

  vec4 color = mix(refractColor, reflectColor, fresnel);
  float fogAmount = getFogAmount(fragClipPosition.xyz, fogStart, fogEnd);
  vec4 finalColor = color + vec4(lightColor, 0.0); // spec light how to add ?
  finalColor = mix(finalColor, fogColor, fogAmount);
  // finalColor = vec4(normale, 1.0);

  float depth = texture2D(depthMap, ndc.xy).r;

  gl_FragColor = finalColor;
  
}
`;
