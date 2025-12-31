const vertex = `
attribute vec3 position;
attribute vec2 texture;
varying vec2 fragTexture;
uniform float flipY;
void main()
{
  fragTexture = texture;
  vec3 newPosition = vec3(position.x, position.y * flipY, position.z);
  newPosition *= .2;
  newPosition.x += .8;
  newPosition.y += .8;
  gl_Position = vec4(newPosition, 1.0);
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
  uniforms: ['flipY', 'textureMap'],
};
