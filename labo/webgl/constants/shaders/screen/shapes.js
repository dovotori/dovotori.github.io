import { rect, circle, polar, polygon, distanceField } from '../utils/shapes';

const vertex = `
attribute vec3 position;
attribute vec2 texture;

varying vec2 fragTexture;

void main() {
  fragTexture = texture;
  gl_Position = vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

uniform float time;

varying vec2 fragTexture;

void main() {
  vec3 color = vec3(0.0);
  
  // vec3 red = vec3(1.0, 0.0, 0.0);
  // vec3 green = vec3(0.0, 1.0, 0.0);
  // vec3 blue = vec3(0.0, 0.0, 1.0);

  // float rect1 = rect(fragTexture, vec2(0.1, 0.1), vec2(0.1, 0.1));
  // float rect2 = rect(fragTexture, vec2(0.15, 0.15), vec2(0.1, 0.1));
  // float circle1 = circle(fragTexture, vec2(0.1, 0.6), 0.1);

  // if (rect1 == 1.0) {
  //   color = red;
  // }
  // if (rect2 == 1.0) {
  //   color = green;
  // }
  // if (circle1 == 1.0) {
  //   color = blue;
  // }


  float dfield1 = distanceField(fragTexture, 10.0, 40.0);
  // color = vec3(dfield1);
  float polar1 = polar(fragTexture, vec2(0.6, 0.2), 10.0);
  // color = vec3(polar1);
  float polygon1 = polygon(fragTexture, 3);
  color = vec3(polygon1);

  gl_FragColor = vec4(vec3(color), 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['texture'],
  uniforms: ['time'],
};
