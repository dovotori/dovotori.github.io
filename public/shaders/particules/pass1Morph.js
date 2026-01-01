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
uniform sampler2D morphMap;
uniform float time;

void main() {
  vec3 position = texture2D(textureMap, fragTexture).xyz;
  vec3 morph = texture2D(morphMap, fragTexture).xyz;
  position.y = mix(position.y, morph.y, time);
  gl_FragColor = vec4(position, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["textureMap", "morphMap", "time"],
};
