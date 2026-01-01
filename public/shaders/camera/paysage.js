import { funcLightsColor } from "../utils/light";
import { funcPBR, locationsPBR } from "../utils/pbr";
import { funcShadow, shadowLocations, uniformFragShadow, uniformVertShadow } from "../utils/shadow";

// import { funcLightsToon } from '../utils/toon';

const vertex = `
attribute vec3 position;
attribute vec3 normale;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform mat4 inverseModel;
uniform mat3 normalMatrix;

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec4 fragShadow;
varying vec3 fragTransformPosition;

${uniformVertShadow}

void main()
{
  fragPosition = normalize((view * model * vec4(position, 1.0)).xyz);
  fragNormale = normalMatrix * normalize(normale);
  fragShadow = bias * shadowProjection * shadowView * model * vec4(position, 1.0);
  fragTransformPosition = (projection * view * inverseModel * model * vec4(position, 1.0)).xyz;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

uniform vec2 resolution;
uniform vec3 posEye;

${uniformFragShadow}

varying vec3 fragPosition;
varying vec3 fragNormale;
varying vec4 fragShadow;
varying vec3 fragTransformPosition;

${funcPBR}
${funcShadow}
${funcLightsColor}

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
    // float shadow = funcShadow(fragShadow, resolution, lambertCosinus);
    gl_FragColor = vec4(pbr, 1.0);
    // gl_FragColor = vec4(vec3(shadow), 1.0);

    // vec3 colorToon = funcLightsToon(color.xyz, fragPosition, fragNormale);
    // gl_FragColor = vec4(colorToon, 1.0);
  }
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "normale"],
  uniforms: [
    "projection",
    "view",
    "model",
    "inverseModel",
    "normalMatrix",
    "resolution",
    "ambiantMap",
    "posEye",
  ]
    .concat(locationsPBR)
    .concat(shadowLocations),
};
