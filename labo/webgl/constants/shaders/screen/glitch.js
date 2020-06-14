import vertex from './basicVertex';

const fragment = `
precision mediump float;

uniform sampler2D textureMap;
uniform float time;
uniform float delta; // 0 - 1 glitch amount
uniform float speed; // 0 - 1 speed
varying vec2 fragTexture;

// 2D (returns 0 - 1)
float random2d(vec2 n) { 
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float randomRange (vec2 seed, float min, float max) {
	return min + random2d(seed) * (max - min);
}

// return 1 if v inside 1d range
float insideRange(float v, float bottom, float top) {
  return step(bottom, v) - step(top, v);
}
   
vec4 applyGlitch(sampler2D tex, vec2 uv, float speed, float AMT) {
  float time = floor(time * speed * 60.0);    
  vec4 outCol = texture2D(tex, uv);
    
  // randomly offset slices horizontally
  float maxOffset = AMT / 2.0;
  const float LIMIT =  2.0;
  for (float i = 0.0; i < LIMIT; i += 1.0) {
    float sliceY = random2d(vec2(time , 2345.0 + float(i)));
    float sliceH = random2d(vec2(time , 9035.0 + float(i))) * 0.25;
    float hOffset = randomRange(vec2(time , 9625.0 + float(i)), -maxOffset, maxOffset);
    vec2 uvOff = uv;
    uvOff.x += hOffset;
    if (insideRange(uv.y, sliceY, fract(sliceY+sliceH)) == 1.0 ){
      outCol = texture2D(tex, uvOff);
    }
  }
    
  // do slight offset on one entire channel
  float maxColOffset = AMT / 6.0;
  float rnd = random2d(vec2(time , 9545.0));
  vec2 colOffset = vec2(randomRange(vec2(time , 9545.0), -maxColOffset,maxColOffset), 
                      randomRange(vec2(time , 7205.0), -maxColOffset,maxColOffset));
  if (rnd < 0.33) {
    outCol.r = texture2D(tex, uv + colOffset).r;  
  } else if (rnd < 0.66){
    outCol.g = texture2D(tex, uv + colOffset).g;  
  } else {
    outCol.b = texture2D(tex, uv + colOffset).b;  
  }

	return vec4(outCol);
}

void main() {
	gl_FragColor = applyGlitch(textureMap, fragTexture, speed, delta);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'textureMap', 'time', 'delta', 'speed'],
};
