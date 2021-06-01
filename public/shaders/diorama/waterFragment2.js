export default `
precision mediump float;

uniform sampler2D refractMap;
uniform sampler2D reflectMap;
uniform sampler2D distortionMap;
uniform sampler2D normaleMap;
uniform sampler2D waterDepthTexture;
uniform sampler2D depthMap;

uniform float waterReflectivity;
uniform float fresnelStrength;

varying vec3 fragEyeDir;
varying vec2 fragMoving;
varying vec4 clipSpace;
varying vec2 fragTexture;

vec3 sunlightColor = vec3(1.0, 1.0, 1.0);
vec3 sunlightDir = normalize(vec3(-1.0, -1.0, 0.5));
const float waterDistortionStrength = 0.03;
const float shineDamper = 20.0;
vec4 shallowWaterColor =  vec4(0.0, 0.1, 0.3, 1.0);
vec4 deepWaterColor = vec4(0.0, 0.1, 0.2, 1.0);

vec3 getNormal(vec2 uv) {
  vec4 normalMapColor = texture2D(normaleMap, uv);
  float makeNormalPointUpwardsMore = 2.6;
  vec3 normal = vec3(
    normalMapColor.r * 2.0 - 1.0,
    normalMapColor.b * makeNormalPointUpwardsMore,
    normalMapColor.g * 2.0 - 1.0
  );
  normal = normalize(normal);
  return normal;
}

void main() {
  // Normalized device coordinates - Between 0 and 1
  vec2 ndc = (clipSpace.xy / clipSpace.w) / 2.0 + 0.5;

  vec2 refractTexCoords = vec2(ndc.x, ndc.y);
  // Reflections are upside down
  vec2 reflectTexCoords = vec2(ndc.x, -ndc.y);

  float near = 0.1;
  float far = 50.0;

  // Get the distance from our camera to the first thing under this water fragment that a
  // ray would collide with. This might be the ground, the under water walls, a fish, or any
  // other thing under the water. This distance will depend on our camera angle.
  float cameraToFirstThingBehindWater = texture2D(waterDepthTexture, refractTexCoords).r;
  // Convert from our perspective transformed distance to our world distance
  float cameraToFirstThingUnderWater = 2.0 * near * far /
    (far + near - (2.0 * cameraToFirstThingBehindWater - 1.0)
    * (far - near));

  float cameraToWaterDepth = gl_FragCoord.z;
  float cameraToWaterDistance = 2.0 * near * far / (far + near - (2.0 * cameraToWaterDepth - 1.0) * (far - near));

  float angledWaterDepth = cameraToFirstThingUnderWater - cameraToWaterDistance;

  vec2 distortedTexCoords = texture2D(distortionMap, vec2(fragTexture.x + fragMoving.x, fragTexture.y)).rg * 0.1;
  distortedTexCoords = fragTexture + vec2(distortedTexCoords.x, distortedTexCoords.y + fragMoving.x);

  // Between -1 and 1
  vec2 totalDistortion = (texture2D(distortionMap, distortedTexCoords).rg * 2.0 - 1.0)
    * waterDistortionStrength;

  refractTexCoords += totalDistortion;
  reflectTexCoords += totalDistortion;

  // soft edges
  refractTexCoords = clamp(refractTexCoords, 0.001, 0.999);
  reflectTexCoords.x = clamp(reflectTexCoords.x, 0.001, 0.999);
  reflectTexCoords.y = clamp(reflectTexCoords.y, -0.999, -0.001);

  vec4 reflectColor = texture2D(reflectMap, reflectTexCoords);
  vec4 refractColor = texture2D(refractMap, refractTexCoords);

  // The deeper the water the darker the color
  refractColor = mix(refractColor, deepWaterColor, clamp(angledWaterDepth / 10.0, 0.0, 1.0));

  vec3 toCamera = normalize(fragEyeDir);
  vec3 normal = getNormal(distortedTexCoords);

  // fresnel
  float refractiveFactor = dot(toCamera, normal);
  refractiveFactor = pow(refractiveFactor, fresnelStrength);

  vec3 reflectedLight = reflect(normalize(sunlightDir), normal);
  float specular = max(dot(reflectedLight, toCamera), 0.0);
  specular = pow(specular, shineDamper);
  vec3 specularHighlights = sunlightColor * specular * waterReflectivity;

  gl_FragColor = mix(reflectColor, refractColor, refractiveFactor);
  // Mix in a bit of blue so that it looks like water
  gl_FragColor = mix(gl_FragColor, shallowWaterColor, 0.2) + vec4(specularHighlights, 0.0);
}
`;
