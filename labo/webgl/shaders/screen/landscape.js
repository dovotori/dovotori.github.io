import { funcGradiant, funcGrain } from '../utils';
import { polygon, rect } from '../utils/shapes';

import vertex from './basicVertex';

const fragment = `
precision mediump float;

uniform float time;

varying vec2 fragTexture;

#define NB_MOUNTAINS 10
#define NB_CLOUDS 1

${funcGrain}
${funcGradiant}
${rect}
${polygon}

vec4 drawMountains(vec4 color, float size, float speed) {
  vec4 traingleColor1 = vec4(75.0 / 255.0, 68.0 / 255.0, 141.0 / 255.0, 1.0);
  vec4 traingleColor2 = vec4(34.0 / 255.0, 29.0 / 255.0, 86.0 / 255.0, 1.0);

  vec2 trianglePosition = (vec2(1.0) - fragTexture);
  float defilement = tan(time * speed);

  trianglePosition.x = trianglePosition.x - defilement;
  trianglePosition.y = trianglePosition.y + 0.5;
  float triangle = polygon(trianglePosition, 3, size);

  if (triangle != 0.0) {
    return funcGradiant(traingleColor1, traingleColor2, 1.0, 0.5, fragTexture.y);
  }
  return color;
}

vec4 drawClouds(vec4 color, float size, float speed, vec2 pos) {
  float defilement = 1.0 - tan(time * speed);
  float rect1 = rect(fragTexture, vec2(pos.x + defilement, pos.y), vec2(size, 0.01));
  if (rect1 != 0.0) {
    color = vec4(1.0);
  }
  return color;
}

void main() {
  vec4 backColor1 = vec4(13.0 / 255.0, 7.1 / 255.0, 32.9 / 255.0, 1.0);
  vec4 backColor2 = vec4(193.0 / 255.0, 2.0 / 255.0, 117.0 / 255.0, 1.0);
  vec4 backColor3 = vec4(1.0, 146.0 / 255.0, 45.0 / 255.0, 1.0);

  vec4 color = vec4(1.0);
  if (fragTexture.y < 0.5) {
    color = funcGradiant(backColor1, backColor2, 0.0, 0.5, fragTexture.y);
  } else {
    color = funcGradiant(backColor2, backColor3, 0.5, 1.0, fragTexture.y);
  }
  
  for (int i = 1; i <= NB_MOUNTAINS; i++)  {
    color = drawMountains(color, float(i) / (float(NB_MOUNTAINS) * 0.5), float(i) * 0.01);
  }

  for (int j = 0; j < 2; j++)  {
    for (int i = 0; i < 3; i++)  {
      color = drawClouds(color, 0.3 + (float(i) * 0.02), 0.1, vec2(float(j) * 0.5, 0.2 + float(j) * 0.2 + (float(i) * 0.02)));
    }
  }

  vec4 grain = funcGrain(fragTexture, 10.0 + time * 0.01, 8.0);

  gl_FragColor = color + grain;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: ['flipY', 'time'],
};
