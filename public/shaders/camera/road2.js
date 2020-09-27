import { funcMap, PI } from '../utils';

const vertex = `
attribute vec2 texture;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

uniform float time;
uniform float roadLength;

uniform vec3 amplitude;
uniform vec3 frequence;

${funcMap}
${PI}

float nsin(float val) {
  return sin(val) * 0.5 + 0.5;
}

vec3 getDistortion(float progress, vec3 frequence, vec3 amplitude, float time) {
  float movementProgressFix = 0.02;
  float X = cos(progress * PI * frequence.x + time)
    * amplitude.x - cos(movementProgressFix * PI * frequence.x + time) * amplitude.x;
  float Y = nsin(progress * PI * frequence.y + time)
    * amplitude.y - nsin(movementProgressFix * PI * frequence.y + time)* amplitude.y;
  float Z = nsin(progress * PI * frequence.z + time)
    * amplitude.z - nsin(movementProgressFix * PI * frequence.z + time)* amplitude.z;
  return vec3(X, Y, Z);
}

void main() {
  gl_PointSize = 2.0;

  vec3 position = vec3(texture.x * 2.0 - 1.0, 0.0, texture.y * roadLength);
  vec3 transformed = position.xyz;

  vec3 distortion  = getDistortion((transformed.z + roadLength / 2.0) / roadLength);

  transformed.x += distortion.x;
  transformed.z += distortion.y;
  transformed.y += -1.0 * distortion.z;  
  
  gl_Position = projection * view * model * vec4(transformed, 1.0);
}
`;

const fragment = `
precision mediump float;

void main() {
  gl_FragColor = vec4(1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['texture'],
  uniforms: ['projection', 'model', 'view', 'time', 'roadLength', 'frequence', 'amplitude'],
};
