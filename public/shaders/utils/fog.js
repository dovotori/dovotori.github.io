export const fogFactorExp2 = `
float fogFactorExp2(
  const float dist,
  const float density
) {
  const float LOG2 = -1.442695;
  float d = density * dist;
  return 1.0 - clamp(exp2(d * d * LOG2), 0.0, 1.0);
}
`;

export const fogFactorLinear = `
float fogFactorLinear(
  const float dist,
  const float start,
  const float end
) {
  return 1.0 - clamp((end - dist) / (end - start), 0.0, 1.0);
}
`;

export const getFogAmount = `
${fogFactorLinear}
float getFogAmount(vec3 position, float start, float end) {
  float fogDistance = length(position);
  return fogFactorLinear(fogDistance, start, end);
}
`;

export const fogUniforms = `
uniform vec4 fogColor;
uniform float fogStart;
uniform float fogEnd;
`;

export const fogLocations = ['fogStart', 'fogEnd', 'fogColor'];
