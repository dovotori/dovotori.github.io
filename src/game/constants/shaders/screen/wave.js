import vertex from './basicVertex';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform float time;
uniform float radius;
uniform vec2 center; // coor texture 0 à 1

void main() {
	float w = center.x - (fragTexture.x);
  float h = center.y - fragTexture.y;
	float distanceFromCenter = sqrt(w * w + h * h);
	float sinArg = distanceFromCenter * 1.0 - time * 1.0;
  float slope = cos(sinArg);
  float wave = slope * radius;
  vec2 uv = fragTexture + normalize(vec2(w, h)) * wave;
	vec4 color = texture2D(textureMap, uv);
  // repere
  // if (fragTexture.y < center.y + 0.005 && fragTexture.y > center.y - 0.005 && fragTexture.x < center.x + 0.005 && fragTexture.x > center.x - 0.005){
	//   gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  // } else {
	  gl_FragColor = color;
  // }
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'time', 'radius', 'center'],
};
