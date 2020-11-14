import { anothorNoise } from './noise';

export const getNaturalHeight = `
${anothorNoise}

#define NB_OCTAVES 10
uniform float lacunarity; // frequency of noise octave
uniform float persistance; // influence of noise octave

float getNaturalHeight(vec2 coor) {
  float result = 0.0;
  float allAmpli = 0.0;
  for(int i = 0; i < NB_OCTAVES; i += 1) {
    float frequency = pow(lacunarity, float(i));
    float amplitude = pow(persistance, float(i));
    result += noise(coor * vec2(frequency)) * amplitude;
    allAmpli += amplitude;
  }
  return result / allAmpli;
}`;

export const locations = ['octaves', 'lacunarity', 'persistance'];
