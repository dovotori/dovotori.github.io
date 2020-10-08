import { uniformVertShadow, uniformFragShadow, funcShadow, shadowLocations } from '../utils/shadow';

const vertex = `
attribute vec3 position;
attribute vec3 normale;
attribute vec2 texture;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat3 normalMatrix;

${uniformVertShadow}

varying vec3 fragPosition;
varying vec4 fragShadow;
varying vec3 fragNormale;
varying vec2 fragTexture;

void main() {
  fragShadow = bias * shadowProjection * shadowView * model * vec4(position, 1.0);
  fragNormale = normalMatrix * normale;
  fragTexture = texture;
  fragPosition = normalize((view * model * vec4(position, 1.0)).xyz);
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

${uniformFragShadow}

uniform vec2 resolution;

varying vec3 fragPosition;
varying vec4 fragShadow;
varying vec3 fragNormale;
varying vec2 fragTexture;

${funcShadow}

void main() {
  vec3 N = normalize(fragNormale);
  vec3 L = normalize(posLum - fragPosition);
  float lambertCosinus = max(dot(N, L), 0.0);
  
  float shadow = funcShadow(fragShadow, resolution, lambertCosinus);
  gl_FragColor = vec4(vec3(shadow * lambertCosinus), 1.0);
  
  // gl_FragColor = texture2D(shadowMap, fragTexture);
  // gl_FragColor = vec4(vec3(lambertCosinus), 1.0);
  // gl_FragColor = vec4(fragPosition, 1.0);
  // gl_FragColor = vec4(resolution, 0.0, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture', 'normale'],
  uniforms: ['projection', 'model', 'view', 'normalMatrix', 'resolution'].concat(shadowLocations),
};
