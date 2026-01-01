import vertex from "./basicVertex";

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform float gamma;

void main() {
  vec4 color = texture2D(textureMap, fragTexture);
  gl_FragColor = vec4(pow(color.rgb, vec3(gamma)), color.a);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "gamma"],
};
