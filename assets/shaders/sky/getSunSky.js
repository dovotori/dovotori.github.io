export default `
vec3 getSunSky(vec2 uv) {
  float horizonY = uv.y - 0.05;
	vec3 rayDir = normalize(vec3(uv.x, horizonY, 1.5));
  vec3 sundir = normalize(vec3(0.0, 0.1, 1.0));
  float yd = min(rayDir.y, 0.0);
  rayDir.y = max(rayDir.y, 0.0);
  vec3 color = vec3(0.0);
  color += SUN_SKY_COLOR_1 * vec3(1.0, 0.4 - exp(-rayDir.y * 20.0) * 0.3, 0.2) * exp(-rayDir.y * 9.0);
  color += SUN_SKY_COLOR_2 * (1.0 - exp(-rayDir.y * 8.0)) * exp(-rayDir.y * 0.9) ; 
  // color = mix(color * 1.2, vec3(0.3),  1.0 - exp(yd * 100.0)); // Fog
  color += SUN_COLOR * pow(max(dot(rayDir, sundir), 0.0), 15.0) * SUN_INTENSITY; // Sun big halo
  color += pow(max(dot(rayDir, sundir), 0.0), 150.0) * 0.15; // Sun little halo
  return color;
}
`;
