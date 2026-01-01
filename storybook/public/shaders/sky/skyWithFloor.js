import vertex from "../screen/basicVertex";
import getSunSky from "./getSunSky";

const fragment = `
precision mediump float;

uniform vec2 resolution;
uniform float time;

varying vec2 fragTexture;

${getSunSky}

float checker(vec2 p) {
  p = mod(floor(p), 2.0);
  return mod(p.x + p.y, 2.0) < 1.0 ? 0.25 : 0.1;
}

vec3 sky(vec2 uv, vec2 resolution) {
  // Screen coords
	vec2 q = uv; // / resolution;
	vec2 v = -1.0 + 2.0 * q;
	// v.x *= resolution.x / resolution.y;
	
  float horizonY = v.y - 0.05;

	// Camera ray
	vec3 dir = normalize(vec3(v.x, horizonY, 1.5));
	
  vec3 colorFloor = vec3(0.0, 0.0, 0.1);
  // vec3 colorFloor = vec3(checker(dir.xz / dir.y * 0.5 + vec2(0.0, -time * 2.0)));
  // vec3 colorReflect = getSunSky(reflect(dir, vec3(0.0, 1.0, 0.0)));

  vec3 colorSky = getSunSky(uv);

  // Scene
  float mixRatio = exp(-max(-horizonY, 0.0));
  vec3 color = mix(colorFloor, colorSky, mixRatio);

  // Vignetting
	// color *= 0.7 + 0.3 * pow(q.x * q.y * (1.0 - q.x) * (1.0 - q.y) * 16.0, 0.1);
        
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
  attributes: ["position", "texture"],
  uniforms: ["flipY", "resolution", "time"],
};
