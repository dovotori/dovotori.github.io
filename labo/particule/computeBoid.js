export const computeBoid = ``;

export const buildBoidData = (particulesCount) => {
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
