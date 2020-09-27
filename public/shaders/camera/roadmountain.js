import { PI, funcMap } from '../utils';

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
${funcMap}

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
  
  depth = 1.0 - (transformed.z / roadLength);

  vec3 distortion  = getDistortion(transformed.z / roadLength, frequence, amplitude, time);

  transformed.x += distortion.x;
  transformed.z += distortion.y;
  transformed.y += -1.0 * distortion.z; 
  transformed.y -= 0.01; // place a little lower than road

  float high = 0.0;
  float gapLength = 10.0;
  if (position.x > gapLength) {
    high += funcMap(position.x, 5.0, 120.0, 1.0, 2.0);
  } else if (position.x < -gapLength) {
    high += funcMap(position.x, -120.0, -5.0, 1.0, 2.0);
  }
  if (position.x > gapLength + 2.0) {
    high += (0.2 + cos(position.z * 0.1)) * 0.5;
    high += (0.2 + cos(position.x * 0.1)) * 2.0;
  } else if (position.x < -gapLength + 2.0) {
    high += (0.2 + cos(position.z * 0.1)) * 2.0;
    high += (0.2 + cos(position.x * 0.1)) * 0.5;
  }
  transformed.y += high;

  fragPosition = vec3(high / 4.0);

  gl_Position = projection * view * model * vec4(transformed, 1.0);
}
`;

const fragment = `
precision mediump float;

varying vec3 fragPosition;
varying float depth;

void main() {
  vec3 roadColor1 = vec3(13.0 / 255.0, 7.1 / 255.0, 32.9 / 255.0);
  vec3 color = roadColor1 * (1.0 - fragPosition.y);
  // gl_FragColor = vec4(color, depth);
  gl_FragColor = vec4(fragPosition, depth);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position'],
  uniforms: ['projection', 'model', 'view', 'time', 'roadLength', 'frequence', 'amplitude'],
};
