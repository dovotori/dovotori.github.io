export default `
float nsin(float val) {
  return sin(val) * 0.5 + 0.5;
}

vec3 getDistortion(float progress, vec3 frequence, vec3 amplitude, float time) {
  float movementProgressFix = 0.02;
  float X = cos(progress * PI * frequence.x + time)
    * amplitude.x - cos(movementProgressFix * PI * frequence.x + time) * amplitude.x;
  float Y = nsin(progress * PI * frequence.y + time)
    * amplitude.y - nsin(movementProgressFix * PI * frequence.y + time)* amplitude.y;
  float Z = nsin(progress * PI * frequence.z + time)
    * amplitude.z - nsin(movementProgressFix * PI * frequence.z + time)* amplitude.z;
  return vec3(X, Y, Z);
}
`;
