import { anothorNoise } from './noise';
import { PI } from '.';

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
    result += noise(coor * frequency) * amplitude;
    allAmpli += amplitude;
  }
  return result / allAmpli;
}`;

export const locations = ['octaves', 'lacunarity', 'persistance'];

export const funcWave = `
// steepness = 0.5; 

${PI}

struct Wave {
  vec3 position;
	vec3 tangent;
	vec3 binormal;
};

Wave funcWave(
  vec2 uv,
  float steepness, // raideur -> steepness prevent looping (replace amplitude) entre 0 et 1
  float wavelength,
  vec2 direction,
  vec2 time,
  vec3 tangent,
  vec3 binormal
) {
  vec2 D = normalize(direction);
	float K = 2.0 * PI / wavelength;
	float C = sqrt(9.8 / K);
  float F = K * (dot(D, uv) - C * time.y);

	float A = steepness / K;

	vec3 p = vec3(uv.x, 0.0, uv.y);
	p.x += D.x * (A * cos(F));
	p.y = A * sin(F);
	p.z += D.y * (A * cos(F));

  // on en profite pour update tangent et binormal
  tangent += vec3(
    -1.0 - D.x * D.x * (steepness * sin(F)),
    D.x * (steepness * cos(F)),
    -D.x * D.y * (steepness * sin(F))
  );

  binormal += vec3(
    -D.x * D.y * (steepness * sin(F)),
    D.y * (steepness * cos(F)),
    - D.y * D.y * (steepness * sin(F))
  );

	return Wave(
    p,
    tangent,
    binormal
  );
}
`;
