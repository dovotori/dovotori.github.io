const vertex = `
attribute vec3 position;
attribute vec3 emissive;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
varying vec3 fragEmissive;

void main() {
  fragEmissive = emissive;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;
varying vec3 fragEmissive;

void main() {
  float opacity = (fragEmissive.x + fragEmissive.y + fragEmissive.z) / 3.0;
  if (opacity == 0.0) {
    gl_FragColor = vec4(0.0);
  } else {
    gl_FragColor = vec4(fragEmissive, 1.0);
  }
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "emissive"],
  uniforms: ["projection", "model", "view"],
};
