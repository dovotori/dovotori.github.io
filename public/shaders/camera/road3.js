import { PI } from '../utils';

const vertex = `
attribute vec3 position;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

uniform float time;
uniform float roadLength;

uniform vec3 amplitude;
uniform vec3 frequence;

varying vec3 fragPosition;
varying float depth;

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
  vec3 transformed = position.xyz;
  
  fragPosition = position;
  depth = 1.0 - (transformed.z / roadLength);

  vec3 distortion  = getDistortion(transformed.z / roadLength, frequence, amplitude, time);

  transformed.x += distortion.x;
  transformed.z += distortion.y;
  transformed.y += -1.0 * distortion.z;  
  
  gl_Position = projection * view * model * vec4(transformed, 1.0);
}
`;

const fragment = `
precision mediump float;

varying vec3 fragPosition;
varying float depth;

void main() {
  vec3 roadColor1 = vec3(13.0 / 255.0, 7.1 / 255.0, 32.9 / 255.0);
  vec3 roadColor2 = vec3(193.0 / 255.0, 2.0 / 255.0, 117.0 / 255.0);

  vec3 color = roadColor1;

  float lineWidth = 0.05;

  float relX = fragPosition.x + 1.0 * 0.5;

  // middle line
  if (
    (relX > 0.5 - lineWidth && relX < 0.5 + lineWidth)
    || relX > 2.5 - lineWidth
    || relX < -1.5 + lineWidth
  ) {
    color = roadColor2;
  }

  gl_FragColor = vec4(color, depth);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position'],
  uniforms: ['projection', 'model', 'view', 'time', 'roadLength', 'frequence', 'amplitude'],
};
