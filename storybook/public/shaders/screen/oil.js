import vertex from "./basicVertex";

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform vec2 resolution;
uniform int radius;

#define MAX_RADIUS 1

void main() {
  vec2 uv = fragTexture;
  float n = float((radius + 1) * (radius + 1));
  vec3 m[4];
  vec3 s[4];
  for (int k = 0; k < 4; ++k) {
    m[k] = vec3(0.0);
    s[k] = vec3(0.0);
  }

  for (int j = -MAX_RADIUS; j <= 0; ++j) {
    for (int i = -MAX_RADIUS; i <= 0; ++i) {
      vec3 c = texture2D(textureMap, uv + vec2(i,j) / resolution).rgb;
      m[0] += c;
      s[0] += c * c;
    }
  }

  for (int j = -MAX_RADIUS; j <= 0; ++j) {
    for (int i = 0; i <= MAX_RADIUS; ++i) {
      vec3 c = texture2D(textureMap, uv + vec2(i,j) / resolution).rgb;
      m[1] += c;
      s[1] += c * c;
    }
  }

  for (int j = 0; j <= MAX_RADIUS; ++j) {
    for (int i = 0; i <= MAX_RADIUS; ++i) {
      vec3 c = texture2D(textureMap, uv + vec2(i,j) / resolution).rgb;
      m[2] += c;
      s[2] += c * c;
    }
  }

  for (int j = 0; j <= MAX_RADIUS; ++j) {
    for (int i = -MAX_RADIUS; i <= 0; ++i) {
      vec3 c = texture2D(textureMap, uv + vec2(i,j) / resolution).rgb;
      m[3] += c;
      s[3] += c * c;
    }
  }

  float min_sigma2 = 1e+2;
  for (int k = 0; k < 4; ++k) {
    m[k] /= n;
    s[k] = abs(s[k] / n - m[k] * m[k]);

    float sigma2 = s[k].r + s[k].g + s[k].b;
    if (sigma2 < min_sigma2) {
      min_sigma2 = sigma2;
      gl_FragColor = vec4(m[k], 1.0);
    }
  }
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "radius", "resolution"],
};
