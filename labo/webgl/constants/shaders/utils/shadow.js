export const funcShadow = `
float compareShadow(sampler2D depthMap, vec2 shad, float compare, float epsilon) {
  float visibilite = 1.0;
  float shadow = texture2D(depthMap, shad.xy).x;
  if(shadow + epsilon < compare) { 
    // visibilite = smoothstep(0.0, 1.0, (compare - shadow) * 15.0); // test attenuation
    visibilite = 0.4; 
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

float funcShadow(sampler2D depthMap, vec4 fragShadow, vec2 texelSize, float epsilon) {
  float visibility;
	vec4 shad = fragShadow / fragShadow.w;

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
