export const computeAttactor = `
  var massVec = mass.position.xyz - position;
  var massDist = max(0.01, dot(massVec, massVec));

  var acceleration: vec3f;
  if (mass.mode == 1.0) {
    // repel mode
    acceleration = -mass.factor * normalize(massVec) / massDist;
  } else {
    // attract mode
    acceleration = mass.factor * normalize(massVec) / massDist;
  }

  velocity += acceleration;
  velocity *= 0.8;

  var newPos = position + velocity;

  if (newPos.x < -1.0) {
    // reflect across -1 boundary
    newPos.x = -2.0 - newPos.x;
    velocity.x = -velocity.x;
  } else if (newPos.x > 1.0) {
    // reflect across +1 boundary
    newPos.x = 2.0 - newPos.x;
    velocity.x = -velocity.x;
  }
  if (newPos.y < -1.0) {
    newPos.y = -2.0 - newPos.y;
    velocity.y = -velocity.y;
  } else if (newPos.y > 1.0) {
    newPos.y = 2.0 - newPos.y;
    velocity.y = -velocity.y;
  }

  if (newPos.z < -1.0) {
    newPos.z = -2.0 - newPos.z;
    velocity.z = -velocity.z;
  } else if (newPos.z > 1.0) {
    newPos.z = 2.0 - newPos.z;
    velocity.z = -velocity.z;
  }

  newPosition = vec4(newPos, 1.0);
  newVelocity = vec4(velocity, 0.0);
`;

export const buildAttractorData = (particulesCount) => {
  const positionBufferData = new Float32Array(particulesCount * 4);
  const positionArrayStride = Float32Array.BYTES_PER_ELEMENT * 4;
  const velocityBufferData = new Float32Array(particulesCount * 4);
  const velocityArrayStride = Float32Array.BYTES_PER_ELEMENT * 4;
  const colorArrayStride = Uint8Array.BYTES_PER_ELEMENT * 4; // 4 bytes per color component
  const colorBufferData = new Uint8Array(4 * particulesCount);

  for (let i = 0; i < positionBufferData.length; i += 4) {
    positionBufferData[i] = Math.random() * 2 - 1;
    positionBufferData[i + 1] = Math.random() * 2 - 1;
    positionBufferData[i + 2] = Math.random() * 2 - 1;
    positionBufferData[i + 3] = 1;
  }

  for (let i = 0; i < velocityBufferData.length; i += 4) {
    velocityBufferData[i] = Math.random() * 0.002 - 0.001;
    velocityBufferData[i + 1] = Math.random() * 0.002 - 0.001;
    velocityBufferData[i + 2] = Math.random() * 0.002 - 0.001;
    velocityBufferData[i + 3] = 0;
  }

  for (let i = 0; i < colorBufferData.length; i += 4) {
    colorBufferData[i] = 0;
    colorBufferData[i + 1] = Math.floor(Math.random() * 256);
    colorBufferData[i + 2] = Math.floor(Math.random() * 256);
    colorBufferData[i + 3] = 128;
  }

  return {
    positionBufferData,
    positionArrayStride,
    velocityBufferData,
    velocityArrayStride,
    colorBufferData,
    colorArrayStride,
  };
};
