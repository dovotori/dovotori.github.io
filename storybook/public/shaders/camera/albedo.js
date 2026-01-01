const vertex = `
attribute vec3 position;
attribute vec3 ambiant;
attribute vec3 diffuse;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

varying vec3 fragAmbiant;

void main() {
  fragAmbiant = diffuse; // ambiant;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

varying vec3 fragAmbiant;

void main() {
  gl_FragColor = vec4(fragAmbiant, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "diffuse"],
  uniforms: ["projection", "model", "view"],
};
