import vertex from './basicVertex';

const fragment = `
precision mediump float;

#define CAP_MAX_DEPTH 0.99 // z limit to compute

uniform sampler2D textureMap;
uniform sampler2D shadowMap;

varying vec2 fragTexture;

void main(void){
  vec3 albedo = texture2D(textureMap, fragTexture).xyz;
  float alpha = texture2D(textureMap, fragTexture).a;

  float shadow = texture2D(shadowMap, fragTexture).r;

  vec3 lighting = albedo * vec3(shadow);
  
  gl_FragColor = vec4(lighting, alpha);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'shadowMap'],
};
