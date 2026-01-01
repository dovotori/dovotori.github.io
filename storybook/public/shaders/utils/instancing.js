export const funcInstancing = `
vec3 getFixedPosition(vec3 offset) {
  vec2 newOffset = offset.xz;
  newOffset = mod(newOffset - moving, 2.0); // 2 because terrain is between -1 and 1
  newOffset = (newOffset * 0.5) * 2.0 - 1.0;
  vec2 coord = newOffset +  moving;
  float height = getNaturalHeight(coord);
  return vec3(newOffset.x, height, newOffset.y);
}

vec4 getTerrainPosition(vec3 fixedPos, vec3 position) {
  vec3 scaleLength = vec3(
    length(model[0].xyz),
    length(model[1].xyz),
    length(model[2].xyz)
  );

  mat4 modelScale;
  modelScale[0] = vec4(scaleLength.x, 0.0, 0.0, 0.0);
  modelScale[1] = vec4(0.0, scaleLength.y, 0.0, 0.0);
  modelScale[2] = vec4(0.0, 0.0, scaleLength.z, 0.0);
  modelScale[3] = vec4(0.0, 0.0, 0.0, 1.0);

  vec3 offset = fixedPos; // * 2.0; // 2 scale

  mat4 translation;
  translation[0] = vec4(1.0, 0.0, 0.0, 0.0);
  translation[1] = vec4(0.0, 1.0, 0.0, 0.0);
  translation[2] = vec4(0.0, 0.0, 1.0, 0.0);
  translation[3] = vec4(offset, 1.0);

  mat4 scale;
  scale[0] = vec4(size, 0.0, 0.0, 0.0);
  scale[1] = vec4(0.0, size, 0.0, 0.0);
  scale[2] = vec4(0.0, 0.0, size, 0.0);
  scale[3] = vec4(0.0, 0.0, 0.0, 1.0);

  mat4 modelTranslation;
  modelTranslation[0] = vec4(1.0, 0.0, 0.0, 0.0);
  modelTranslation[1] = vec4(0.0, 1.0, 0.0, 0.0);
  modelTranslation[2] = vec4(0.0, 0.0, 1.0, 0.0);
  modelTranslation[3] = vec4(model[3].xyz, 1.0);

  mat4 modelRotation;
  modelRotation[0] = vec4(
    model[0].x / scaleLength.x,
    model[0].y / scaleLength.x,
    model[0].z / scaleLength.x,
    0.0
  );
  modelRotation[1] = vec4(
    model[1].x / scaleLength.y, 
    model[1].y / scaleLength.y, 
    model[1].z / scaleLength.y,
    0.0
  );
  modelRotation[2] = vec4(
    model[2].x / scaleLength.z, 
    model[2].y / scaleLength.z, 
    model[2].z / scaleLength.z, 
    0.0
  );
  modelRotation[3] = vec4(0.0, 0.0, 0.0, 1.0);

  mat4 allTranslation =  modelTranslation * translation;
  mat4 allScale = modelScale * scale;
  mat4 allRotation = modelRotation;

  return allRotation * allTranslation * allScale * vec4(position, 1.0);
}
`;
