import { fogLocations, fogUniforms, getFogAmount } from "../utils/fog";
import { funcInstancing } from "../utils/instancing";
import { funcPBR, locationsPBR } from "../utils/pbr";
import { getNaturalHeight, locations } from "../utils/terrain";

const vertex = `
attribute vec3 position;
attribute vec3 normale;
attribute vec2 texture;
attribute vec3 offset;
attribute vec3 acolor;
attribute float size;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;
uniform float waterLevel;

varying vec3 fragColor;
varying float fragFog;
varying vec3 fragNormale;
varying vec3 fragPosition;

${getNaturalHeight}

${funcInstancing}

void main() {
  vec3 fixedPos = getFixedPosition(offset);
  if (fixedPos.y < waterLevel) {
    fixedPos = vec3(0.0, 100.0, 0.0); // we hide it
  }
  vec4 terrainPos = getTerrainPosition(fixedPos, position);
  vec4 pos = projection * view * terrainPos;
  gl_Position = pos;

  fragPosition = terrainPos.xyz;
  fragColor = acolor;
  fragNormale = normalMatrix * normale;
}
`;

const fragment = `
precision mediump float;

uniform vec3 posEye;
${fogUniforms}

varying vec3 fragColor;
varying vec3 fragNormale;
varying vec3 fragPosition;

${funcPBR}
${getFogAmount}

void main() {
  vec3 pbrColor = funcPBR(fragPosition, fragNormale, posEye);
  vec4 finalColor = vec4(mix(fragColor, pbrColor * 4.0, 0.8), 1.0);
  float fogAmount = getFogAmount(fragPosition, fogStart, fogEnd);
  finalColor = mix(finalColor, fogColor, fogAmount);
  gl_FragColor = finalColor;
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture", "normale", "offset", "acolor", "size"],
  uniforms: [
    "projection",
    "model",
    "view",
    "normalMatrix",
    "fogStart",
    "fogEnd",
    "fogColor",
    "posEye",
    "waterLevel",
  ]
    .concat(locations)
    .concat(fogLocations)
    .concat(locationsPBR),
};
