export const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  );

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const getEnvPath = (path) => `${process.env.ASSET_PATH}${path}`;
