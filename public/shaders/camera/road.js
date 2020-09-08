import { funcMap, PI } from '../utils';

const vertex = `
attribute vec2 texture;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;

uniform float time;
uniform vec2 distortionX;
uniform vec2 distortionY;

${funcMap}
${PI}

varying vec3 color;

float nsin(float val) {
  return sin(val) * 0.5 + 0.5;
}

vec3 getDistortion(float progress){
  progress = clamp(progress, 0.,1.);
  float xAmp = distortionX.x;
  float xFreq = distortionX.y;
  float yAmp = distortionY.x;
  float yFreq = distortionY.y;
  return vec3( 
    xAmp * nsin(progress* PI * xFreq   - PI / 2. ) ,
    yAmp * nsin(progress * PI *yFreq - PI / 2.  ) ,
    0.
  );
}

void main() {
  gl_PointSize = 2.0;
  float centerX = texture.x * 2.0 - 1.0;
  vec3 distortion = getDistortion(time);
  float distortionX = cos((time * 0.1) + texture.y);
  float distortionZ = sin((time * 0.01) + texture.y) * 0.4;
  float x = centerX; // + distortionX;
  float y = texture.y * 4.0;
  float z = distortionZ;
  vec3 position = vec3(x, z, y);
  color = position;
  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;

varying vec3 color;

void main() {
  gl_FragColor = vec4(color, 1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['texture'],
  uniforms: ['projection', 'model', 'view', 'time', 'distortionX', 'distortionY'],
};
