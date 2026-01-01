const vertex = `
attribute vec2 texture;

uniform mat4 projection;
uniform mat4 view;
uniform mat4 model;
uniform sampler2D textureMap;

varying vec4 color;

void main() {
  vec3 particulePos = texture2D(textureMap, texture).xyz;
  // vec3 position = (particulePos * vec3(4.0)) - vec3(2.0);
  particulePos.xz = particulePos.xz * 2.0 - 1.0; // center points
  vec3 position = particulePos;
  
  gl_PointSize = 2.0; 	
  // gl_PointSize = 2.0 + step(1.0 - (1.0 / 64.0), position.x);
  
  gl_Position = projection * view * model * vec4(position, 1.0);

  // color = vec3(position.y * 0.45, 0.1, position.x * 0.755);
  if (position == vec3(0.0)) {
    color = vec4(0.0);
  } else {
    color = vec4(1.0);
  }
}
`;

const fragment = `
precision mediump float;

varying vec4 color;

void main() {
  gl_FragColor = color;
}
`;

export default {
  vertex,
  fragment,
  attributes: ["texture"],
  uniforms: ["projection", "model", "view", "textureMap"],
};
