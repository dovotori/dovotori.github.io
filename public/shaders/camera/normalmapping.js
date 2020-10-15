const vertex = `
attribute vec3 position;
attribute vec3 normale;
attribute vec2 texture;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalMatrix;
uniform vec3 posLum;

varying vec3 fragNormale;
varying vec2 fragTexture;

varying vec3 fragPosLum;
varying vec3 fragPosEye;
varying vec3 fragHalfVec;

void main() {
  fragTexture = texture;

  // ESPACE TANGENT
  vec3 tangent;
  vec3 binormal;
  vec3 normal;

  vec3 c1 = cross(normale, vec3(0.0, 0.0, 1.0));
  vec3 c2 = cross(normale, vec3(0.0, 1.0, 0.0));
  if(length(c1) > length(c2))
  {
    tangent = c1;
  } else {
    tangent = c2;
  }

  normal = normalize(normalMatrix * normale);
  tangent = normalize(normalMatrix * tangent);
  binormal = cross(normal, tangent);
  binormal = normalize(binormal);

  vec3 mvPosition = (view * model * vec4(position, 1.0)).xyz;
  fragNormale = normal;
  vec3 lumDir = normalize(posLum - mvPosition);

  vec3 v;
  v.x = dot(lumDir, tangent);
  v.y = dot(lumDir, binormal);
  v.z = dot(lumDir, normal);
  fragPosLum = normalize(v);

  v.x = dot(mvPosition, tangent);
  v.y = dot(mvPosition, binormal);
  v.z = dot(mvPosition, normal);
  fragPosEye = normalize(v);

  vec3 halfVector = normalize(normalize(mvPosition) + lumDir);
  v.x = dot(halfVector, tangent);
  v.y = dot(halfVector, binormal);
  v.z = dot(halfVector, normal);
  fragHalfVec = v;

  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

varying vec3 fragNormale;
varying vec2 fragTexture;

varying vec3 fragPosLum;
varying vec3 fragPosEye;
varying vec3 fragHalfVec;

uniform sampler2D textureMap;
uniform sampler2D tex1;
uniform float brillance;
uniform vec3 specular;

vec3 bump() {
  vec3 color = texture2D(textureMap, fragTexture).rgb * 0.5;

  vec3 normal = 2.0 * texture2D(tex1, fragTexture).rgb - 1.0;
  normal = normalize(normal);

  // diffuse
  float lambert = max(dot(fragPosLum, normal), 0.0);
  color += texture2D(textureMap, fragTexture).rgb * lambert * 0.4;

  // specular
  if(lambert > 0.0) {
    float specularValue = pow(max(dot(fragHalfVec, normal), 0.0), brillance);
    color += specular * specularValue * 0.4;
  }

	return color;
}

void main() {
	gl_FragColor = vec4(bump(), 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'normale', 'texture'],
  uniforms: [
    'projection',
    'model',
    'view',
    'normalMatrix',
    'posLum',
    'textureMap',
    'tex1',
    'brillance',
    'specular',
  ],
};
