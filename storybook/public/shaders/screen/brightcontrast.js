import vertex from "./basicVertex";

const fragment = `
precision mediump float;

uniform float brightness;
uniform float contrast;
uniform sampler2D textureMap;

varying vec2 fragTexture;

void main() {
	vec3 color = texture2D(textureMap, fragTexture).rgb;
	vec3 colorContrasted = (color) * contrast;
	vec3 bright = colorContrasted + vec3(brightness);
	gl_FragColor = vec4(bright, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "brightness", "contrast"],
};
