import { addLightLocations, funcLightsColor, uniformLights } from "../utils/light";
import { getNaturalHeight, getNormale, locations } from "../utils/terrain";

const vertex = `
attribute vec3 position;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;

varying vec3 fragPosition;
varying vec3 fragClipPosition;
varying vec3 fragColor;
varying vec2 fragTexture;
varying vec3 fragNormale;

${getNaturalHeight}
${getNormale}

void main() {
  vec3 tranformed = position;

  if (position.y == 0.0) {
    vec2 coord = position.xz + moving;
    tranformed.y = getNaturalHeight(coord);
  }

  fragNormale = normalMatrix * getNormale(position, tranformed);
  fragTexture = position.xz * 0.5 + 0.5;
  fragPosition = tranformed;
  fragColor = vec3(position.xz, 0.0);
  
  vec4 pos = projection * view * model * vec4(tranformed, 1.0);
  fragClipPosition = pos.xyz;
  gl_Position = pos;
}
`;

const NB_COLORS = 8;

const fragment = `
precision mediump float;

uniform float reflectPass;
uniform float refractPass;
uniform float waterLevel;

${uniformLights}

varying vec3 fragPosition;
varying vec3 fragColor;
varying vec2 fragTexture;
varying vec3 fragNormale;
varying vec3 fragClipPosition;

${funcLightsColor}

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

#define THRESHOLD 0.01

void main() {
  if (reflectPass > 0.5 || refractPass > 0.5) {
    if (
      (reflectPass > 0.5 && fragPosition.y < waterLevel)
      || (refractPass > 0.5 && fragPosition.y > waterLevel)
      || fragPosition.x >= 1.0 - THRESHOLD
      || fragPosition.x <= -1.0 + THRESHOLD
      || fragPosition.z >= 1.0 - THRESHOLD
      || fragPosition.z <= -1.0 + THRESHOLD 
    ) {
      discard;
    }
  }

  vec3 color = getColor(fragPosition.y);

   vec3 lightColor = funcLightsColor(
    vec3(1.0),
    color,
    vec3(0.0),
    fragNormale,
    fragPosition
  );

  vec4 finalColor = vec4(lightColor, 1.0);
  float fogAmount = getFogAmount(fragClipPosition, fogStart, fogEnd);
  if (reflectPass > 0.5 || refractPass > 0.5) {
    fogAmount = 0.0; // no fog for clipping
  }
  finalColor = mix(finalColor, fogColor, fogAmount);
  gl_FragColor = finalColor;
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position"],
  uniforms: [
    "projection",
    "model",
    "view",
    "normalMatrix",
    "reflectPass",
    "refractPass",
    "waterLevel",
  ]
    .concat(locations)
    .concat(Array.from({ length: NB_COLORS }).map((_, i) => `colors[${i}]`))
    .concat(addLightLocations()),
};
