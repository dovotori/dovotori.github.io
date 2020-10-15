export default `
attribute vec3 position;
attribute vec2 texture;
varying vec2 fragTexture;
uniform float flipY; // 1 ou -1

void main() {
  fragTexture = texture;
  gl_Position = vec4(position.x, position.y * flipY, position.z, 1.0);
}
`;
