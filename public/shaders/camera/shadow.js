import { uniformVertShadow, shadowLocations, fragment } from "../utils/shadow";

/* 
use lampe depth map texture to create a black and white shadow map
*/

const vertex = `
attribute vec3 position;
attribute vec3 normale;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat3 normalMatrix;

${uniformVertShadow}

varying vec3 fragPosition;
varying vec4 fragShadow;
varying vec3 fragNormale;

void main() {
  vec4 pos = view * model * vec4(position, 1.0);
  fragShadow = bias * shadowProjection * shadowView * model * vec4(position, 1.0);
  fragNormale = normalMatrix * normale;
  fragPosition = normalize(pos.xyz);
  gl_Position = projection * pos;
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "normale"],
  uniforms: [
    "projection",
    "model",
    "view",
    "normalMatrix",
    "resolution",
  ].concat(shadowLocations),
};
