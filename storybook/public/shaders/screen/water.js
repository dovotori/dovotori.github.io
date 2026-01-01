import vertex from "./basicVertex";

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform float time;

varying vec2 fragTexture;

void main() {
	vec2 uv = fragTexture;

	uv.y += (cos((uv.y + (time * 0.04)) * 45.0) * 0.0019) +
		(cos((uv.y + (time * 0.1)) * 10.0) * 0.002);

	uv.x += (sin((uv.y + (time * 0.07)) * 15.0) * 0.0029) +
		(sin((uv.y + (time * 0.1)) * 15.0) * 0.002);
		
	vec4 texColor = texture(textureMap, uv);
	fragColor = texColor;
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "time"],
};
