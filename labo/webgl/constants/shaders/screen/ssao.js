import vertex from './basicVertex';

const fragment = `
precision mediump float;

#define KERNEL_SIZE 32
#define CAP_MIN_DISTANCE 0.005 // removes artifacts caused by neighbour fragments with minimal depth difference.
#define CAP_MAX_DISTANCE 0.05 // avoids the influence of fragments, which are too far away.
#define CAP_MAX_DEPTH 0.99 // limit to compute ssao

uniform sampler2D textureMap;
uniform sampler2D normalMap;
uniform sampler2D depthMap;
uniform vec3 sampleKernel[KERNEL_SIZE];
uniform sampler2D noiseMap; 
uniform mat4 inverseProjection;
uniform mat4 projection;
uniform float radius;
uniform vec2 resolution;

varying vec2 fragTexture;

vec4 getViewPos(vec2 uv, sampler2D depthMap, mat4 inverseProjection) {
	// Calculate out of the fragment in screen space the view space position.
	float x = uv.s * 2.0 - 1.0;
	float y = uv.t * 2.0 - 1.0;
	// Assume we have a normal depth range between 0.0 and 1.0
	float z = texture2D(depthMap, uv).r * 2.0 - 1.0;
	vec4 posProj = vec4(x, y, z, 1.0);
	vec4 posView = inverseProjection * posProj;
	posView /= posView.w;
	return posView;
}

vec4 funcSsao(float radius, sampler2D noiseMap, sampler2D depthMap, sampler2D normalMap, vec2 resolution, vec2 uv, mat4 inverseProjection, mat4 projection, vec3 samples[KERNEL_SIZE]) {
	float fragDepth = texture2D(depthMap, fragTexture).r * 2.0 - 1.0;
	if (fragDepth > CAP_MAX_DEPTH) { return vec4(0.0); } // if too far

	float occlusion = 0.0;

	// Calculate out of the current fragment in screen space the view space position.
	vec4 posView = getViewPos(uv, depthMap, inverseProjection);

	// Normal gathering.
	vec3 normalView = normalize(texture2D(normalMap, uv).xyz * 2.0 - 1.0);

	// Calculate the rotation matrix for the kernel.
	vec2 noiseScale = resolution / 4.0; 
	vec3 randomVector = normalize(texture2D(noiseMap, uv * noiseScale).xyz * 2.0 - 1.0);
	
	// Using Gram-Schmidt process to get an orthogonal vector to the normal vector.
	// The resulting tangent is on the same plane as the random and normal vector. 
	// see http://en.wikipedia.org/wiki/Gram%E2%80%93Schmidt_process
	// Note: No division by <u,u> needed, as this is for normal vectors 1. 
	vec3 tangentView = normalize(randomVector - dot(randomVector, normalView) * normalView);
	
	vec3 bitangentView = cross(normalView, tangentView);
	// Final matrix to reorient the kernel depending on the normal and the random vector.
	mat3 kernelMatrix = mat3(tangentView, bitangentView, normalView); 

	// Go through the kernel samples and create occlusion factor.	
	for (int i = 0; i < KERNEL_SIZE; i += 1) {
		
		// Reorient sample vector in view space ...
		vec3 sampleVectorView = kernelMatrix * samples[i];
		
		// ... and calculate sample point.
		vec4 samplePointView = posView + radius * vec4(sampleVectorView, 0.0);
		
		// Project point and calculate NDC.
		vec4 samplePointNDC = projection * samplePointView;
		samplePointNDC /= samplePointNDC.w;
		
		// Create texture coordinate out of it.
		vec2 samplePointTexCoord = samplePointNDC.xy * 0.5 + 0.5;   
		
		// Get sample out of depth texture
		float zSceneNDC = texture2D(depthMap, samplePointTexCoord).r * 2.0 - 1.0;
		float delta = samplePointNDC.z - zSceneNDC;
		
		// If scene fragment is before (smaller in z) sample point, increase occlusion.
		if (delta > CAP_MIN_DISTANCE && delta < CAP_MAX_DISTANCE) {
			occlusion += smoothstep(0.0, 1.0, radius / delta);
			// occlusion += 1.0;
			// occlusion += smoothstep(CAP_MAX_DISTANCE, CAP_MIN_DISTANCE, delta);
		}
	}

	// No occlusion gets white, full occlusion gets black.
	occlusion = 1.0 - occlusion / (float(KERNEL_SIZE) - 1.0);
	return vec4(vec3(occlusion), 1.0);
}

void main(void) {
	gl_FragColor = funcSsao(radius, noiseMap, depthMap, normalMap, resolution, fragTexture, inverseProjection, projection, sampleKernel);
}`;

const addSamplesLocations = () => {
  const samples = [];
  for (let i = 0; i < 32; i += 1) {
    samples.push(`sampleKernel[${i}]`);
  }
  return samples;
};

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: [
    'flipY',
    'textureMap',
    'normalMap',
    'depthMap',
    'noiseMap',
    'projection',
    'inverseProjection',
    'radius',
    'resolution',
  ].concat(addSamplesLocations()),
};
