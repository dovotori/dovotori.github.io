import { funcPBR, locationsPBR } from '../utils/pbr';

const vertex = `
attribute vec3 position;
attribute vec3 normale;
uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat3 normalMatrix;

varying vec3 fragPosition;
varying vec3 fragNormale;

void main() {
  vec4 PVMpos = view * model * vec4(position, 1.0);
  fragPosition = PVMpos.xyz;
  fragNormale = normale; // normalize(normalMatrix * normale);
  gl_Position = projection * PVMpos;
}
`;

const fragment = `
precision mediump float;

uniform int type;

varying vec3 fragPosition;
varying vec3 fragNormale;
uniform vec3 posEye;

${funcPBR}

void main() {
  vec4 color;
  if (type == 1) {
		color = vec4(fragNormale, 1.0);
	} else if (type == 2) {
		color = vec4(fragPosition, 1.0);
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
  uniforms: ['projection', 'model', 'view', 'normalMatrix', 'type', 'resolution', 'posEye'].concat(
    locationsPBR,
  ),
};
