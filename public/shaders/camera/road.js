import { PI } from "../utils";
import funcRoadDistortion from "../utils/roadDistortion";

const vertex = `
attribute vec3 position;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

uniform float time;
uniform float roadLength;
uniform vec3 amplitude;
uniform vec3 frequence;

varying vec3 fragPosition;
varying float depth;

${PI}
${funcRoadDistortion}

void main() {
  vec3 transformed = position.xyz;
  
  fragPosition = position;
  depth = 1.0 - (transformed.z * 0.2 / roadLength);

  vec3 distortion = getDistortion(transformed.z / roadLength, frequence, amplitude, time);
  // vec3 distortion = vec3(0.0);

  transformed.x += distortion.x;
  transformed.z += distortion.y;
  transformed.y += -1.0 * distortion.z;  
  
  gl_Position = projection * view * model * vec4(transformed, 1.0);
}
`;

const fragment = `
precision mediump float;

varying vec3 fragPosition;
varying float depth;

uniform float roadWidth;

void main() {
  vec3 roadColor1 = vec3(13.0 / 255.0, 7.1 / 255.0, 32.9 / 255.0);
  vec3 roadColor2 = vec3(193.0 / 255.0, 2.0 / 255.0, 117.0 / 255.0);
  float lineWidth = 0.05;

  vec3 color = roadColor1;
  vec3 pos = fragPosition + 1.0 * 0.5;

  if (
    (pos.x > 0.5 - lineWidth && pos.x < 0.5 + lineWidth) // middle line
    || pos.x > roadWidth - lineWidth
    || pos.x < -roadWidth + 1.0 + lineWidth
  ) {
    color = roadColor2;
  }

  gl_FragColor = vec4(color, depth);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position"],
  uniforms: [
    "projection",
    "model",
    "view",
    "time",
    "roadLength",
    "roadWidth",
    "frequence",
    "amplitude",
  ],
};
