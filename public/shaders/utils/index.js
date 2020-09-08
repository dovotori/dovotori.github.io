export const PI = `
#define PI 3.14159265359
`;

export const TWO_PI = `
#define TWO_PI 6.28318530718
`;

export const attributeColors = `
attribute vec3 ambiant;
attribute vec3 diffuse;
attribute vec3 specular;
attribute float specDensity;
attribute float opacity;
`;

export const varyingColors = `
varying vec3 fragAmbiant;
varying vec3 fragDiffuse;
varying vec3 fragSpecular;
varying float fragSpecDensity;
varying float fragOpacity;
`;

export const funcMap = `
float funcMap(float valeur, float minRef, float maxRef, float minDest, float maxDest) {
  float result = minDest + (valeur - minRef) * (maxDest - minDest) / (maxRef - minRef);
  if(result > maxDest){ result = maxDest; } else if(result < minDest){ result = minDest; }
  return result;
}
`;

export const funcGrain = `
vec4 funcGrain(vec2 uv, float time, float strength) {
  float x = (uv.x + 4.0 ) * (uv.y + 4.0 ) * (time * 10.0);
  return vec4(mod((mod(x, 13.0) + 1.0) * (mod(x, 123.0) + 1.0), 0.01)-0.005) * strength;
}
`;

export const funcToon = `
float funcToon(lambertCosinus) {
  float strength = 0.0;
  if (lambertCosinus > 0.7)
    strength = 0.8;
  else if (lambertCosinus > 0.3)
    strength = 0.5;
  else
    strength = 0.3;
  return strength;
}
`;

export const funcGradiant = `
${funcMap}
vec4 funcGradiant(vec4 color1, vec4 color2, float start, float end, float uvAxe) {
  float mixValue = funcMap(uvAxe, start, end, 0.0, 1.0);
  return mix(color1, color2, mixValue);
}
`;
