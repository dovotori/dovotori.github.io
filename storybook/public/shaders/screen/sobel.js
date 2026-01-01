import vertex from "./basicVertex";

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform vec2 resolution;

varying vec2 fragTexture;

void main() {
  float x = 1.0 / resolution.x;
	float y = 1.0 / resolution.y;
	vec4 horizEdge = vec4( 0.0 );
	horizEdge -= texture2D( textureMap, vec2( fragTexture.x - x, fragTexture.y - y ) ) * 1.0;
	horizEdge -= texture2D( textureMap, vec2( fragTexture.x - x, fragTexture.y     ) ) * 2.0;
	horizEdge -= texture2D( textureMap, vec2( fragTexture.x - x, fragTexture.y + y ) ) * 1.0;
	horizEdge += texture2D( textureMap, vec2( fragTexture.x + x, fragTexture.y - y ) ) * 1.0;
	horizEdge += texture2D( textureMap, vec2( fragTexture.x + x, fragTexture.y     ) ) * 2.0;
	horizEdge += texture2D( textureMap, vec2( fragTexture.x + x, fragTexture.y + y ) ) * 1.0;
	vec4 vertEdge = vec4( 0.0 );
	vertEdge -= texture2D( textureMap, vec2( fragTexture.x - x, fragTexture.y - y ) ) * 1.0;
	vertEdge -= texture2D( textureMap, vec2( fragTexture.x    , fragTexture.y - y ) ) * 2.0;
	vertEdge -= texture2D( textureMap, vec2( fragTexture.x + x, fragTexture.y - y ) ) * 1.0;
	vertEdge += texture2D( textureMap, vec2( fragTexture.x - x, fragTexture.y + y ) ) * 1.0;
	vertEdge += texture2D( textureMap, vec2( fragTexture.x    , fragTexture.y + y ) ) * 2.0;
	vertEdge += texture2D( textureMap, vec2( fragTexture.x + x, fragTexture.y + y ) ) * 1.0;
	vec3 edge = sqrt((horizEdge.rgb * horizEdge.rgb) + (vertEdge.rgb * vertEdge.rgb));
	
	gl_FragColor = vec4( edge, texture2D( textureMap, fragTexture ).a );
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "resolution"],
};
