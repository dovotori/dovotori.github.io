import { funcMap } from './utils';

const vertex = `
attribute vec3 position;
attribute vec2 texture;
uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform int inverseX;
uniform float spriteRefSize;
uniform vec2 spriteUV;
uniform vec2 spriteGrid;
uniform vec2 spriteSize;
uniform vec2 spritePivot;
varying vec2 fragTexture;

${funcMap}

void main() {
  vec2 relPos = spriteUV / spriteGrid;
  vec2 relSize = spriteSize / spriteGrid;
  float texX = funcMap(texture.x, 0.0 + float(inverseX), 1.0 - float(inverseX), relPos.x, relPos.x + relSize.x);
	float texY = funcMap(texture.y, 1.0, 0.0, relPos.y,  relPos.y + relSize.y);
  fragTexture = vec2(texX, texY);
  
  // float relW = (spriteSize.x / spriteRefSize);
  // float relH = (spriteSize.y / spriteRefSize);  
  
  // float finalX = funcMap(position.x, -1.0, 1.0, -relW, relW);
  // float finalY = funcMap(position.y, -1.0, 1.0, -relH, relH);
  
  // // place en bas
  // if (spritePivot.y == -1.0) {
  //   float offsetY = relH - 1.0;
  //   finalY += offsetY;
  // }

  // // place pivot
  // float offsetX = relW * -0.5;
  // if (spritePivot.x != -1.0) {
  //   offsetX = (spritePivot.x / spriteGrid.x);
  // }
  // finalX += offsetX;

  gl_Position = projection * view * model * vec4(position, 1.0);
}
`;

const fragment = `
precision mediump float;
varying vec2 fragTexture;
uniform vec3 tint;
uniform int inverseColor;
uniform float damage;
uniform sampler2D textureMap;
void main() {
  
  // rgb
  // vec2 delta = vec2(0.01,0.01);
  // vec2 center = vec2(0.5,0.5);
  // vec2 dir = fragTexture - center;
  // vec2 value = dir * delta;
	// vec4 c1 = texture2D(textureMap, fragTexture - value);
	// vec4 c2 = texture2D(textureMap, fragTexture);
	// vec4 c3 = texture2D(textureMap, fragTexture + value);
  // vec4 color = vec4(c1.r, c2.g, c3.b, c1.a + c2.a + c3.b);

	vec4 color = texture2D(textureMap, fragTexture);
	color.x *= tint.x; 
	color.y *= tint.y; 
	color.z *= tint.z; 
  if (inverseColor == 1) {
    color.x = 1.0 - color.x; 
	  color.y = 1.0 - color.y; 
	  color.z = 1.0 - color.z; 
  }
  color.xyz += vec3(damage) * vec3(1.0,0.0,0.0);
  gl_FragColor = color;
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture'],
  uniforms: [
    'projection',
    'model',
    'view',
    'textureMap',
    'spriteUV',
    'spriteGrid',
    'spriteSize',
    'spriteRefSize',
    'spritePivot',
    'inverseX',
    'tint',
    'inverseColor',
    'damage',
  ],
};
