import { uniformVertShadow, shadowLocations, fragment } from '../utils/shadow';

/* 
use lampe depth map texture to create a black and white shadow map
*/

const vertex = `
attribute vec3 position;
attribute vec3 normale;
attribute vec2 texture;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat3 normalMatrix;

${uniformVertShadow}

varying vec3 fragPosition;
varying vec4 fragShadow;
varying vec3 fragNormale;
varying vec2 fragTexture;

void main() {
  fragShadow = bias * shadowProjection * shadowView * model * vec4(position, 1.0);
  fragNormale = normalMatrix * normale;
  fragTexture = texture;
  fragPosition = normalize((view * model * vec4(position, 1.0)).xyz);
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture', 'normale'],
  uniforms: ['projection', 'model', 'view', 'normalMatrix', 'resolution'].concat(shadowLocations),
};
