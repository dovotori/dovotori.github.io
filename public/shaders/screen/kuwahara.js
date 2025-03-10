import vertex from './basicVertex';

const fragment = `
precision mediump float;

varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform vec2 resolution;

#define PASS 7

vec3 kuwahara() {
  vec2 radius = vec2(0.001); // to adapt
  vec2 uv = fragTexture;
  float n = float((PASS + 1) * (PASS + 1));
  int i; 
  int j;
  vec3 m0 = vec3(0.0);
  vec3 m1 = vec3(0.0);
  vec3 m2 = vec3(0.0);
  vec3 m3 = vec3(0.0);
  vec3 s0 = vec3(0.0);
  vec3 s1 = vec3(0.0);
  vec3 s2 = vec3(0.0);
  vec3 s3 = vec3(0.0);
  vec3 c;

  for (int j = -PASS; j <= 0; ++j)  {
    for (int i = -PASS; i <= 0; ++i)  {
      c = texture2D(textureMap, uv + vec2(i,j) * radius).rgb;
      m0 += c;
      s0 += c * c;
    }
  }

  for (int j = -PASS; j <= 0; ++j)  {
    for (int i = 0; i <= PASS; ++i)  {
      c = texture2D(textureMap, uv + vec2(i,j) * radius).rgb;
      m1 += c;
      s1 += c * c;
    }
  }

  for (int j = 0; j <= PASS; ++j)  {
    for (int i = 0; i <= PASS; ++i)  {
      c = texture2D(textureMap, uv + vec2(i,j) * radius).rgb;
      m2 += c;
      s2 += c * c;
    }
  }

  for (int j = 0; j <= PASS; ++j)  {
    for (int i = -PASS; i <= 0; ++i)  {
      c = texture2D(textureMap, uv + vec2(i,j) * radius).rgb;
      m3 += c;
      s3 += c * c;
    }
  }

  vec3 color = vec3(1.0);

  float min_sigma2 = 1e+2;
  m0 /= n;
  s0 = abs(s0 / n - m0 * m0);

  float sigma2 = s0.r + s0.g + s0.b;
  if (sigma2 < min_sigma2) {
    min_sigma2 = sigma2;
    color = m0;
  }

  m1 /= n;
  s1 = abs(s1 / n - m1 * m1);

  sigma2 = s1.r + s1.g + s1.b;
  if (sigma2 < min_sigma2) {
    min_sigma2 = sigma2;
    color = m1;
  }

  m2 /= n;
  s2 = abs(s2 / n - m2 * m2);

  sigma2 = s2.r + s2.g + s2.b;
  if (sigma2 < min_sigma2) {
    min_sigma2 = sigma2;
    color = m2;
  }

  m3 /= n;
  s3 = abs(s3 / n - m3 * m3);

  sigma2 = s3.r + s3.g + s3.b;
  if (sigma2 < min_sigma2) {
    min_sigma2 = sigma2;
    color = m3;
  }
  return color;
}

void main() {
  float alpha = texture2D(textureMap, fragTexture).w;
  gl_FragColor = vec4(kuwahara(), alpha);
}`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'resolution'],
};
