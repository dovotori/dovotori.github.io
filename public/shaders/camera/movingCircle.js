import { funcMap, PI } from '../utils';

const vertex = `
attribute float index;
attribute float offset;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform int maxfrequency;
uniform int length;
uniform int count;
uniform float time;
uniform vec2 mouse;

${funcMap}
${PI}

#define SIZE 1.0

varying vec4 color;

void main() {
  float radian = funcMap(index, 0.0, float(length), 0.0, PI * 2.0);
  
  float amplitude = 0.05;
  float speed = funcMap(offset, 0.0, float(count), 4.0, 10.0);
  float shapeX = 0.6 * mouse.x;
  float shapeY = 0.4 * mouse.y;
  float variation = sin(index * shapeX + time * speed) * amplitude;
  variation += cos(index * shapeY + time * speed) * amplitude;
  // variation *= mouse.x;
  // variation *= 0.5 + funcMap(offset, 0.0, float(count), -.5, .5);

  float x = cos(radian) * (SIZE + variation);
  float y = sin(radian) * (SIZE + variation);
  float z = offset * mouse.x * 0.1;

  vec3 position = vec3(x, y, z);
  float opacity = funcMap(offset, 0.0, float(count), 0.0, 1.0);
  color = vec4(1.0 - y, .8, 1.0, 1.0 - opacity);
  
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

varying vec4 color;

void main() {
  gl_FragColor = color;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['index', 'offset'],
  uniforms: ['projection', 'model', 'view', 'length', 'count', 'time', 'mouse'],
};
