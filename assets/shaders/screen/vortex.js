import vertex from './basicVertex';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform vec2 resolution;
uniform float radius;
uniform float angle;
uniform vec2 center; // coor texture 0 à 1

void main() {
  vec2 newTexCoor = fragTexture;
  float w = center.x - fragTexture.x;
  float h = center.y - fragTexture.y;
	float distanceFromCenter = sqrt(w * w + h * h);
  newTexCoor -= center;
  if (distanceFromCenter < radius) {
    float percent = (radius - distanceFromCenter) / radius;
    float theta = percent * percent * angle * 8.0;
    float s = sin(theta);
    float c = cos(theta);
    newTexCoor = vec2(dot(newTexCoor, vec2(c, -s)), dot(newTexCoor, vec2(s, c)));
  }
  newTexCoor += center;
  gl_FragColor = texture2D(textureMap, newTexCoor);
  
  
  // repere
  // if (fragTexture.y < center.y + 0.005 && fragTexture.y > center.y - 0.005 && fragTexture.x < center.x + 0.005 && fragTexture.x > center.x - 0.005){
	//   gl_FragColor = vec4(1.0,0.0,0.0,1.0);
  // } else {
	//   gl_FragColor = texture2D(textureMap, fragTexture);
  // }
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'center', 'radius', 'angle', 'resolution'],
};
