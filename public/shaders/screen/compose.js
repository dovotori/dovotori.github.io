import vertex from './basicVertex';

const fragment = `
precision mediump float;

#define CAP_MAX_DEPTH 0.99 // z limit to compute

uniform sampler2D textureMap;
uniform sampler2D ssaoMap;
uniform sampler2D shadowMap;
uniform sampler2D depthMap;

varying vec2 fragTexture;

void main(void){
  vec3 albedo = texture2D(textureMap, fragTexture).xyz;

  float ssao = texture2D(ssaoMap, fragTexture).r;
  float shadow = texture2D(shadowMap, fragTexture).r;

  float depth = texture2D(depthMap, fragTexture).r * 2.0 - 1.0;
  float opacity = depth > CAP_MAX_DEPTH ? 0.0 : 1.0;

  vec3 lighting = albedo * vec3(ssao) * vec3(shadow) * 2.0;
  
  gl_FragColor = vec4(lighting, opacity);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'ssaoMap', 'shadowMap', 'depthMap'],
};
