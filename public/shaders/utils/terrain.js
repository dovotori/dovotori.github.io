import { anothorNoise2D } from './noise';
import { PI } from '.';

export const getNaturalHeight = `
${anothorNoise2D}

#define NB_OCTAVES 10
uniform float lacunarity; // frequency of noise octave
uniform float persistance; // influence of noise octave

uniform vec2 moving;
uniform vec2 gridSize;

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

export const locations = ['octaves', 'lacunarity', 'persistance', 'moving', 'gridSize'];

export const funcWave = `
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

export const getNormale = `
vec3 computeNormale(vec3 p0, vec3 p1, vec3 p2) {
  return cross(p1 - p0, p2 - p0);
}

vec3 roundNormale(vec3 position, vec2 moving) {
  vec2 betweenPoints = 2.0 / gridSize;

  vec2 coordP0 = position.xz + vec2(betweenPoints.x, 0.0) + moving;
  vec2 coordP1 = position.xz + vec2(betweenPoints.x, 0.0) + moving;
  vec2 coordP2 = position.xz + vec2(0.0, betweenPoints.y) + moving;
  
  vec3 p0 = vec3(0.0, position.y, 0.0);
  vec3 p1 = vec3(betweenPoints.x, getNaturalHeight(coordP1), 0.0);
  vec3 p2 = vec3(0.0, getNaturalHeight(coordP2), betweenPoints.y);

  return normalize(computeNormale(p0, p2, p1));
}

vec3 getNormale(vec3 position, vec3 tranformed) {
  vec3 normale = vec3(0.0);
  if (position.y == 0.0) {
    normale = roundNormale(tranformed, moving);
  }
  if (position.x == 1.0) {
    normale = vec3(1.0 ,0.0, 0.0);
  } else if (position.x == -1.0) {
    normale = vec3(-1.0 ,0.0, 0.0);
  } else if (position.z == 1.0) {
    normale = vec3(0.0 ,0.0, 1.0);
  } else if (position.z == -1.0) {
    normale = vec3(0.0 ,0.0, -1.0);
  }
  return normale;
}
`;
