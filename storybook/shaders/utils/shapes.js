import { PI, TWO_PI } from './index';
import { funcNoise, funcPnoise, funcSnoise } from './noise';

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
	return 1.0 - smoothstep(
    radius - (radius * 0.01), radius + (radius * 0.01), dot(dist, dist) * 4.0
  );
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

float polygon(vec2 uv, int nb, float size) {
  float d = 0.0;

  // Remap the space to -1. to 1.
  vec2 st = uv  * 2.0 - 1.0;

  // Number of sides of your shape
  int N = nb;

  // Angle and radius from the current pixel
  float a = atan(st.x, st.y) + PI;
  float r = TWO_PI / float(N);

  // Shaping function that modulate the distance
  d = cos(floor(0.5 + a / r) * r - a) * length(st) * (1.0 / size);

  return 1.0 - smoothstep(0.4, 0.41, d);
}`;

export const concentricCircles = `
float concentricCircles(vec2 uv, float distance, float step) {
  vec2 center = 2.0 * (uv - vec2(0.5));
  float r = length(center);
  float a = atan(center.y, center.x);
  return pow(max(0.0, sin(step * log(r))), distance);
}
`;

export const fluid = `
${PI}
vec4 fluid(vec2 uv, vec2 scale, float time) {
  float v = 0.0;
    vec2 c = uv * scale - scale / 2.0;
    v += sin((c.x + time));
    v += sin((c.y + time) / 2.0);
    v += sin((c.x + c.y + time)/2.0);
    c += scale / 2.0 * vec2(sin(time / 3.0), cos(time / 2.0));
    v += sin(sqrt(c.x * c.x + c.y * c.y + 1.0) + time);
    v = v/2.0;
    vec3 col = vec3(1.0, sin(PI * v), cos(PI * v));
    return vec4(col * 0.5 + 0.5, 1.0);
}
`;

export const planet = `
${PI}
${funcNoise}
${funcPnoise}
${funcSnoise}
float clouds( vec2 coord ) {
  // standard fractal
  float n = snoise(vec3(coord, 1.0));
  n += 0.5 * snoise(vec3(coord * 2.0, 1.0));
  n += 0.25 * snoise(vec3(coord * 4.0, 1.0));
  n += 0.125 * snoise(vec3(coord * 8.0, 1.0));
  n += 0.0625 * snoise(vec3(coord * 16.0, 1.0));
  n += 0.03125 * snoise(vec3(coord * 32.0, 1.0));
  n += 0.03125 * snoise(vec3(coord * 32.0, 1.0));
  return n;
}

vec4 planet(vec2 uv, float size, vec2 rotation) {
  vec2 norm = 2.0 * uv - 1.0;

  float r = length(norm) / size;
  float phi = atan(norm.y, norm.x);
  
  // spherize
  r = 2.0 * asin(r) / PI;
  
  vec2 coord = vec2(r * cos(phi), r * sin(phi));
  coord = coord / 2.0 + 0.5;

  coord += rotation;
  float n = clouds(coord * 3.0);
  
  vec2 position = uv - 0.5;
  float len = length(position);
  
  // block out some terrain
  float terrain = smoothstep(0.1, 0.0, n); 
  
  // green
  vec3 terrainColor = vec3(76.0 / 255.0, 147.0 / 255.0, 65.0 / 255.0); 
  terrainColor = mix(
    vec3(131.0 / 255.0, 111.0 / 255.0, 39.0 / 255.0),
    terrainColor,
    smoothstep(0.2, .7, 1.0 - n)
  );
  
  //mix in brown edge
  terrainColor = mix(
    vec3(94.0 / 255.0, 67.0 / 255.0, 31.0 / 255.0), 
    terrainColor, 
    smoothstep(0.0, 0.18, n)
  );
  terrainColor += n * 0.3;
  
  // water
  vec3 color = vec3(81.0 / 255.0, 121.0 / 255.0, 181.0 / 255.0); 
  color -= (1.0 - n * 4.0) * 0.03;
  
  // mix terrain with water
  color = mix(terrainColor, color, terrain); 
  
  // anti-alias
  color *= smoothstep(0.5 * size, 0.495 * size, len);
  // shadow
  color *= smoothstep(0.625 * size, 0.25 * size, len);
  color = clamp(color, 0.0, 1.0);
  float opacity = 1.0;
  if (color == vec3(0.0)) {
    opacity = 0.0;
  }
  return vec4(color, opacity);
}
`;
