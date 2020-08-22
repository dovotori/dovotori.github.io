import vertex from '../screen/basicVertex';

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform vec2 resolution;
uniform float time;

varying vec2 fragTexture;

vec3 skyColor(vec3 rd) {
  vec3 sundir = normalize(vec3(0.0, 0.1, 1.0));
  
  float yd = min(rd.y, 0.0);
  rd.y = max(rd.y, 0.0);
  
  vec3 color = vec3(0.0);
  
  color += vec3(0.4, 0.4 - exp(-rd.y * 20.0)*.3, .0) * exp(-rd.y * 9.0); // Red / Green 
  color += vec3(0.3, 0.5, 0.6) * (1.0 - exp(-rd.y * 8.0)) * exp(-rd.y * 0.9) ; // Blue
  
  color = mix(color * 1.2, vec3(0.3),  1.0 - exp(yd * 100.0)); // Fog
  
  color += vec3(1.0, 0.8, 0.55) * pow(max(dot(rd, sundir), 0.0), 15.0) * 0.6; // Sun
  color += pow(max(dot(rd, sundir), 0.0), 150.0) * 0.15;
  
  return color;
}


float checker(vec2 p) {
  p = mod(floor(p), 2.0);
  return mod(p.x + p.y, 2.0) < 1.0 ? 0.25 : 0.1;
}


vec3 sky(vec2 uv, vec2 resolution) {
  // Screen coords
	vec2 q = uv; // / resolution;
	vec2 v = -1.0 + 2.0 * q;
	// v.x *= resolution.x / resolution.y;
	
	// Camera ray
	vec3 dir = normalize(vec3(v.x, v.y + 0.5, 1.5));
	
  // Scene
  vec3 color = vec3(checker(dir.xz / dir.y * 0.5 + vec2(0.0, -time * 2.0))) + skyColor(reflect(dir, vec3(0.0, 1.0, 0.0))) * 0.3;
  color = mix(color, skyColor(dir), exp(-max(-v.y * 9.0 - 4.8, 0.0)));

  // Vignetting
	color *= 0.7 + 0.3 * pow(q.x * q.y * (1.0 - q.x) * (1.0 - q.y) * 16.0, 0.1);
        
	return color;
}

void main() {
  vec3 color = sky(fragTexture, resolution);
  gl_FragColor = vec4(color, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'resolution', 'time'],
};
