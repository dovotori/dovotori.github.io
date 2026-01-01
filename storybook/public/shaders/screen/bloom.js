import vertex from "./basicVertex";

const fragment = `
precision mediump float;

varying vec2 fragTexture;

uniform sampler2D textureMap;
uniform float scale;
uniform float threshold;
uniform int useDepth;

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

  vec4 color = texture2D(textureMap, fragTexture);
  if (length(sum) > threshold) {
    color += sum * scale;
  }
  
  gl_FragColor = vec4(color.xyz, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "scale", "threshold"],
};
