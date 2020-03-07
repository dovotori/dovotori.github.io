export const funcBlur = `
vec4 funcBlur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.411764705882353) * direction;
  vec2 off2 = vec2(3.2941176470588234) * direction;
  vec2 off3 = vec2(5.176470588235294) * direction;
  color += texture2D(image, uv) * 0.1964825501511404;
  color += texture2D(image, uv + (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv - (off1 / resolution)) * 0.2969069646728344;
  color += texture2D(image, uv + (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv - (off2 / resolution)) * 0.09447039785044732;
  color += texture2D(image, uv + (off3 / resolution)) * 0.010381362401148057;
  color += texture2D(image, uv - (off3 / resolution)) * 0.010381362401148057;
  return color;
}
`;

export const funcBlur2 = `
vec4 funcBlur(sampler2D image, vec2 uv, vec2 resolution, vec2 direction) {
  vec4 color = vec4(0.0);
  vec2 off1 = vec2(1.3846153846) * direction;
  vec2 off2 = vec2(3.2307692308) * direction;
  color += texture2D(image, uv) * 0.2270270270;
  color += texture2D(image, uv + (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv - (off1 / resolution)) * 0.3162162162;
  color += texture2D(image, uv + (off2 / resolution)) * 0.0702702703;
  color += texture2D(image, uv - (off2 / resolution)) * 0.0702702703;
  return color;
}
`;

export const attributeColors = `
attribute vec3 ambiant;
attribute vec3 diffuse;
attribute vec3 specular;
attribute float specDensity;
attribute float opacity;
`;

export const varyingColors = `
varying vec3 fragAmbiant;
varying vec3 fragDiffuse;
varying vec3 fragSpecular;
varying float fragSpecDensity;
varying float fragOpacity;
`;

const MAX_LIGHTS = 10;

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

export const addLights = () => {
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

export const funcMap = `
float funcMap(float valeur, float minRef, float maxRef, float minDest, float maxDest) {
  float result = minDest + (valeur - minRef) * (maxDest - minDest) / (maxRef - minRef);
  if(result > maxDest){ result = maxDest; } else if(result < minDest){ result = minDest; }
  return result;
}
`;

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
        //     vec3 eye = normalize(DataIn.eye);
        //     vec3 h = normalize(lightDirection + eye);
        //     float intSpec = max(dot(h,n), 0.0);
        //     spec = specular * pow(intSpec, shininess);
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

export const funcToon = `
float funcToon(lambertCosinus) {
  float strength = 0.0;
  if (lambertCosinus > 0.7)
    strength = 0.8;
  else if (lambertCosinus > 0.3)
    strength = 0.5;
  else
    strength = 0.3;
  return strength;
}
`;

export const funcShadow = `
float compareShadow(sampler2D depthMap, vec2 shad, float compare, float epsilon) {
  float visibilite = 1.0;
  float shadow = texture2D(depthMap, shad.xy).x;
  if(shadow + epsilon < compare) { 
    visibilite = smoothstep(0.0, 1.0, (compare - shadow) * 15.0); // test attenuation
    visibilite = 0.0; 
  } else {
    visibilite = 1.0;
  }
  return visibilite;
}

float smoothShadow(sampler2D depthMap, vec2 shad, float compare, vec2 texelSize, float epsilon) {
  // compare au voisin et on interpole
  vec2 pixelPos = shad / texelSize + vec2(0.5);
  vec2 fractPart = fract(pixelPos);
  vec2 startPixel = (pixelPos - fractPart) * texelSize;

  float blTexel = compareShadow(depthMap, startPixel, compare, epsilon);
  float brTexel = compareShadow(depthMap, startPixel + vec2(texelSize.x, 0.0), compare, epsilon);
  float tlTexel = compareShadow(depthMap, startPixel + vec2(0.0, texelSize.y), compare, epsilon);
  float trTexel = compareShadow(depthMap, startPixel + texelSize, compare, epsilon);

  float mixA = mix(blTexel, tlTexel, fractPart.y);
  float mixB = mix(brTexel, trTexel, fractPart.y);

  return mix(mixA, mixB, fractPart.x);
}

float softShadowPCR(sampler2D depthMap, vec2 shad, float compare, vec2 texelSize, float epsilon) {
  // on regarde les voisin et on calcule la quantite de lumiere
  float resultat = 0.0;
  for(float y = -1.0; y <= 1.0; y += 1.0) {
    for(float x = -1.0; x <= 1.0; x += 1.0) {
      vec2 coorOffset = vec2(x, y) * texelSize;
      resultat += smoothShadow(depthMap, shad + coorOffset, compare, texelSize, epsilon);
    } 
  }
  return resultat / 9.0;
}

float funcShadow(sampler2D depthMap, vec4 fragShadow, vec2 texelSize) {
  float visibility;
	vec4 shad = fragShadow / fragShadow.w;
  float epsilon = 0.0001; // Fix shadow acne

	if (
    (fragShadow.w <= 0.0)  // behind light, ignore 
    && (shad.x < 0.0 || shad.y < 0.0) // outside light frustum, ignore
    && (shad.x >= 1.0 || shad.y >= 1.0)// outside light frustum, ignore
  ) {
		visibility = 1.0;
	} else {
	  vec2 texelSize = vec2(1.0 / texelSize.x, 1.0 / texelSize.y); // taille de la texture
		visibility = softShadowPCR(depthMap, shad.xy, shad.z, texelSize, epsilon);
	}
  return visibility;
}
`;
