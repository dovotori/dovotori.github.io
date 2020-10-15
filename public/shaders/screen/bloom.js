import vertex from './basicVertex';

const fragment = `
precision mediump float;

varying vec2 fragTexture;

uniform sampler2D textureMap;
uniform float scale;
uniform float threshold;

float kernel = .005;

void main() {
  vec4 sum = vec4(0.0);

  // mess of for loops due to gpu compiler/hardware limitations
  int j=-2;
  for( int i=-2; i<=2; i++) sum+=texture2D(textureMap, fragTexture + vec2(i,j) * kernel);
  j=-1;
  for( int i=-2; i<=2; i++) sum+=texture2D(textureMap, fragTexture + vec2(i,j) * kernel);
  j=0;
  for( int i=-2; i<=2; i++) sum+=texture2D(textureMap, fragTexture + vec2(i,j) * kernel);
  j=1;
  for( int i=-2; i<=2; i++) sum+=texture2D(textureMap, fragTexture + vec2(i,j) * kernel);
  j=2;
  for( int i=-2; i<=2; i++) sum+=texture2D(textureMap, fragTexture + vec2(i,j) * kernel);
  sum /= 25.0;


  // WITH ALPHA
  // vec4 s = texture2D(textureMap, fragTexture);
  // gl_FragColor = s;
  // // use the blurred colour if it's bright enough
  // if (length(sum) > threshold) {
  //   gl_FragColor += sum * scale;
  // }

  vec3 color = texture2D(textureMap, fragTexture).xyz;
  if (length(sum) > threshold) {
    color += sum.xyz * scale;
  }
  gl_FragColor = vec4(color, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'scale', 'threshold'],
};
