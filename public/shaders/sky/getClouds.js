export default `
#define MIN_HEIGHT 2.0
#define MAX_HEIGHT 4.5

vec3 sundir = normalize(vec3(1.0, 0.75, 1.0));

float planeIntersect(vec3 ro, vec3 rd, float plane) {
  float h = plane - ro.y;
  return h / rd.y;
}

float noiseSpe(sampler2D tex, vec3 x, float time, vec2 wind) {
  vec3 f = fract(x);
  vec3 p = floor(x);
  f = f * f * (3.0 - 2.0 * f);
  
  p.xz += wind * time;
  vec2 uv = (p.xz + vec2(37.0, 17.0) * p.y) + f.xz;
  vec2 rg = texture2D(tex, (uv + 0.5) / 256.0, 0.0).yx;
  return mix(rg.x, rg.y, f.y);
}

float fractalNoise(sampler2D tex, vec3 p, float time, vec2 wind) {
  float f = 0.0;
  // add animation
  // p = p - vec3(1.0, 1.0, 0.0) * time * 0.1;
  p = p * 3.0;
  f += 0.50000 * noiseSpe(tex, p, time, wind); p = 2.0 * p;
	f += 0.25000 * noiseSpe(tex, p, time, wind); p = 2.0 * p;
	f += 0.12500 * noiseSpe(tex, p, time, wind); p = 2.0 * p;
	f += 0.06250 * noiseSpe(tex, p, time, wind); p = 2.0 * p;
  f += 0.03125 * noiseSpe(tex, p, time, wind);
  return f;
}

float density(sampler2D tex, vec3 pos, float time, vec2 wind) {    
  float den = 3.0 * fractalNoise(tex, pos * 0.3, time, wind) - 2.0 + (pos.y - MIN_HEIGHT);
  float edge = 1.0 - smoothstep(MIN_HEIGHT, MAX_HEIGHT, pos.y);
  edge *= edge;
  den *= edge;
  den = clamp(den, 0.0, 1.0);
  return den;
}

vec3 raymarching(sampler2D tex, vec3 ro, vec3 rd, float t, vec3 backColor, float time, vec2 wind) {   
  vec4 sum = vec4(0.0);
  vec3 pos = ro + rd * t;

  vec3 fix1 = vec3(0.65, 0.7, 0.75);
  vec3 fix2 = vec3(1.0, 0.6, 0.3);

  for (int i = 0; i < 40; i++) {
    if (sum.a > 0.99 || 
      pos.y < (MIN_HEIGHT-1.0) || 
      pos.y > (MAX_HEIGHT+1.0)) break;
    
    float den = density(tex, pos, time, wind);

    if (den > 0.01) {
      float dif = clamp((den - density(tex, pos + 0.3 * sundir, time, wind)) / 0.6, 0.0, 1.0);
      vec3 lin = fix1 * 1.5 + fix2 * dif;        
      vec4 color = vec4(mix(SKY_COLOR * 1.1, CLOUD_COLOR, den), den);
      color.rgb *= lin;

      // front to back blending    
      color.a *= 0.5;
      color.rgb *= color.a;
      sum = sum + color * (1.0 - sum.a); 
    }
    
    t += max(0.05, 0.02 * t);
    pos = ro + rd * t;
  }
  
  sum = clamp(sum, 0.0, 1.0);
  float h = rd.y;
  sum.rgb = mix(sum.rgb, backColor, exp(-20.0 * h * h));
  
  return mix(backColor, sum.xyz, sum.a);
}

vec3 getClouds(sampler2D tex, vec2 uv, float time, vec3 backColor, vec2 wind) {
  vec3 color = backColor;
  vec3 ro = vec3(0.0, 0.0, -2.0); // size
  vec3 rd = normalize(vec3(uv, 1.5));
  float dist = planeIntersect(ro, rd, MIN_HEIGHT);
  if (dist > 0.0) {
    color = raymarching(tex, ro, rd, dist, color, time, wind);
  }
  return color;
}
`;
