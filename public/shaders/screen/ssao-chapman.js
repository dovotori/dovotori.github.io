// https://john-chapman-graphics.blogspot.com/2013/01/ssao-tutorial.html
// not working for me :(

// import vertex from './basicVertex';

const vertex = `
attribute vec3 position;
attribute vec2 texture;
varying vec2 fragTexture;

void main() {
  fragTexture = texture;
  gl_Position = vec4(position, 1.0);
}
`;

export const NUM_SAMPLES = 64;
export const NUM_NOISE = 4; // tex size

const fragment = `
precision mediump float;
#define NUM_SAMPLES ${NUM_SAMPLES}
#define NUM_NOISE ${NUM_NOISE}

uniform vec3 samples[NUM_SAMPLES];
uniform mat4 projection;
uniform mat4 inverseProjection;
uniform mat4 inverseView;
uniform vec2 resolution;
uniform float radius;
uniform sampler2D positionMap;
uniform sampler2D normalMap;
uniform sampler2D noiseMap;
uniform sampler2D depthMap;

varying vec2 fragTexture;

// vec3 getPositionFromDepth(vec2 uv) {
//   float x = uv.x * 2.0 - 1.0;
//   float y = uv.y * 2.0 - 1.0;
//   float z = texture2D(depthMap, uv).r * 2.0 - 1.0;  
//   vec4 projectedPos = vec4(x, y, z, 1.0) * inverseProjection;
//   return projectedPos.xyz / projectedPos.w;  
// }

// vec3 getPositionFromDepth(vec2 uv) {
//   float z = texture2D(depthMap, uv).r;
//   vec3 position = vec3(uv, z) * 2.0 - 1.0;
//   vec4 clipSpacePosition = vec4(position, 1.0);
//   vec4 viewSpacePosition = inverseProjection * clipSpacePosition;
//   viewSpacePosition /= viewSpacePosition.w;
//   return viewSpacePosition.xyz;
//   vec4 worldSpacePosition = inverseView * viewSpacePosition;
//   return worldSpacePosition.xyz;
// }

float funcSsao(vec2 uv) {
  vec3 position = texture2D(positionMap, uv).xyz * 2.0 - 1.0;
  vec3 normal = normalize(texture2D(normalMap, uv).xyz * 2.0 - 1.0);

  vec2 noiseScale = resolution / float(NUM_NOISE);
  vec3 random = texture2D(noiseMap, uv * noiseScale).xyz * 2.0 - 1.0;
  vec3 tangent = normalize(random - normal * dot(random, normal));
  vec3 bitangent = cross(normal, tangent);
  mat3 tbn = mat3(tangent, bitangent, normal); // orientation matrix

  float occlusion = 0.0;
  for (int i = 0; i < NUM_SAMPLES; ++i) {
    vec3 sample = tbn * samples[i];
    sample = position + sample * radius;
    
    vec4 offset = vec4(sample, 1.0);
    offset = projection * offset;
    offset.xy /= offset.w;
    offset.xy = offset.xy * 0.5 + 0.5;
    
    float sampleDepth = texture2D(positionMap, offset.xy).z * 2.0 - 1.0;
    
    // float rangeCheck = abs(position.z - sampleDepth) < radius ? 1.0 : 0.0;
    occlusion += (sampleDepth <= sample.z ? 1.0 : 0.0);
  }
  return 1.0 - (occlusion / float(NUM_SAMPLES));
}

void main() {
  gl_FragColor = vec4(vec3(funcSsao(fragTexture)), 1.0);
  
  // gl_FragColor = vec4(vec3(texture2D(positionMap, fragTexture).z), 1.0);
  // gl_FragColor = vec4(getPositionFromDepth(fragTexture), 1.0);
  // gl_FragColor = vec4(vec3(getPositionFromDepth(fragTexture).z), 1.0);
  // gl_FragColor = texture2D(positionMap, fragTexture);
  // gl_FragColor = texture2D(normalMap, fragTexture);
  // gl_FragColor = texture2D(depthMap, fragTexture);
  // gl_FragColor = vec4(vec3(texture2D(depthMap, fragTexture).r * 2.0 - 1.0), 1.0);

  // vec2 noiseScale = resolution / 4.0;
  // vec3 random = texture2D(noiseMap, fragTexture).xyz * 2.0 - 1.0;
  // gl_FragColor = vec4(random, 1.0);
  
  // gl_FragColor = vec4(vec3(samples[0].z), 1.0);
}
`;

const addSamplesLocations = () => Array.from(Array(NUM_SAMPLES).keys()).map((i) => `samples[${i}]`);

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: [
    'positionMap',
    'normalMap',
    'depthMap',
    'noiseMap',
    'projection',
    'inverseProjection',
    'inverseView',
    'radius',
    'resolution',
  ].concat(addSamplesLocations()),
};
