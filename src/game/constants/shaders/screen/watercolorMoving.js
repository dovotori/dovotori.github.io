import vertex from './basicVertex';

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform float time;
uniform vec2 mouse;
uniform float scale;

void main() {
  vec4 color = texture2D(textureMap, fragTexture);

  float speed = .1;
  vec2 p = fragTexture * scale;   
  for(int i = 1; i < 10; i++){
    p.x += 0.3 / float(i) * sin(float(i) * 3. * p.y + time * speed) + mouse.x / 1000.;
    p.y += 0.3 / float(i) * cos(float(i) * 3. * p.x + time * speed) + mouse.y / 1000.;
  }
  float r = cos(p.x + p.y + 1.) * .5 + .5;
  // float g = sin(p.x + p.y + 1.) * .5 + .5;
  // float b = (sin(p.x + p.y) + cos(p.x + p.y)) * .5 + .5;
  // vec3 watercolor = vec3(r, g, b);

  gl_FragColor = vec4(color.xyz * r, color.a);
}`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'mouse', 'time', 'scale'],
};
