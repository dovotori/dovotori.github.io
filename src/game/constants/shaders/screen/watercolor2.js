import vertex from './basicVertex';

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform sampler2D heightMap;

uniform float gradientStep;
uniform float advectStep;
uniform float flipHeightMap;
uniform float time;

varying vec2 fragTexture;

void main() {
  vec4 advectMatrix = vec4(0.1);
  vec4 cxp = texture2D(heightMap, vec2(fragTexture.x + gradientStep, flipHeightMap * fragTexture.y));
  vec4 cxn = texture2D(heightMap, vec2(fragTexture.x - gradientStep, flipHeightMap * fragTexture.y));
  vec4 cyp = texture2D(heightMap, vec2(fragTexture.x, flipHeightMap*(fragTexture.y + gradientStep)));
  vec4 cyn = texture2D(heightMap, vec2(fragTexture.x, flipHeightMap*(fragTexture.y - gradientStep)));

  vec3 grey = vec3(.3, .59, .11);
  float axp = dot(grey, cxp.xyz);
  float axn = dot(grey, cxn.xyz);
  float ayp = dot(grey, cyp.xyz);
  float ayn = dot(grey, cyn.xyz);

  vec2 grad = vec2(axp - axn, ayp - ayn);
  vec2 newTexCoor = fragTexture + advectStep * normalize(advectMatrix.xy * grad) * time;

  vec4 color = texture2D(textureMap, fragTexture);
  vec3 final = texture2D(textureMap, newTexCoor).rgb * color.rgb;
  gl_FragColor = vec4(final, color.a);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'heightMap', 'gradientStep', 'advectStep', 'time', 'flipHeightMap'],
};
