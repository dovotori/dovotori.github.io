import vertex from "./basicVertex";

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform vec2 resolution;
varying vec2 fragTexture;

#define FXAA_REDUCE_MIN 1.0 / 128.0 // empeche division par zero
#define FXAA_REDUCE_MUL 1.0 / 8.0 // controle en fonction de la lumina
#define FXAA_SPAN_MAX 6.0 // limite l'expansion du blur

vec4 applyFXAA(sampler2D tex, vec2 st, vec2 resolution) {
	vec2 inverseViewportSize = vec2(1.0 / resolution.x, 1.0 / resolution.y);

	vec3 luma = vec3(0.299, 0.587, 0.114); // // reference pour avoir la luminosite d'un pixel
	// on regarde la luminosite sur les pixels en croix autour du pixel
	float lumaTL = dot(luma, texture2D(tex, st + (vec2(-1.0, -1.0) * inverseViewportSize)).xyz);
	float lumaTR = dot(luma, texture2D(tex, st + (vec2(1.0, -1.0) * inverseViewportSize)).xyz);
	float lumaBL = dot(luma, texture2D(tex, st + (vec2(-1.0, 1.0) * inverseViewportSize)).xyz);
	float lumaBR = dot(luma, texture2D(tex, st + (vec2(1.0, 1.0) * inverseViewportSize)).xyz);
	float lumaM = dot(luma, texture2D(tex, st).xyz);

	// EDGE DETECTION
	vec2 dir;
	dir.x = -((lumaTL + lumaTR) - (lumaBL + lumaBR));
	dir.y = ((lumaTL + lumaBL) - (lumaTR + lumaBR));
	float dirReduce = max(
		(lumaTL + lumaTR + lumaBL + lumaBR) * (FXAA_REDUCE_MUL * 0.25), FXAA_REDUCE_MIN
	);
	float inverseDirAdjustment = 1.0/(min(abs(dir.x), abs(dir.y)) + dirReduce);
	dir = min(vec2(FXAA_SPAN_MAX, FXAA_SPAN_MAX),
		max(
			vec2(-FXAA_SPAN_MAX, -FXAA_SPAN_MAX), dir * inverseDirAdjustment)
		) * inverseViewportSize;

	// BLUR
	vec4 result1 = (1.0 / 2.0) * (
		texture2D(tex, st + (dir * vec2(1.0 / 3.0 - 0.5))) +
		texture2D(tex, st + (dir * vec2(2.0 / 3.0 - 0.5))));
	vec4 result2 = result1 * (1.0 / 2.0) + (1.0 / 4.0) * (
		texture2D(tex, st + (dir * vec2(0.0 / 3.0 - 0.5))) +
		texture2D(tex, st + (dir * vec2(3.0 / 3.0 - 0.5))));

	float lumaMin = min(lumaM, min(min(lumaTL, lumaTR), min(lumaBL, lumaBR)));
	float lumaMax = max(lumaM, max(max(lumaTL, lumaTR), max(lumaBL, lumaBR)));
	float lumaResult2 = dot(luma, result2.xyz);

	vec4 color;
	if (lumaResult2 < lumaMin || lumaResult2 > lumaMax){ // teste si on est pas parti trop loin
		color = result1;
	} else {
		color = result2;
	}

	// no alpha
	// if (lumaResult2 < lumaMin || lumaResult2 > lumaMax){ // teste si on est pas parti trop loin
	// 	color = vec4(result1.xyz, 1.0);
	// } else {
	// 	color = vec4(result2.xyz, 1.0);
	// }

	return color;
}

void main() {
	gl_FragColor = applyFXAA(textureMap, fragTexture, resolution);
}
`;

export default {
  vertex,
  fragment,
  attributes: ["position", "texture"],
  uniforms: ["flipY", "textureMap", "resolution"],
};
