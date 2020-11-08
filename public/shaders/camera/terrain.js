import { anothorNoise } from '../utils/noise';

const vertex = `
attribute vec3 position;
attribute vec2 texture;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

uniform sampler2D textureMap;
uniform float time;

varying float fragHeight;

${anothorNoise}

void main() {
  gl_PointSize = 4.0;
  vec3 tranformed = position;

  if (position.y == 0.0) {
    vec2 coord = position.xz + vec2(time, 0.0);
    // float height = texture2D(textureMap, coord).x;
    float height = noise(coord);
    tranformed.y = height;
  }
  fragHeight = tranformed.y;
  
  gl_Position = projection * view * model * vec4(tranformed, 1.0);
}
`;

const fragment = `
precision mediump float;

varying float fragHeight;

void main() {
  vec3 color = vec3(fragHeight);
  gl_FragColor = vec4(color, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['projection', 'model', 'view', 'textureMap', 'time'],
};
