import {
  uniformLights, addLights, funcMap, funcLightsColor,
} from './utils';

const vertex = `
attribute vec3 position;
attribute vec3 normale;
attribute vec2 texture;

uniform mat4 projection;
uniform mat4 model;
uniform mat4 view;
uniform mat3 normalmatrix;
uniform float inverseX;
uniform float spriteRefSize;
uniform vec2 spriteUV;
uniform vec2 spriteGrid;
uniform vec2 spriteSize;

varying vec3 fragPosition;
varying vec2 fragTexture;
varying vec3 fragNormale;

${funcMap}

void main() {
  fragPosition = normalize((view * model * vec4(position, 1.0)).xyz);
  fragNormale = normalmatrix * normalize(normale);

  vec2 relPos = spriteUV / spriteGrid;
  vec2 relSize = spriteSize / spriteGrid;
  float texX = funcMap(texture.x, 0.0 + float(inverseX), 1.0 - float(inverseX), relPos.x, relPos.x + relSize.x);
	float texY = funcMap(texture.y, 1.0, 0.0, relPos.y,  relPos.y + relSize.y);
  fragTexture = vec2(texX, texY);
  
  float relW = 1.0 * (spriteSize.x / spriteRefSize);
  float relH = 1.0 * (spriteSize.y / spriteRefSize);

  float finalX = funcMap(position.x, -1.0, 1.0, -relW, relW);
  float finalY = funcMap(position.y, -1.0, 1.0, -relH, relH);

  // place le point de pivot en bas
  // relH - (pivot.y  / spriteRefSize.y) - 1.0
  float offsetY = relH - 1.0;
  finalY += offsetY;

  gl_Position = projection * view * model * vec4(finalX, finalY, position.z, 1.0);
}
`;

const fragment = `
precision mediump float;
varying vec3 fragPosition;
varying vec2 fragTexture;
varying vec3 fragNormale;

${uniformLights}
uniform sampler2D textureMap;

${funcLightsColor}

void main() {
  vec4 ambiant = texture2D(textureMap, fragTexture);

  vec3 color = funcLightsColor(ambiant.xyz, vec3(1.0,1.0,1.0), vec3(1.0,1.0,1.0), fragNormale, fragPosition);


	gl_FragColor = vec4(color, ambiant.w);
	// gl_FragColor = vec4(1.0,0.0,0.0,1.0);
}
`;

export default {
  vertex,
  fragment,
  attributes: ['position', 'texture', 'normale'],
  uniforms: [
    'projection',
    'model',
    'view',
    'normalmatrix',
    'textureMap',
    'spriteUV',
    'spriteGrid',
    'spriteSize',
    'inverseX',
    'spriteRefSize',
  ].concat(addLights()),
};
