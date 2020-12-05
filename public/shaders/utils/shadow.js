export const uniformVertShadow = `
uniform mat4 shadowView;
uniform mat4 shadowProjection;

const mat4 bias = mat4(
  0.5, 0.0, 0.0, 0.0,
  0.0, 0.5, 0.0, 0.0,
  0.0, 0.0, 0.5, 0.0,
  0.5, 0.5, 0.5, 1.0
);
`;

export const funcShadow = `
float funcShadow(
  vec4 pos, 
  vec2 resolution, 
  float lambertCosinus
) {
  if (pos.z > 1.0) {
    return 1.0; // outside light frustum, ignore
  }

  float bias = max(shadowEpsilon * (1.0 - lambertCosinus), shadowEpsilon * 0.01);
  vec2 texelSize = 1.0 / resolution;

  // PCF (percentage closer filter)
  float shadow = 0.0;
  for(float y = -1.0; y <= 1.0; y += 1.0) {
    for(float x = -1.0; x <= 1.0; x += 1.0) {
      float depth = texture2D(shadowMap, pos.xy + vec2(x,y) * texelSize).r;
      shadow += (depth + bias) < pos.z ? 0.0 : 1.0;
    } 
  }
  shadow /= 9.0;
  return (shadow * lambertCosinus) + lighten;
}
`;

export const uniformFragShadow = `
uniform sampler2D shadowMap;
uniform float shadowEpsilon;
uniform float lighten;
uniform vec3 posLum;
`;

export const shadowLocations = [
  'shadowView',
  'shadowProjection',
  'shadowMap',
  'lighten',
  'shadowEpsilon',
  'posLum',
];

export const fragment = `
precision mediump float;

${uniformFragShadow}

uniform vec2 resolution;

varying vec3 fragPosition;
varying vec4 fragShadow;
varying vec3 fragNormale;

${funcShadow}

void main() {
  vec3 N = normalize(fragNormale);
  vec3 L = normalize(posLum - fragPosition);
  float lambertCosinus = max(dot(N, L), 0.0);
  
  float shadow = funcShadow(fragShadow, resolution, lambertCosinus);
  gl_FragColor = vec4(vec3(shadow), 1.0);
}
`;
