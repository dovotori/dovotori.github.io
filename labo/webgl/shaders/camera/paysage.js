import { attributeColors, varyingColors } from '../utils';

import { uniformLights, addLightLocations, funcLightsColor } from '../utils/light';

import { funcShadow } from '../utils/shadow';

const vertex = `
attribute vec3 position;
attribute vec2 texture;
attribute vec3 normale;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat3 normalmatrix;
uniform sampler2D displacementMap;
uniform float time;

uniform mat4 shadowview;

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec4 fragShadow;

const mat4 bias = mat4(
  0.5, 0.0, 0.0, 0.0,
  0.0, 0.5, 0.0, 0.0,
  0.0, 0.0, 0.5, 0.0,
  0.5, 0.5, 0.5, 1.0
);

${attributeColors}
${varyingColors}

void main() {
  // float displacement = texture2D(displacementMap, texture * time * 0.01).y;
  vec3 newPosition = position;

  fragPosition = (model * vec4(newPosition, 1.0)).xyz;
  fragNormale = normalmatrix * normale;
  fragAmbiant = ambiant;
  fragDiffuse = diffuse;
  fragSpecular = specular;
  fragSpecDensity = specDensity;
  fragOpacity = opacity;
  fragShadow = bias * projection * shadowview * model * vec4(newPosition, 1.0);

  gl_Position = projection * view * model * vec4(newPosition, 1.0);
}
`;

const fragment = `
precision mediump float;

uniform vec3 posEye;

uniform sampler2D ssaoMap;
uniform sampler2D shadowMap;
uniform vec2 resolution;
${uniformLights}

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec4 fragShadow;
${varyingColors}

${funcLightsColor}
${funcShadow}

void main() {
  float epsilon = 0.01; // Fix shadow acne
  float depth = gl_FragCoord.z / gl_FragCoord.w;
  vec3 color = funcLightsColor(fragAmbiant, fragDiffuse, fragSpecular, fragNormale, fragPosition);
  float shadow = funcShadow(shadowMap, fragShadow, resolution, epsilon);
  gl_FragColor = vec4(color * shadow, fragOpacity);
}
`;

export default {
  vertex,
  fragment,
  attributes: [
    'position',
    'texture',
    'normale',
    'ambiant',
    'diffuse',
    'specular',
    'specDensity',
    'opacity',
  ],
  uniforms: [
    'projection',
    'model',
    'view',
    'shadowview',
    'time',
    'ssaoMap',
    'displacementMap',
    'shadowMap',
    'normalmatrix',
    'posEye',
    'resolution',
  ].concat(addLightLocations()),
};
