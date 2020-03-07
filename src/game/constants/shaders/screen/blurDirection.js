import vertex from './basicVertex';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform float size;
uniform float direction;
uniform vec2 resolution;

float CalcGauss(float x, float sigma) {
  float coeff = 1.0 / (2.0 * 3.14157 * sigma);
  float expon = -(x*x) / (2.0 * sigma);
  return (coeff*exp(expon));
}

void main() {
  vec4 texCol = texture2D(textureMap, fragTexture);
  vec4 gaussCol = texCol;
  vec2 invSize = 1.0 / resolution;
  const int width = 4;
  for ( int i = 1; i <= width; i += 1 ) {
    vec2 step;
    if (direction == 0.0) {
      step = vec2( 0.0, float(i) * invSize.y );
    } else {
      step = vec2( float(i) * invSize.x, 0.0 );
    }

    float weight = CalcGauss(float(i) / float(width), size);
    texCol = texture2D(textureMap, fragTexture + step);    
    gaussCol += vec4( texCol.rgb * weight, weight);
    texCol = texture2D(textureMap, fragTexture - step);
    gaussCol += vec4(texCol.rgb * weight, weight);
  }
  gaussCol.rgb /= gaussCol.w;
  gl_FragColor = gaussCol;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'resolution', 'size', 'direction'],
};
