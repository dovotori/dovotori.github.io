import { uniformLights, addLightLocations, funcLightsColor } from '../utils/light';

const MAX_JOINT_MAT = 4;

const vertex = `
attribute vec3 position;
attribute vec3 normale;
attribute vec4 joint;
attribute vec4 weight;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat4 jointMat[${MAX_JOINT_MAT}];
uniform mat3 normalmatrix;

varying vec3 fragPosition;
varying vec3 fragNormale;

void main() {
  mat4 skinMat =
    weight.x * jointMat[int(joint.x)] +
    weight.y * jointMat[int(joint.y)] +
    weight.z * jointMat[int(joint.z)] +
    weight.w * jointMat[int(joint.w)];
  vec4 VMpos = view * model * skinMat * vec4(position, 1.0);
  fragPosition = normalize(VMpos.xyz);
  fragNormale = normalize(normalmatrix * normale);
  gl_Position = projection * VMpos;
}
`;

const fragment = `
precision mediump float;

varying vec3 fragPosition;
varying vec3 fragNormale;

uniform vec4 color;
uniform float rough; 
uniform float metal;

${uniformLights}
${funcLightsColor}

void main() {
  vec3 phong = funcLightsColor(
    color.xyz, vec3(1.0, 1.0, 1.0), vec3(1.0, 1.0, 1.0), fragNormale, fragPosition
  );
  gl_FragColor = vec4(phong, 1.0);
}
`;

const getExtraLocations = () => {
  const locations = [];
  for (let i = 0; i < MAX_JOINT_MAT; i++) {
    locations.push(`jointMat[${i}]`);
  }
  return locations;
};

export default {
  vertex,
  fragment,
  attributes: ['position', 'joint', 'weight', 'normale'],
  uniforms: [
    'projection',
    'model',
    'view',
    'normalmatrix',
    'color',
    'rough',
    'metal',
    'posLum',
    'posEye',
  ]
    .concat(getExtraLocations())
    .concat(addLightLocations()),
};
