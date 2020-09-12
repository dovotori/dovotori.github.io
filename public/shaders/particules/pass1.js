const vertex = `
attribute vec3 position;
attribute vec2 texture;

varying vec2 fragTexture;

void main() {
  fragTexture = texture;
  gl_Position = vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

varying vec2 fragTexture;
uniform sampler2D textureMap;

void main() {
  gl_FragColor = texture2D(textureMap, fragTexture);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['textureMap'],
};
