import { PI } from '../utils';
import vertex from './basicVertex';

const rayMarch = `
#define RAY_MARCH_MAX_STEPS 100
#define RAY_MARCH_MAX_DIST 100.
#define RAY_MARCH_SURF_DIST .01 // distance where we have a hit

float rayMarch(vec3 ro, vec3 rd) {
	float dO = 0.;
  for(int i=0; i<RAY_MARCH_MAX_STEPS; i++) {
    vec3 p = ro + rd*dO;
    float dS = getSceneDist(p);
    dO += dS;
    if(dO > RAY_MARCH_MAX_DIST || dS < RAY_MARCH_SURF_DIST) break;
  }  
  return dO;
}
`;

const camera = `
vec3 camera(vec3 rayOrigin, vec2 uv) {
  vec3 lookAtPoint = vec3(0.);
  float zoom = 1.;

  vec3 forward = normalize(lookAtPoint - rayOrigin);
  vec3 right = cross(vec3(0.,1.,0.), forward);
  vec3 up = cross(forward, right);

  vec3 center = rayOrigin + forward * zoom;
  vec3 intersect = center + uv.x * right + uv.y * up;

  return intersect - rayOrigin; // between eye pos and screen position
}

`;

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform float time;

varying vec2 fragTexture;

${PI}
${camera}

float getSceneDist(vec3 point) {
  vec3 spherePosition = vec3(0., 1., 2.);
  float sphereRadius = 0.5;

  float sphereDistance = length(point - spherePosition) - sphereRadius;
  
  float planeY = -0.4;
  float planeDistance = point.y - planeY;

  float d = min(sphereDistance, planeDistance);
  return d;
}

${rayMarch}

vec3 getNormale(vec3 p) {
  float distance = getSceneDist(p);
  vec2 threshold = vec2(.01, 0.);
  vec3 normale = distance - vec3(
    getSceneDist(p - threshold.xyy),
    getSceneDist(p - threshold.yxy),
    getSceneDist(p - threshold.yyx)
  );
  return normalize(normale);
}

float getLight(vec3 p) {
  vec3 lightPos = vec3(0.,5.,-1.);
  vec3 lightDir = normalize(lightPos - p);
  vec3 normale = getNormale(p);
  float diffuse = clamp(dot(normale, lightDir), 0., 1.);

  // shadow
  float distranceToLight = rayMarch(p + normale * 0.02, lightDir);
  if (distranceToLight < length(lightPos - p)) {
    diffuse *= .1;
  }
  return diffuse;
}

void main() {
  vec2 uv = fragTexture - 0.5; 

  vec3 rayOrigin = vec3(0., 1., -4.); // eye pos
  vec3 rayDirection = camera(rayOrigin, uv);

  float d = rayMarch(rayOrigin, rayDirection);
  // d /= 6.; // distance is > 1 so we need to lower this arbitrarely

  vec3 p = rayOrigin + rayDirection * d;

	gl_FragColor = vec4(vec3(getLight(p)), 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'time'],
};
