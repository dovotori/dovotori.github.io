import { uniformVertShadow, fragment } from '../utils/shadow';
import { locations, getNaturalHeight } from '../utils/terrain';

const vertex = `
attribute vec3 position;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

uniform vec2 moving;
uniform float fogStart;
uniform float fogEnd;

${uniformVertShadow}

${getNaturalHeight}

void main() {
  vec3 tranformed = position;

  if (position.y == 0.0) {
    vec2 coord = position.xz + moving;
    tranformed.y = getNaturalHeight(coord);
    fragTexture = position.xz * 0.5 + 0.5;
  }
  
  vec4 pos = projection * view * model * vec4(tranformed, 1.0);
  gl_Position = pos;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position'],
  uniforms: ['projection', 'model', 'view', 'textureMap', 'moving'].concat(locations),
};
