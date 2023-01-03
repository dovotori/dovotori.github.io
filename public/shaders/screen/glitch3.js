import vertex from "./basicVertex";

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform float time;
uniform float delta; // 0 - 1
varying vec2 fragTexture;

float sat( float t ) {
	return clamp( t, 0.0, 1.0 );
}

vec2 sat( vec2 t ) {
	return clamp( t, 0.0, 1.0 );
}

float remap  ( float t, float a, float b ) {
	return sat( (t - a) / (b - a) );
}

float linterp( float t ) {
	return sat( 1.0 - abs( 2.0*t - 1.0 ) );
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

float rand( vec2 n ) {
  return fract(sin(dot(n.xy, vec2(12.9898, 78.233)))* 43758.5453);
}

float mytrunc( float x, float num_levels )
{
	return floor(x*num_levels) / num_levels;
}
vec2 mytrunc( vec2 x, float num_levels )
{
	return floor(x*num_levels) / num_levels;
}

vec4 applyGlitch(sampler2D tex, vec2 fragCoord, float GLITCH)
{
	vec2 uv = fragCoord;
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
	gl_FragColor = applyGlitch(textureMap, fragTexture, delta);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "time", "delta"],
};
