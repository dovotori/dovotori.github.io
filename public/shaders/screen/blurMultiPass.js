import { funcBlurDirection } from "../utils/blur";
import vertex from "./basicVertex";

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform float size;
uniform float direction;
uniform float intensity;
uniform vec2 resolution;

${funcBlurDirection}

void main() {
  // vec3 blur = funcBlurDirection(textureMap, fragTexture, resolution, direction, size).xyz;
  // float alpha = texture2D(textureMap, fragTexture).a;
  // gl_FragColor = vec4(blur, alpha);
  gl_FragColor = funcBlurDirection(
    textureMap,
    fragTexture,
    resolution,
    direction,
    size
  ) * intensity;
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "resolution", "size", "direction", "intensity"],
};
