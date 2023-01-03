import getClouds from "./getClouds";
import getSunSky from "./getSunSky";
import vertex from "../screen/basicVertex";

const fragment = `
precision mediump float;

uniform vec2 resolution;
uniform vec2 wind;
uniform float time;
uniform sampler2D textureMap;

#define SKY_COLOR vec3(59.0 / 255.0, 176.0 / 255.0, 178.0 / 255.0)
#define CLOUD_COLOR vec3(255.0 / 255.0, 255.0 / 255.0, 250.0 / 255.0)
${getClouds}

#define SUN_SKY_COLOR_1 vec3(13.0 / 255.0, 7.1 / 255.0, 32.9 / 255.0)
#define SUN_SKY_COLOR_2 vec3(193.0 / 255.0, 2.0 / 255.0, 117.0 / 255.0)
#define SUN_SKY_COLOR_3 vec3(97.0 / 255.0, 191.0 / 255.0, 193.0 / 255.0)
#define SUN_COLOR vec3(255.0 / 255.0, 113.0 / 255.0, 45.0 / 255.0)
#define SUN_INTENSITY 0.6
${getSunSky}

varying vec2 fragTexture;


vec3 getColor(vec2 p, vec3 rd) {
  float sun = clamp(dot(sundir, rd), 0.0, 1.0);
  vec3 color = mix(vec3(0.78, 0.78, 0.7), vec3(0.3, 0.4, 0.5), p.y * 0.5 + 0.5);
  color += 0.5 * vec3(1.0, 0.5, 0.1) * pow(sun, 8.0);
  return color;
}

void main() {
  vec2 uv = -1.0 + 2.0 * fragTexture;
  // vec3 color = getColor(uv, normalize(vec3(uv, 1.5)));

  vec3 color = getSunSky(uv);

  color = getClouds(textureMap, uv, time, color, wind);
  gl_FragColor = vec4(color, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "resolution", "time", "wind"],
};
