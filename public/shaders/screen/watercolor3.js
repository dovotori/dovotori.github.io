import vertex from './basicVertex';

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform sampler2D noiseMap;
uniform vec2 resolution;

varying vec2 fragTexture;

// Table of pigments 
// from Computer-Generated Watercolor. Cassidy et al.
// K is absortion. S is scattering
vec3 K_QuinacridoneRose = vec3(0.22, 1.47, 0.57);
vec3 S_QuinacridoneRose = vec3(0.05, 0.003, 0.03);
vec3 K_FrenchUltramarine = vec3(0.86, 0.86, 0.06);
vec3 S_FrenchUltramarine = vec3(0.005, 0.005, 0.09);
vec3 K_CeruleanBlue = vec3(1.52, 0.32, 0.25);
vec3 S_CeruleanBlue = vec3(0.06, 0.26, 0.40);
vec3 K_HookersGreen = vec3(1.62, 0.61, 1.64);
vec3 S_HookersGreen = vec3(0.01, 0.012, 0.003);
vec3 K_HansaYellow = vec3(0.06, 0.21, 1.78);
vec3 S_HansaYellow = vec3(0.50, 0.88, 0.009);

// Math functions not available in webgl
vec3 cosh(vec3 val) { vec3 e = exp(val); return (e + vec3(1.0) / e) / vec3(2.0); }
vec3 tanh(vec3 val) { vec3 e = exp(val); return (e - vec3(1.0) / e) / (e + vec3(1.0) / e); }
vec3 sinh(vec3 val) { vec3 e = exp(val); return (e - vec3(1.0) / e) / vec3(2.0); }

// Kubelka-Munk reflectance and transmitance model
vec3 KMrefl(vec3 k, vec3 s, float h) {
  vec3 a = (k+s)/s;
  vec3 b = sqrt(a*a - vec3(1.0));
  vec3 bsh = b*s*vec3(h);
  vec3 sinh_bsh = sinh(bsh);
  vec3 denom = b*cosh(bsh)+a*sinh_bsh;
  return sinh_bsh/denom;
}

vec3 KMtrans(vec3 k, vec3 s, float h) {
  vec3 a = (k+s)/s;
  vec3 b = sqrt(a*a - vec3(1.0));
  vec3 bsh = b*s*vec3(h);
  vec3 sinh_bsh = sinh(bsh);
  vec3 denom = b*cosh(bsh)+a*sinh_bsh;
  return b/denom;
}

// The watercolours tends to dry first in the center
// and accumulate more pigment in the corners
float brush_effect(float dist, float h_avg, float h_var) {
  float h = max(0.0,1.0-10.0*abs(dist));
  h *= h;
  h *= h;
  return (h_avg+h_var*h) * smoothstep(-0.01, 0.002, dist);
}

// Kubelka-Munk model for layering
vec3 layeringR(vec3 r0, vec3 t0, vec3 r1, vec3 t1) {
  return r0 + t0*t0*r1 / (vec3(1.0)-r0*r1);
}

vec3 layeringT(vec3 r0, vec3 t0, vec3 r1, vec3 t1) {
  return t0*t1 / (vec3(1.0)-r0*r1);
}

// Simple 2d noise fbm with 3 octaves
float noise2d(vec2 p) {
  float t = texture2D(noiseMap, p).x;
  t += 0.5 * texture2D(noiseMap, p * 2.0).x;
  t += 0.25 * texture2D(noiseMap, p * 4.0).x;
  return t / 1.75;
}

void main() {
	vec2 uv = fragTexture;
  vec3 r0,t0,r1,t1;
  vec4 color = texture2D(textureMap, fragTexture);
  
  float sky = 0.1 + 0.1 * noise2d(uv * vec2(0.1));
  r0 = KMrefl(color.xyz, color.xyz, sky);
  t0 = KMtrans(color.xyz, color.xyz, sky);
  
  // float mountain_line = 0.5+0.04*(sin(uv.x*18.0+2.0)+sin(sin(uv.x*2.0)*7.0))-uv.y;
  // float s = clamp(2.0-10.0*abs(mountain_line),0.0,1.0);
  // vec2 uv2 = uv + vec2(0.04*s*noise2d(uv * vec2(0.1)));
  // float mountains = brush_effect(
  //   0.5 + 0.04 * (sin(uv2.x * 18.0 + 2.0) + sin(sin(uv2.x * 2.0) * 7.0)) - uv2.y, 0.2, 0.1
  // );
  // mountains *= 0.85+0.15*noise2d(uv*vec2(0.2));
  // r1 = KMrefl(K_HookersGreen, S_HookersGreen, mountains);
  // t1 = KMtrans(K_HookersGreen, S_HookersGreen, mountains);
  // r0 = layeringR(r0,t0,r1,t1);
  // t0 = layeringT(r0,t0,r1,t1);
  
  // vec2 uv3 = uv*vec2(1.0,resolution.y/resolution.x) + vec2(0.02*noise2d(uv * vec2(0.2)));
  // float sun = brush_effect(1.0 - distance(uv3, vec2(0.2,0.45)) / 0.08, 0.2, 0.1);
  // r1 = KMrefl(K_HansaYellow, S_HansaYellow, sun);
  // t1 = KMtrans(K_HansaYellow, S_HansaYellow, sun);

  // r0 = layeringR(r0,t0,r1,t1);
  // t0 = layeringT(r0,t0,r1,t1);

  vec4 effect = vec4(r0 + t0, 1.0);
    
	gl_FragColor = vec4(effect.xyz, color.a);
}`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'noiseMap'],
};
