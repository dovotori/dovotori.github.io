const vertex = `
attribute vec3 position;
attribute vec3 next;
attribute vec3 previous;
attribute vec2 texture;
attribute float side;

uniform float weight;
uniform float time;

varying vec2 fragTexture;

vec4 getPosition() {
  vec2 nextScreen = next.xy;
  vec2 prevScreen = previous.xy;

  vec2 tangent = normalize(nextScreen - prevScreen);
  vec2 normal = vec2(-tangent.y, tangent.x);
  // normal *= 0.1;
  // normal *= texture.x * 0.2;
  // normal *= pow(texture.x, 2.0) * 0.2;
  normal *= 1.0 - pow(abs(texture.x - 0.5) * 2.0, 2.0);
  // normal *= abs(fract(texture.x * 2.0) - 0.5) * 0.4;
  // normal *= cos(texture.x * 12.56) * 0.1 + 0.2;
  // normal *= (1.0 - abs(texture.x - 0.5) * 2.0) * 0.2;
  // normal *= (1.0 - pow(abs(texture.x - 0.5) * 2.0, 2.0)) * 0.2;

  normal *= weight;

  // When the points are on top of each other, shrink the line to avoid artifacts.
  float dist = length(nextScreen - prevScreen);
  normal *= smoothstep(0.0, 0.02, dist);

  vec4 current = vec4(position, 1.0);
  current.xy -= normal * side;
  return current;
}

void main() {
  fragTexture = fragTexture;
  gl_Position = getPosition();
}
`;

const fragment = `
precision mediump float;

varying vec2 fragTexture;

uniform vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture', 'next', 'previous', 'side'],
  uniforms: ['time', 'weight', 'color'],
};
