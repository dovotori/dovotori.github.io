import { uniformVertShadow, fragment, shadowLocations } from '../utils/shadow';
import { locations, getNaturalHeight, getNormale } from '../utils/terrain';

const vertex = `
attribute vec3 position;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;

uniform float fogStart;
uniform float fogEnd;

${uniformVertShadow}

${getNaturalHeight}
${getNormale}

varying vec3 fragPosition;
varying vec4 fragShadow;
varying vec3 fragNormale;

void main() {
  vec3 tranformed = position;

  if (position.y == 0.0) {
    vec2 coord = position.xz + moving;
    tranformed.y = getNaturalHeight(coord);
  }

  vec4 pos = view * model * vec4(tranformed, 1.0);
  fragShadow = bias * shadowProjection * shadowView * model * vec4(tranformed, 1.0);
  fragNormale = normalMatrix * getNormale(position, tranformed);
  fragPosition = normalize(pos.xyz);
  gl_Position = projection * pos;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position'],
  uniforms: ['projection', 'model', 'view', 'normalMatrix', 'resolution']
    .concat(locations)
    .concat(shadowLocations),
};
