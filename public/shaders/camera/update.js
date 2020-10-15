import fragment from './basicFrag';

const vertex = `
attribute float value;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

void main() {
  vec3 position = vec3(value, 0.0, 0.0);
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['value'],
  uniforms: ['projection', 'model', 'view'],
};
