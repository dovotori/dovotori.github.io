import { mapFromRange } from '../utils/numbers';

export const getPoints = (width, height, { startX = -1, endX = 1, startZ = -1, endZ = 1 } = {}) => {
  const points = []; // texture coord to read position texture
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const posX = mapFromRange(x, 0, width - 1, startX, endX);
      const posZ = mapFromRange(y, 0, height - 1, startZ, endZ);
      points.push(posX);
      points.push(0.0);
      points.push(posZ);
    }
  }
  return points;
};

export const getIndices = (width, height) => {
  const indices = []; // texture coord to read position texture
  for (let y = 0; y < height - 1; y++) {
    for (let x = 0; x < width - 1; x++) {
      const lineX = y * width + x;

      // first triangle
      indices.push(lineX);
      indices.push(width + lineX);
      indices.push(lineX + 1);

      // 2nd triangle
      indices.push(width + lineX);
      indices.push(width + lineX + 1);
      indices.push(lineX + 1);
    }
  }
  return indices;
};
