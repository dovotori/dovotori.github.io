export const funcRand = `
// between 0 - 1
float rand(vec2 n) {
  return fract(sin(dot(n.xy, vec2(12.9898, 78.233))) * 43758.5453);
}
`;

export const funcRandRange = `
${funcRand}
float randomRange(vec2 seed, float min, float max) {
	return min + rand(seed) * (max - min);
}
`;

export const funcRandFloat = `
float randFloat(float n){ return fract(sin(n) * 43758.5453123); }
`;

export const randRGBA = `
#define PHI 1.61803398874989484820459

float goldNoise(vec2 xy, float seed) {
  return fract(tan(distance(xy * PHI, xy) * seed) * xy.x);
}

vec4 randRGBA (vec2 nn, float time) {
  vec2 n = nn; 
  return vec4(
    goldNoise(n, fract(time) + 1.0), // r
    goldNoise(n, fract(time) + 2.0), // g
    goldNoise(n, fract(time) + 3.0), // b
    1.0);
}
`;
