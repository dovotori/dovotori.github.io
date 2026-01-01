import vertex from "../screen/basicVertex";

const fragment = `
precision mediump float;

uniform vec2 resolution;
uniform float time;

varying vec2 fragTexture;

const float coeiff = 0.25;
const vec3 totalSkyLight = vec3(0.3, 0.5, 1.0);

vec3 mie(float dist, vec3 sunL) {
  return max(exp(-pow(dist, 0.25)) * sunL - 0.4, 0.0);
}

vec3 getSky(vec2 uv, float time) {
	vec2 sunPos = vec2(0.5, cos(time * 0.3 + 3.14 * 0.564));  
  float sunDistance = distance(uv, clamp(sunPos, -1.0, 1.0));
	
	float scatterMult = clamp(sunDistance, 0.0, 1.0);
	float sun = clamp(1.0 - smoothstep(0.01, 0.011, scatterMult), 0.0, 1.0);
	
	float dist = uv.y;
	dist = (coeiff * mix(scatterMult, 1.0, dist)) / dist;
    
  vec3 mieScatter = mie(sunDistance, vec3(1.0));
	
	vec3 color = dist * totalSkyLight;
    
  color = max(color, 0.0);
    
	color = max(mix(pow(color, 1.0 - color),
	color / (2.0 * color + 0.5 - color),
	clamp(sunPos.y * 2.0, 0.0, 1.0)),0.0)
	+ sun + mieScatter;
	
	color *=  (pow(1.0 - scatterMult, 10.0) * 10.0) + 1.0;
	
	float underscatter = distance(sunPos.y * 0.5 + 0.5, 1.0);
	
	color = mix(color, vec3(0.0), clamp(underscatter, 0.0, 1.0));
	return color;	
}

void main(){
  vec2 uv = -1.0 + 2.0 * fragTexture;
	vec3 color = getSky(uv, time);
	color = color / (2.0 * color + 0.5 - color);
	gl_FragColor = vec4(color, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "resolution", "time"],
};
