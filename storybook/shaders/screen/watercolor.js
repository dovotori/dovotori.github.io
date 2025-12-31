import vertex from './basicVertex';

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform vec2 resolution;

varying vec2 fragTexture;

float hash(vec3 p) {
	return fract(123456.789 * sin(dot(p, vec3(12.34, 56.78, 91.01))));
}

mat2 rot(float a) {
  float c = cos(a);
  float s = sin(a);
	return mat2(c, -s, s, c);
}

float smoothmin(float a, float b, float k) {
	float f = clamp(0.5 + 0.5 * (a - b) / k, 0., 1.);
  return mix(a, b, f) - k * f * (1. - f);
}

float smoothmax(float a, float b, float k) {
	return -smoothmin(-a, -b, k);
}

float smoothabs(float p, float k) {
	return sqrt(p * p + k * k) - k;
}

float noise(vec3 p) {
	vec3 f = fract(p);
  f = f * f * (3. - 2. * f);
  vec3 c = floor(p);
  
  return mix(mix(mix(hash(c), hash(c + vec3(1., 0., 0.)), f.x),
    mix(hash(c + vec3(0., 1., 0.)), hash(c + vec3(1., 1., 0.)), f.x),
    f.y),
    mix(mix(hash(c + vec3(0., 0., 1.)), hash(c + vec3(1., 0., 1.)), f.x),
        mix(hash(c + vec3(0., 1., 1.)), hash(c + vec3(1., 1., 1.)), f.x),
        f.y),
    f.z);  
}

float fbm(vec3 p) {
	vec3 pos = 10. * p;
  float c = 0.5;
  float res = 0.;
  for(int i = 0; i < 4; i += 1){
    pos.xy = rot(2.) * pos.xy;
    pos = pos * 2. + 2.;
    res += c * noise(pos);
    c /= 2.;
  }
  return res;
}

vec4 funcWatercolor(vec2 uv) {
  vec3 inkColor = vec3(0.15, 0.25, 0.4);
  vec4 color = texture2D(textureMap, fragTexture);
  float f = fbm(vec3(uv, 1.0) );
  return mix(vec4(f), color, 0.93);
}

void main() {
  // mix with a sort of watercolor texture
  gl_FragColor = funcWatercolor(fragTexture);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap'],
};
