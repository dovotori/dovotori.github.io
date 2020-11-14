import vertex from './basicVertex';

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform float time;

varying vec2 fragTexture;

void main()
{
	vec2 p = fragTexture;
	vec2 q = p - vec2(0.5, 0.5);

	q.x += sin(time* 0.6) * 0.2;
	q.y += cos(time* 0.4) * 0.3;

	float len = length(q);

	float a = atan(q.y, q.x) + time * 0.3;
	float b = atan(q.y, q.x) + time * 0.3;
	float r1 = 0.3 / len + time * 0.5;
	float r2 = 0.2 / len + time * 0.5;

	vec3 col = texture2D(textureMap, vec2(a + 0.1 / len, r1 )).xyz;
	gl_FragColor = vec4(col * len * 1.5, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'time'],
};
