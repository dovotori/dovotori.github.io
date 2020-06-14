import {
  uniformLights, addLightLocations, funcLightsColor,
} from './utils/light';

const vertex = `
attribute vec3 position;
attribute vec3 normale;
attribute vec4 tangent;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalmatrix;
uniform float time;

varying vec3 fragPosition;
varying vec3 fragNormale;

// float turbulence( vec3 p ) {
//   float w = 100.0;
//   float t = -.5;
//   for (float f = 1.0 ; f <= 10.0 ; f++ ) {
//     float power = pow( 2.0, f );
//     t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
//   }
//   return t;
// }

// vec3 deformAlongNormale(vec3 position, vec3 normale, float time) {
//   // // get a turbulent 3d noise using the normal, normal to high freq
//   // noise = 10.0 *  -.10 * turbulence( .5 * normale );
//   // // get a 3d noise using the position, low frequency
//   // float b = 5.0 * pnoise( 0.05 * position, vec3( 100.0 ) );
//   // // compose both noises
//   // float displacement = - 10. * noise + b;
//   float displacement = 1.0 + cos(time * 0.1);

//   // move the position along the normal and transform it
//   return position + normale * displacement;
// }

void main()
{
  // float displacement = cos(time * 0.1) + sin(time * 0.5);
  float displacement = 0.0;
  vec3 newPosition = position + normale * displacement;
  
  fragPosition = normalize((view * model * vec4(newPosition, 1.0)).xyz);
  fragNormale = normalmatrix * normalize(normale);
  gl_Position = projection * view * model * vec4(newPosition, 1.0);
}
`;

const fragment = `
precision mediump float;
varying vec3 fragPosition;
varying vec3 fragNormale;

uniform vec4 color;
uniform float rough; 
uniform float metal;

${uniformLights}
${funcLightsColor}

void main() {
  vec3 phong = funcLightsColor(color.xyz, vec3(1.0,1.0,1.0), vec3(1.0,1.0,1.0), fragNormale, fragPosition);
  gl_FragColor = vec4(phong, 1.0);
  // gl_FragColor = vec4(fragNormale, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'normale', 'tangent'],
  uniforms: [
    'projection',
    'model',
    'view',
    'normalmatrix',
    'color',
    'rough',
    'metal',
    'posLum',
    'posEye',
    'time',
  ].concat(addLightLocations()),
};
