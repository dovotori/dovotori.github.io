const vertex = `
attribute vec2 texture;

uniform sampler2D textureMap;

void main() {
  vec3 particulePos = texture2D(textureMap, texture).xyz;
  vec3 position = (particulePos * vec3(2.0)) - vec3(1.0);
  gl_PointSize = 2.0;
  gl_Position = vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

void main() {
  gl_FragColor = vec4(1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['texture'],
  uniforms: ['textureMap'],
};
