import { uniformLights, addLights, funcLightsColor } from './utils';

const vertex = `
attribute vec3 position;
attribute vec3 normale;
attribute vec3 ambiant;
attribute vec3 diffuse;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalmatrix;

varying vec3 fragAmbiant;
varying vec3 fragDiffuse;
varying vec3 fragPosition;
varying vec3 fragNormale;

void main() {
  fragAmbiant = ambiant;
  fragDiffuse = diffuse;
  fragPosition = (view * model * vec4(position, 1.0)).xyz;
  fragNormale = normalmatrix * normale;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

varying vec3 fragAmbiant;
varying vec3 fragDiffuse;
varying vec3 fragPosition;
varying vec3 fragNormale;

${uniformLights}

${funcLightsColor}

void main() {
  vec3 color = funcLightsColor(fragAmbiant, fragDiffuse, vec3(1.0,1.0,1.0), fragNormale, fragPosition);
  gl_FragColor = vec4(color, 1.0);
  // gl_FragColor = vec4(lights[0].position, 1.0);
  // gl_FragColor = vec4(normalize(fragNormale), 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'normale', 'ambiant', 'diffuse'],
  uniforms: ['projection', 'model', 'view', 'normalmatrix'].concat(addLights()),
};
