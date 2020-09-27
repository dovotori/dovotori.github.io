import /* funcLightsColor */ '../utils/light';
import { funcPBR, PBRLocations } from '../utils/pbr';
import { uniformShadow, funcShadow, shadowLocations } from '../utils/shadow';

const vertex = `
attribute vec3 position;
attribute vec3 normale;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat4 inverseModel;
uniform mat3 normalmatrix;

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec4 fragShadow;
varying vec3 fragTransformPosition;

${uniformShadow}

void main()
{
  fragPosition = normalize((view * model * vec4(position, 1.0)).xyz);
  fragNormale = normalmatrix * normalize(normale);
  fragShadow = bias * shadowprojection * shadowview * model * vec4(position, 1.0);
  fragTransformPosition = (projection * view * inverseModel * model * vec4(position, 1.0)).xyz;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

uniform vec2 resolution;
uniform sampler2D shadowMap;
uniform vec3 posEye;

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec4 fragShadow;
varying vec3 fragTransformPosition;

${funcPBR}
${funcShadow}

void main() {
  if (
    fragTransformPosition.z < -10.0 || fragTransformPosition.z > 8.0 ||
    fragTransformPosition.x > 10.0 || fragTransformPosition.x < -8.0
  ) {
    gl_FragColor = vec4(0.0);
  } else {
    // vec3 phong = funcLightsColor(
    //   color.xyz,
    //   vec3(1.0,1.0,1.0),
    //   vec3(1.0,1.0,1.0),
    //   fragNormale,
    //   fragPosition
    // );
    vec3 pbr = funcPBR(fragPosition, fragNormale, posEye);
    float epsilon = 0.005; // Fix shadow acne
    float shadow = funcShadow(shadowMap, fragShadow, resolution, epsilon);
    // gl_FragColor = vec4(pbr * shadow, 1.0);
    gl_FragColor = vec4(vec3(shadow), 1.0);
  }
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'normale'],
  uniforms: ['projection', 'view', 'model', 'inverseModel', 'normalmatrix', 'resolution', 'posEye']
    .concat(PBRLocations)
    .concat(shadowLocations),
};
