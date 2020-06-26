import { PI, TWO_PI } from './index';

export const rect = `
float rect(vec2 uv, vec2 start, vec2 size) {
  vec2 leftTop = step(start, uv);
  // vec2 bottomRight = step(vec2(1.0 - (x + w), 1.0 - (y + h)), 1.0 - uv);
  vec2 bottomRight = step(vec2(1.0) - (start + size), 1.0 - uv);
  return leftTop.x * leftTop.y * bottomRight.x * bottomRight.y;
}
`;

export const circle = `
float circle(vec2 uv , vec2 center, float radius){
  vec2 dist = uv - center;
	return 1.0 - smoothstep(radius - (radius * 0.01), radius + (radius * 0.01), dot(dist, dist) * 4.0);
}`;

export const distanceField = `
float distanceField(vec2 uv, float size, float distorsion) {
  // Remap the space to -1. to 1.
  vec2 st = uv * 2.0 - 1.0;

  // Make the distance field
  float d = length( abs(st) - distorsion ); 
  // float d = length( min(abs(st) - distorsion, 0.0) );
  // float d = length( max(abs(st) - distorsion, 0.0) ); 

  return fract(d * size);
}`;

export const polar = `
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
}`;

export const polygon = `
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
}`;
