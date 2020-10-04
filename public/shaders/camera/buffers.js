import { funcPBR, PBRLocations } from '../utils/pbr';
import { uniformShadow, funcShadow, shadowLocations } from '../utils/shadow';

const vertex = `
attribute vec3 position;
attribute vec3 normale;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat3 normalMatrix;

${uniformShadow}

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec4 fragShadow;

void main() {
  vec4 PVMpos = view * model * vec4(position, 1.0);
  fragPosition = PVMpos.xyz;
  fragNormale = normale; // normalize(normalMatrix * normale);
  fragShadow = bias * shadowProjection * shadowView * model * vec4(position, 1.0);
  gl_Position = projection * PVMpos;
}
`;

const fragment = `
precision mediump float;

#define EPSILON 0.005 // Fix shadow acne

uniform int type;
uniform sampler2D shadowMap;
uniform vec3 posEye;

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec4 fragShadow;
uniform vec2 resolution;

${funcPBR}
${funcShadow}

void main() {
  vec4 color;
  if (type == 1) {
		color = vec4(fragNormale, 1.0);
	} else if (type == 2) {
		color = vec4(fragPosition, 1.0);
  } else if (type == 3) {
    float shadow = funcShadow(shadowMap, fragShadow, resolution, EPSILON);
    color = vec4(vec3(shadow), 1.0);
  } else {
    vec3 pbr = funcPBR(fragPosition, fragNormale, posEye);
		color = vec4(pbr, 1.0);
  }
  gl_FragColor = color;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture', 'normale'],
  uniforms: ['projection', 'model', 'view', 'normalMatrix', 'type', 'resolution', 'posEye']
    .concat(shadowLocations)
    .concat(PBRLocations),
};
