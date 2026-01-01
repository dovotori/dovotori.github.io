import { PI } from "../utils";
import vertex from "./basicVertex";

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform float time;

varying vec2 fragTexture;

${PI}

void main() {
	vec2 p = fragTexture * 2.0 - 1.0;
  float a = atan(p.y, p.x);
  float r = pow(pow(p.x * p.x, 4.0) + pow(p.y * p.y, 4.0), 1.0 / 8.0);
  
  // index texture by (animated inverse) radious and angle
  vec2 uv = vec2( 0.3 / r + 0.2 * time, a / PI);

  // vec3 col =  texture2D(textureMap, uv).xyz;
  vec3 col =  vec3(cos(uv.x), 0.0, 0.0);
  // darken at the center    
  col = col * r;
	gl_FragColor = vec4(col, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "time"],
};
