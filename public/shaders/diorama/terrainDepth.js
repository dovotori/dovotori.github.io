import fragment from "../camera/basicFrag";
import { getNaturalHeight, locations } from "../utils/terrain";

const vertex = `
attribute vec3 position;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

${getNaturalHeight}

void main() {
  vec3 tranformed = position;

  if (position.y == 0.0) {
    vec2 coord = position.xz + moving;
    tranformed.y = getNaturalHeight(coord);
  }

  gl_Position = projection * view * model * vec4(tranformed, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position"],
  uniforms: ["projection", "model", "view"].concat(locations),
};
