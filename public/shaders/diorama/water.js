import { fogLocations } from "../utils/fog";
import { addLightLocations } from "../utils/light";
import { funcWave } from "../utils/terrain";
import fragment from "./waterFragment1";

const vertex = `
attribute vec3 position;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;

uniform vec2 moving;
uniform float time;
uniform float waterLevel;
uniform vec2 gridSize;
uniform vec3 posEye;

varying vec3 fragPosition;
varying vec3 fragColor;
varying vec2 fragTexture;
varying vec2 fragMoving;
varying vec3 fragNormale;
varying vec4 fragClipPosition;
varying vec3 fragEyeDir;

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

    Wave wave1 = funcWave(
      coord, 0.1, 0.1, vec2(1.0, 0.0), vec2(time), tangent, binormal
    );
    Wave wave2 = funcWave(
      coord, 0.05, 0.2, vec2(0.0, 1.0), vec2(time), wave1.tangent, wave1.binormal
    );
    
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
  fragMoving = moving + time;
  
  vec4 worldPos = model * vec4(transformed, 1.0);
  fragClipPosition = projection * view * worldPos;

  fragEyeDir = posEye - worldPos.xyz;

  gl_Position = fragClipPosition;
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
    "moving",
    "gridSize",
    "waterLevel",
    "reflectMap",
    "refractMap",
    "normaleMap",
    "distortionMap",
    "depthMap",
    "posEye",
    "time",
  ]
    .concat(fogLocations)
    .concat(addLightLocations()),
};
