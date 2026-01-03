const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

// Use a lookup table to find the index.
const lookup = new Uint8Array(256);
for (let i = 0; i < chars.length; i++) {
  lookup[chars.charCodeAt(i)] = i;
}

export const base64ToArrayBuffer = (rawBase64) => {
  const base64 = rawBase64.split(",")[1];
  let bufferLength = base64.length * 0.75;
  const len = base64.length;
  let i: number;
  let p = 0;
  let encoded1: number;
  let encoded2: number;
  let encoded3: number;
  let encoded4: number;

  if (base64[base64.length - 1] === "=") {
    bufferLength--;
    if (base64[base64.length - 2] === "=") {
      bufferLength--;
    }
  }

  const arraybuffer = new ArrayBuffer(bufferLength);
  const bytes = new Uint8Array(arraybuffer);

  for (i = 0; i < len; i += 4) {
    encoded1 = lookup[base64.charCodeAt(i)];
    encoded2 = lookup[base64.charCodeAt(i + 1)];
    encoded3 = lookup[base64.charCodeAt(i + 2)];
    encoded4 = lookup[base64.charCodeAt(i + 3)];

    bytes[p++] = (encoded1 << 2) | (encoded2 >> 4);
    bytes[p++] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    bytes[p++] = ((encoded3 & 3) << 6) | (encoded4 & 63);
  }

  return arraybuffer;
};

export const dataViewToFloat32 = (
  dataView: DataView,
  length: number,
  count: number,
  numElement: number,
  byteStride?: number,
) => {
  const result = new Float32Array(length); // Final Output at the correct size
  // for (let i = 0; i < length; i++) {
  //   result[i] = dataView.getFloat32(i * Float32Array.BYTES_PER_ELEMENT, true);
  // }
  const stride = byteStride || Float32Array.BYTES_PER_ELEMENT * numElement;
  let currentOffset = 0;
  let cpt = 0;
  for (let c = 0; c < count; c++) {
    for (let nb = 0; nb < numElement; nb++) {
      const pos = currentOffset + nb * Float32Array.BYTES_PER_ELEMENT;
      result[cpt] = dataView.getFloat32(pos, true);
      cpt++;
    }
    currentOffset += stride;
  }
  return result;
};

export const dataViewToUint16 = (
  dataView: DataView,
  length: number,
  count: number,
  numElement: number,
  byteStride?: number,
) => {
  const result = new Uint16Array(length); // Final Output at the correct size
  const stride = byteStride || Uint16Array.BYTES_PER_ELEMENT * numElement;
  let currentOffset = 0;
  let cpt = 0;
  for (let c = 0; c < count; c++) {
    for (let nb = 0; nb < numElement; nb++) {
      const pos = currentOffset + nb * Uint16Array.BYTES_PER_ELEMENT;
      result[cpt] = dataView.getUint16(pos, true);
      cpt++;
    }
    currentOffset += stride;
  }
  return result;
};

export const dataViewToUint8 = (dataView: DataView, byteLength: number) => {
  const result = new Uint8Array(byteLength);
  for (let cpt = 0; cpt < byteLength; cpt++) {
    result[cpt] = dataView.getUint8(cpt);
  }
  return result;
};
