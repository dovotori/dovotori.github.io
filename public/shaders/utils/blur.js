export const funcBlur = `
vec4 funcBlur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  color += texture2D(image, uv) * 0.1964825501511404;
  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
  return color;
}
`;

export const funcBlur2 = `
vec4 funcBlur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}
`;

export const funcBlurDirection = `
float CalcGauss(float x, float sigma) {
  float coeff = 1.0 / (2.0 * 3.14157 * sigma);
  float expon = -(x*x) / (2.0 * sigma);
  return (coeff*exp(expon));
}

vec4 funcBlurDirection(sampler2D tex, vec2 uv, vec2 resolution, float direction, float size) {
  vec4 texCol = texture2D(tex, uv);
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
    texCol = texture2D(tex, uv + step);    
    gaussCol += vec4( texCol.rgb * weight, weight);
    texCol = texture2D(tex, uv - step);
    gaussCol += vec4(texCol.rgb * weight, weight);
  }
  gaussCol.rgb /= gaussCol.w;
  return gaussCol;
}
`;

export const funcBlurOnePass = `
vec3 highlights(vec3 pixel, float thres)
{
	float val = (pixel.x + pixel.y + pixel.z) / 3.0;
	return pixel * smoothstep(thres - 0.1, thres + 0.1, val);
}

vec3 samplef(sampler2D tex, vec2 uv) {
	return pow(texture2D(tex, uv).xyz, vec3(2.2));
}

vec3 hsample(sampler2D tex, vec2 uv) {
	return highlights(samplef(tex, uv), 0.6);
}

vec3 computeBlur(sampler2D tex, vec2 uv, float offs, vec2 resolution) {
	vec4 xoffs = offs * vec4(-2.0, -1.0, 1.0, 2.0) / resolution.x;
	vec4 yoffs = offs * vec4(-2.0, -1.0, 1.0, 2.0) / resolution.y;

	vec3 color = vec3(0.0, 0.0, 0.0);
	color += hsample(tex, uv + vec2(xoffs.x, yoffs.x)) * 0.00366;
	color += hsample(tex, uv + vec2(xoffs.y, yoffs.x)) * 0.01465;
	color += hsample(tex, uv + vec2(    0.0, yoffs.x)) * 0.02564;
	color += hsample(tex, uv + vec2(xoffs.z, yoffs.x)) * 0.01465;
	color += hsample(tex, uv + vec2(xoffs.w, yoffs.x)) * 0.00366;
	
	color += hsample(tex, uv + vec2(xoffs.x, yoffs.y)) * 0.01465;
	color += hsample(tex, uv + vec2(xoffs.y, yoffs.y)) * 0.05861;
	color += hsample(tex, uv + vec2(    0.0, yoffs.y)) * 0.09524;
	color += hsample(tex, uv + vec2(xoffs.z, yoffs.y)) * 0.05861;
	color += hsample(tex, uv + vec2(xoffs.w, yoffs.y)) * 0.01465;
	
	color += hsample(tex, uv + vec2(xoffs.x, 0.0)) * 0.02564;
	color += hsample(tex, uv + vec2(xoffs.y, 0.0)) * 0.09524;
	color += hsample(tex, uv + vec2(    0.0, 0.0)) * 0.15018;
	color += hsample(tex, uv + vec2(xoffs.z, 0.0)) * 0.09524;
	color += hsample(tex, uv + vec2(xoffs.w, 0.0)) * 0.02564;
	
	color += hsample(tex, uv + vec2(xoffs.x, yoffs.z)) * 0.01465;
	color += hsample(tex, uv + vec2(xoffs.y, yoffs.z)) * 0.05861;
	color += hsample(tex, uv + vec2(    0.0, yoffs.z)) * 0.09524;
	color += hsample(tex, uv + vec2(xoffs.z, yoffs.z)) * 0.05861;
	color += hsample(tex, uv + vec2(xoffs.w, yoffs.z)) * 0.01465;
	
	color += hsample(tex, uv + vec2(xoffs.x, yoffs.w)) * 0.00366;
	color += hsample(tex, uv + vec2(xoffs.y, yoffs.w)) * 0.01465;
	color += hsample(tex, uv + vec2(    0.0, yoffs.w)) * 0.02564;
	color += hsample(tex, uv + vec2(xoffs.z, yoffs.w)) * 0.01465;
	color += hsample(tex, uv + vec2(xoffs.w, yoffs.w)) * 0.00366;

	return color;
}

vec3 funcBlur(sampler2D tex, vec2 uv, vec2 resolution) {
  vec3 color = computeBlur(tex, uv, 2.0, resolution);
	color += computeBlur(tex, uv, 3.0, resolution);
	color += computeBlur(tex, uv, 5.0, resolution);
	color += computeBlur(tex, uv, 7.0, resolution);
	color /= 4.0;
  color += samplef(tex, uv);
  return color;
}
`;

export const funcRadialBlur = `
vec3 funcRadialBlur(sampler2D tex, vec2 uv, vec2 resolution, vec2 center) {
  // vec2 p = -1.0 + 2.0 * uv / resolution;
  const float STRENGTH = 0.125;    
  const int SAMPLES = 64; // multiple of 2
  
  vec2 coor = uv / resolution;
	vec2 dir = (uv - center) / resolution * vec2(-1.0, 1.0);
  
  vec3 color = vec3(0.0);
  for (int i = 0; i < SAMPLES; i += 2) {
    color += texture2D(tex, coor + float(i) / float(SAMPLES) * dir * STRENGTH).xyz;
    color += texture2D(tex, coor + float(i + 1) / float(SAMPLES) * dir * STRENGTH).xyz;
  }   
  return color / float(SAMPLES);
  // return texture2D(tex, coor).xyz;
}
`;

export const funcRadialBlur2 = `
vec3 deform(sampler2D tex, vec2 p) {
  vec2 q = sin(vec2(1.1, 1.2) + p);

  float a = atan(q.y, q.x);
  float r = sqrt(dot(q, q));

  vec2 uv = p * sqrt(1.0 + r * r);
  uv += sin(vec2(0.0, 0.6) + vec2(1.0, 1.1));
        
  return texture2D(tex, uv * 0.3).yxx;
}


vec3 funcRadialBlur2(sampler2D tex, vec2 uv, vec2 resolution) {
  const int SAMPLES = 64; // multiple of 2
  vec2 p = uv / resolution;

  vec3  col = vec3(0.0);
  vec2  d = (vec2(0.5) - p) / float(SAMPLES);
  float w = 1.0;
  vec2  s = p;
  for(int i = 0; i < SAMPLES; i++) {
    vec3 res = deform(tex, s);
    col += w * smoothstep(0.0, 1.0, res);
    w *= 0.99;
    s += d;
  }
  return col * 3.5 / float(SAMPLES);
}
`;
