const vertex = `
attribute vec3 position;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
void main()
{
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;
uniform bool selected;
void main()
{
  if (selected) {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
  } else {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position"],
  uniforms: ["projection", "model", "view", "selected"],
};
