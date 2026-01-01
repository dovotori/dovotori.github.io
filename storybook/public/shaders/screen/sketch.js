import vertex from "./basicVertex";

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform sampler2D textureMap;
uniform float delta;
uniform vec2 resolution;

const mediump vec3 W = vec3(0.2125, 0.7154, 0.0721);

void main() {
  mediump vec3 textureColor = texture2D(textureMap, fragTexture).rgb;

  mediump vec2 stp0 = vec2(1.0 / resolution.x, 0.0);
  mediump vec2 st0p = vec2(0.0, 1.0 / resolution.y);
  mediump vec2 stpp = vec2(1.0 / resolution.x, 1.0 / resolution.y);
  mediump vec2 stpm = vec2(1.0 / resolution.x, -1.0 / resolution.y);

  mediump float i00   = dot(textureColor, W);
  mediump float im1m1 = dot(texture2D(textureMap, fragTexture - stpp).rgb, W);
  mediump float ip1p1 = dot(texture2D(textureMap, fragTexture + stpp).rgb, W);
  mediump float im1p1 = dot(texture2D(textureMap, fragTexture - stpm).rgb, W);
  mediump float ip1m1 = dot(texture2D(textureMap, fragTexture + stpm).rgb, W);
  mediump float im10 = dot(texture2D(textureMap, fragTexture - stp0).rgb, W);
  mediump float ip10 = dot(texture2D(textureMap, fragTexture + stp0).rgb, W);
  mediump float i0m1 = dot(texture2D(textureMap, fragTexture - st0p).rgb, W);
  mediump float i0p1 = dot(texture2D(textureMap, fragTexture + st0p).rgb, W);
  mediump float h = -im1p1 - 2.0 * i0p1 - ip1p1 + im1m1 + 2.0 * i0m1 + ip1m1;
  mediump float v = -im1m1 - 2.0 * im10 - im1p1 + ip1m1 + 2.0 * ip10 + ip1p1;

  mediump float mag = 1.0 - length(vec2(h, v));
  mediump vec3 target = vec3(mag);

  gl_FragColor = vec4(mix(textureColor, target, delta), 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "delta", "resolution"],
};
