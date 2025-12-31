export const getBufferMinSize = (byteLength) => {
  return (
    Math.ceil(byteLength / Float32Array.BYTES_PER_ELEMENT) *
    Float32Array.BYTES_PER_ELEMENT
  );
};
