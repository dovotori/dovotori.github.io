import { funcPhong } from '../utils/light';

const vertex = `
attribute vec3 position;
attribute vec3 normale;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;
varying vec3 fragPosition;
varying vec3 fragNormale;
void main()
{
  fragPosition = normalize((view * model * vec4(position, 1.0)).xyz);
  fragNormale = normalMatrix * normalize(normale);
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;
varying vec3 fragPosition;
varying vec3 fragNormale;

uniform vec3 ambiant;
uniform vec3 diffuse;
uniform vec3 specular;
uniform float brillance; // de 0 à infini
uniform vec3 posLum;
uniform vec3 posEye;

${funcPhong}

void main() {
  gl_FragColor = vec4(phong(), 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'normale'],
  uniforms: [
    'projection',
    'model',
    'view',
    'normalMatrix',
    'ambiant',
    'diffuse',
    'specular',
    'brillance',
    'posLum',
    'posEye',
  ],
};
