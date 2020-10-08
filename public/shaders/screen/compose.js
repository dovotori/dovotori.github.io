import vertex from './basicVertex';

const fragment = `
precision mediump float;

#define CAP_MAX_DEPTH 0.99 // z limit to compute

uniform sampler2D textureMap;
uniform sampler2D ssaoMap;
uniform sampler2D shadowMap;

varying vec2 fragTexture;

void main(void){
  vec4 albedo = texture2D(textureMap, fragTexture);
  vec4 ssao = texture2D(ssaoMap, fragTexture);
  vec4 shadow = texture2D(shadowMap, fragTexture);

  // float fragDepth = texture2D(depthMap, fragTexture).r * 2.0 - 1.0;
  float opacity = 1.0; // fragDepth > CAP_MAX_DEPTH ? 0.0 : 1.0;
  vec4 lighting = ((albedo * shadow) / 2.0) * ssao;
  
  gl_FragColor = albedo;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'ssaoMap', 'shadowMap'],
};
