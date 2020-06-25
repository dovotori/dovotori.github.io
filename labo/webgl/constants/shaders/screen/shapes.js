import { PI, TWO_PI } from '../utils';

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

float rect(vec2 uv, vec2 start, vec2 size) {
  vec2 leftTop = step(start, uv);
  // vec2 bottomRight = step(vec2(1.0 - (x + w), 1.0 - (y + h)), 1.0 - uv);
  vec2 bottomRight = step(vec2(1.0) - (start + size), 1.0 - uv);
  return leftTop.x * leftTop.y * bottomRight.x * bottomRight.y;
}

float circle(vec2 uv , vec2 center, float radius){
  vec2 dist = uv - center;
	return 1.0 - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(dist, dist) * 4.0);
}

float distanceField(vec2 uv, float size, float distorsion) {
  // Remap the space to -1. to 1.
  vec2 st = uv * 2.0 - 1.0;

  // Make the distance field
  float d = length( abs(st) - distorsion ); 
  // float d = length( min(abs(st) - distorsion, 0.0) );
  // float d = length( max(abs(st) - distorsion, 0.0) ); 

  return fract(d * size);
}

float polar(vec2 uv, vec2 center, float size) {
  vec2 pos = center - uv;

  float r = length(pos) * size;
  float a = atan(pos.y, pos.x);

  float f = 0.0;
  f = cos(a * 3.0);
  // f = abs(cos(a * 3.0));
  // f = abs(cos(a * 2.5)) * 0.5 + 0.3;
  // f = abs(cos(a * 12.0) * sin(a * 3.0)) * 0.8 + 0.1;
  // f = smoothstep(-0.5, 1.0, cos(a * 10.0)) * 0.2 + 0.5;

  return 1.0 - smoothstep(f, f + 0.02, r);
}

${PI}${TWO_PI}

float polygon(vec2 uv, int nb) {
  float d = 0.0;

  // Remap the space to -1. to 1.
  vec2 st = uv  * 2.0 - 1.0;

  // Number of sides of your shape
  int N = nb;

  // Angle and radius from the current pixel
  float a = atan(st.x, st.y) + PI;
  float r = TWO_PI / float(N);

  // Shaping function that modulate the distance
  d = cos(floor(0.5 + a / r) * r - a) * length(st);

  return 1.0 - smoothstep(0.4, 0.41, d);
}

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
