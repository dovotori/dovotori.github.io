export const PI = `
const float PI = 3.14159265359;
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

