export const getToonStrength = `
float getToonStrength(float lambertCosinus) {
  if (lambertCosinus > 0.7) {
    return 0.8;
  } else if (lambertCosinus > 0.3) {
    return 0.5;
  }
  return 0.3;
}
`;

export const funcToon = `
${getToonStrength}
vec3 funcToon(
  vec3 position,
  vec3 normale,
  vec3 ambiant,
  vec3 posLum
  ) {
  vec3 N = normalize(normale);
  vec3 L = normalize(posLum - position);
  // Lambert's cosine law
  float lambertian = max(dot(N, L), 0.0);
  float strength = getToonStrength(lambertian);
  return vec3(ambiant) * vec3(strength);
}
`;

export const funcLightsToon = `
${funcToon}
vec3 funcLightsToon(vec3 ambiant, vec3 position, vec3 normale) {
  vec3 finalColor = vec3(0.0);
  for(int i = 0; i < MAX_LIGHTS; i += 1) {
    if(i < numLights) {
      vec3 color = funcToon(
        position,
        normale,
        ambiant * (lights[i].ambiant * lights[i].strength),
        lights[i].position
      );
      finalColor += color;
    }
  }
  finalColor /= vec3(numLights);
  return finalColor;
}
`;
