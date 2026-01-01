import { funcRandRange } from "../utils/random";
import vertex from "./basicVertex";

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform float time;
uniform float delta;
varying vec2 fragTexture;

${funcRandRange}

float sat( float t ) {
	return clamp( t, 0.0, 1.0 );
}

vec2 sat( vec2 t ) {
	return clamp( t, 0.0, 1.0 );
}

float remap( float t, float a, float b ) {
	return sat( (t - a) / (b - a) );
}

float linterp( float t ) {
	return sat( 1.0 - abs( 2.0 * t - 1.0 ) );
}

vec3 spectrum_offset( float t ) {
	vec3 ret;
	float lo = step(t,0.5);
	float hi = 1.0-lo;
	float w = linterp( remap( t, 1.0/6.0, 5.0/6.0 ) );
	float neg_w = 1.0-w;
	ret = vec3(lo,1.0,hi) * vec3(neg_w, w, neg_w);
	return pow( ret, vec3(1.0/2.2) );
}

float insideRange(float v, float bottom, float top) {
  return step(bottom, v) - step(top, v);
}

float mytrunc( float x, float num_levels )
{
	return floor(x*num_levels) / num_levels;
}
vec2 mytrunc( vec2 x, float num_levels )
{
	return floor(x*num_levels) / num_levels;
}

/* GLITCH */

vec4 applyGlitch(sampler2D tex, vec2 uv, float speed, float AMT, float time) {
  float t = floor(time * speed * 60.0);    
  vec4 outCol = texture2D(tex, uv);
    
  float maxOffset = AMT / 2.0;
  const float LIMIT =  10.0;
  for (float i = 0.0; i < LIMIT; i += 1.0) {
    float sliceY = rand(vec2(t , 2345.0 + float(i)));
    float sliceH = rand(vec2(t , 9035.0 + float(i))) * 0.25;
    float hOffset = randomRange(vec2(t , 9625.0 + float(i)), -maxOffset, maxOffset);
    vec2 uvOff = uv;
    uvOff.x += hOffset;
    if (insideRange(uv.y, sliceY, fract(sliceY+sliceH)) == 1.0 ){
      outCol = texture2D(tex, uvOff);
    }
  }
    
  // do slight offset on one entire channel
  float maxColOffset = AMT / 6.0;
  float rnd = rand(vec2(t , 9545.0));
  vec2 colOffset = vec2(randomRange(vec2(t , 9545.0), -maxColOffset,maxColOffset), 
                      randomRange(vec2(t , 7205.0), -maxColOffset,maxColOffset));
  if (rnd < 0.33) {
    outCol.r = texture2D(tex, uv + colOffset).r;  
  } else if (rnd < 0.66){
    outCol.g = texture2D(tex, uv + colOffset).g;  
  } else {
    outCol.b = texture2D(tex, uv + colOffset).b;  
  }

	return vec4(outCol);
}

/* GLITCH 3 */

vec4 applyGlitch3(sampler2D tex, vec2 uv, float GLITCH, float time)
{
	float newtime = mod(time * 100.0, 32.0)/110.0; // + modelmat[0].x + modelmat[0].z;
	
	float gnm = sat( GLITCH );
	float rnd0 = rand( mytrunc( vec2(newtime, newtime), 6.0 ) );
	float r0 = sat((1.0-gnm)*0.7 + rnd0);
	float rnd1 = rand( vec2(mytrunc( uv.x, 10.0*r0 ), newtime) ); //horz
	//float r1 = 1.0f - sat( (1.0f-gnm)*0.5f + rnd1 );
	float r1 = 0.5 - 0.5 * gnm + rnd1;
	r1 = 1.0 - max( 0.0, ((r1<1.0) ? r1 : 0.9999999) ); //note: weird ass bug on old drivers
	float rnd2 = rand( vec2(mytrunc( uv.y, 40.0*r1 ), newtime) ); //vert
	float r2 = sat( rnd2 );

	float rnd3 = rand( vec2(mytrunc( uv.y, 10.0*r0 ), newtime) );
	float r3 = (1.0-sat(rnd3+0.8)) - 0.1;

	float pxrnd = rand( uv + newtime );

	float ofs = 0.05 * r2 * GLITCH * ( rnd0 > 0.5 ? 1.0 : -1.0 );
	ofs += 0.5 * pxrnd * ofs;

	uv.y += 0.1 * r3 * GLITCH;

  const int NUM_SAMPLES = 20;
  const float RCP_NUM_SAMPLES_F = 1.0 / float(NUM_SAMPLES);
    
	vec4 sum = vec4(0.0);
	vec3 wsum = vec3(0.0);
	for(int i = 0; i < NUM_SAMPLES; i += 1) {
		float t = float(i) * RCP_NUM_SAMPLES_F;
		uv.x = sat( uv.x + ofs * t );
		vec4 samplecol = texture2D( tex, uv, -10.0 );
		vec3 s = spectrum_offset( t );
		samplecol.rgb = samplecol.rgb * s;
		sum += samplecol;
		wsum += s;
	}
	sum.rgb /= wsum;
	sum.a *= RCP_NUM_SAMPLES_F;

	return sum;
}

void main() {
  vec4 color1 = applyGlitch3(textureMap, fragTexture, delta, time);
  vec4 color2 = applyGlitch(textureMap, fragTexture, delta, delta, time);
  gl_FragColor = mix(color1, color2, vec4(0.5));
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "time", "delta"],
};
