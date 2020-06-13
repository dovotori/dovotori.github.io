const MAX_JOINT_MAT = 4;

const vertex = `
attribute vec3 position;
attribute vec4 joint;
attribute vec4 weight;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat4 jointMat[${MAX_JOINT_MAT}];

varying vec3 color;

void main() {
  mat4 skinMat =
    weight.x * jointMat[int(joint.x)] +
    weight.y * jointMat[int(joint.y)] +
    weight.z * jointMat[int(joint.z)] +
    weight.w * jointMat[int(joint.w)];
  color = (weight).xyz;
  gl_Position = projection * view * model * skinMat * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;
varying vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
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
  attributes: ['position', 'joint', 'weight'],
  uniforms: ['projection', 'model', 'view'].concat(getExtraLocations())
};
