export const MAX_LIGHTS = 10;

export const uniformLights = `
#define MAX_LIGHTS ${MAX_LIGHTS}
uniform int numLights;
uniform struct Light {
   int type;
   vec3 position;
   vec3 ambiant;
   vec3 diffuse;
   vec3 specular;
   float radius;
   vec3 direction;
   float strength;
   float brillance;
} lights[MAX_LIGHTS];
`;

export const addLightLocations = () => {
  const lights = [];
  for (let i = 0; i < MAX_LIGHTS; i += 1) {
    lights.push(`lights[${i}].type`);
    lights.push(`lights[${i}].position`);
    lights.push(`lights[${i}].ambiant`);
    lights.push(`lights[${i}].diffuse`);
    lights.push(`lights[${i}].specular`);
    lights.push(`lights[${i}].radius`);
    lights.push(`lights[${i}].direction`);
    lights.push(`lights[${i}].brillance`);
    lights.push(`lights[${i}].strength`);
  }
  lights.push('numLights');
  return lights;
};

export const funcLightConeAttenuation = `
float funcLightConeAttenuation(vec3 posLum, vec3 posDirection, vec3 normale, vec3 position) {
  float intensity = 0.0;
  float cutoff = 0.9;

  vec3 lightDirection = normalize(posLum - position); 
  vec3 spotDirection = normalize(posDirection);

  // inside the cone ?
  if (dot(spotDirection, lightDirection) > cutoff) {

    vec3 n = normalize(normale);
    intensity = max(dot(n, lightDirection), 0.0);

    // if (intensity > 0.0) {
    // vec3 eye = normalize(DataIn.eye);
    // vec3 h = normalize(lightDirection + eye);
    // float intSpec = max(dot(h,n), 0.0);
    // spec = specular * pow(intSpec, shininess);
    // }
  }
  return intensity;
}
`;

export const funcLightAttenuation = `
float funcLightAttenuation(vec3 posLum, float radius, vec3 normale, vec3 position) {
  float cutoff = 0.1;
  vec3 lightDirection = posLum - position;
  float distance = length(lightDirection);
  float d = max(distance - radius, 0.0);
  lightDirection /= distance;
  float denom = d / radius + 1.0;
  float attenuation = 1.0 / (denom * denom);
    
  attenuation = (attenuation - cutoff) / (1.0 - cutoff);
  attenuation = max(attenuation, 0.0);

  float dot = max(dot(lightDirection, normale), 0.0);
  return attenuation * dot;
}
`;

export const funcPhong = `
vec3 funcPhong(vec3 position, vec3 normale, vec3 ambiant, vec3 diffuse, vec3 specular, vec3 posLum, float brillance) {
  vec3 N = normalize(normale);
  vec3 L = normalize(posLum - position);

  // Lambert's cosine law
  float lambertian = max(dot(N, L), 0.0);

  float specularValue = 0.0;
  if(lambertian > 0.0) {
    vec3 R = reflect(-L, N); // Reflected light vector
    vec3 V = normalize(-position); // Vector to viewer
    float specAngle = max(dot(R, V), 0.0);
    specularValue = pow(specAngle, brillance);
  }

  return vec3(ambiant * ((lambertian * diffuse) + (specularValue * specular)));
}
`;

export const funcLightsColor = `
${funcPhong}
${funcLightConeAttenuation}
${funcLightAttenuation}
vec3 funcLightsColor(vec3 ambiant, vec3 diffuse, vec3 specular, vec3 normale, vec3 position) {
  vec3 finalColor = vec3(0.0);
  for(int i = 0; i < MAX_LIGHTS; i += 1) {
    if(i < numLights) {
      vec3 color = funcPhong(
        position,
        normale,
        ambiant * (lights[i].ambiant * lights[i].strength),
        diffuse * (lights[i].diffuse * lights[i].strength),
        specular * (lights[i].specular * lights[i].strength),
        lights[i].position,
        lights[i].brillance
      );
      float att = 1.0;
      if (lights[i].type == 1) {
        att = funcLightAttenuation(lights[i].position, lights[i].radius, normale, position);
      } else if (lights[i].type == 2) {
        att = funcLightConeAttenuation(lights[i].position, lights[i].direction, normale, position);
      }
      color *= att;
      finalColor += color;
    }
  }
  finalColor /= vec3(numLights);
  return finalColor;
}
`;
