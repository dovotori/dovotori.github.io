const vertex = `
attribute vec3 position;
attribute vec2 texture;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform float offset;

varying vec2 fragTexture;

void main() {
  fragTexture = vec2(texture.x + offset, 1.0 - texture.y);
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
void main() {
  gl_FragColor = texture2D(textureMap, fragTexture);
  // gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['projection', 'model', 'view', 'textureMap', 'offset'],
};
