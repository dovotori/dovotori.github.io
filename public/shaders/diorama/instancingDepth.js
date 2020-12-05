import { locations, getNaturalHeight } from '../utils/terrain';
import { funcInstancing } from '../utils/instancing';
import fragment from '../camera/basicFrag';

const vertex = `
attribute vec3 position;
attribute vec3 normale;
attribute vec3 offset;
attribute float size;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform float waterLevel;

${getNaturalHeight}
${funcInstancing}

varying vec3 fragNormale;

void main() {
  vec3 fixedPos = getFixedPosition(offset);
  if (fixedPos.y < waterLevel) {
    fixedPos = vec3(0.0, 100.0, 0.0); // we hide it
  }
  fragNormale = normale;
  vec4 terrainPos = getTerrainPosition(fixedPos, position);
  gl_Position = projection * view * terrainPos;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'normale', 'offset', 'size'],
  uniforms: ['projection', 'model', 'view', 'waterLevel'].concat(locations),
};
