import {
  rect,
  circle,
  polar,
  polygon,
  distanceField,
  concentricCircles,
  fluid,
  planet,
} from "../utils/shapes";
import { funcMap, funcGradiant } from "../utils";

const vertex = `
attribute vec3 position;
attribute vec2 texture;

varying vec2 fragTexture;

void main() {
  fragTexture = texture;
  gl_Position = vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

uniform float time;

varying vec2 fragTexture;

${funcMap}
${distanceField}
${polar}
${polygon}
${circle}
${rect}
${fluid}
${planet}
${concentricCircles}
${funcGradiant}

void main() {
  vec4 color = vec4(0.0);
  
  // vec4 red = vec4(1.0, 0.0, 0.0, 1.0);
  // vec4 green = vec4(0.0, 1.0, 0.0, 1.0);
  // vec4 blue = vec4(0.0, 0.0, 1.0, 1.0);

  // float rect1 = rect(fragTexture, vec2(0.1, 0.1), vec2(0.1, 0.1));
  // float rect2 = rect(fragTexture, vec2(0.15, 0.15), vec2(0.1, 0.1));
  // float circle1 = circle(fragTexture, vec2(0.1, 0.6), 0.1);

  // if (rect1 == 1.0) {
  //   color = red;
  // }
  // if (rect2 == 1.0) {
  //   color = green;
  // }
  // if (circle1 == 1.0) {
  //   color = blue;
  // }


  float dfield1 = distanceField(fragTexture, 10.0, 40.0);
  // color = vec3(dfield1);
  float polar1 = polar(fragTexture, vec2(0.6, 0.2), 10.0);
  // color = vec3(polar1);
  // float polygon1 = polygon(fragTexture, 3, 1.0);
  // if (polygon1 != 0.0) {
    // color = funcGradiant(vec4(1.0,1.0,0.0,1.0), vec4(1.0,0.0,0.0,0.0), 0.2, 0.8, fragTexture);
  // }

  // float distance = 10.0;
  // float step = cos(time * 0.01) * 100.0;
  // float circles = concentricCircles(fragTexture, distance, step);
  // if (circles != 0.0) {
  //   color = funcGradiant(vec4(1.0,1.0,0.0,1.0), vec4(1.0,0.0,0.0,0.0), 0.0, 1.0, fragTexture);
  // }

  // vec4 fluid1 = fluid(fragTexture, vec2(20.0), time * 0.1);
  // vec4 gradiant1 = funcGradiant(
  //   vec4(1.0,1.0,0.0,1.0), 
  //   vec4(1.0,0.0,0.0,0.0), 
  //   0.0, 
  //   1.0, 
  //   fragTexture
  // );
  // color = fluid1 * gradiant1;

  color = planet(fragTexture, 0.7 + (cos(time * 0.1) * 0.2), vec2(time * 0.01));

  gl_FragColor = color;
}
`;

export default {
  vertex,
  fragment,
  attributes: ["texture"],
  uniforms: ["time"],
};
