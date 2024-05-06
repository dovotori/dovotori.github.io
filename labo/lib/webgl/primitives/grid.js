import { mapFromRange } from '../utils/numbers';

export const getPoints = (width, height, { startX = -1, endX = 1, startZ = -1, endZ = 1 } = {}) => {
  const points = [];
  for (let y = 0; y < height; y++) {
    const posZ = mapFromRange(y, 0, height - 1, startZ, endZ);
    for (let x = 0; x < width; x++) {
      const posX = mapFromRange(x, 0, width - 1, startX, endX);
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

export const getTextures = (width, height) => {
  const textures = [];
  for (let y = 0; y < height; y++) {
    const Y = y / height;
    for (let x = 0; x < width; x++) {
      textures.push(x / width);
      textures.push(Y);
    }
  }
  return textures;
};

const addThickPoints = (
  width,
  height,
  { startX = -1, endX = 1, startZ = -1, endZ = 1, thicknessY = -1 } = {},
) => {
  const points = [];
  // top
  for (let i = 0; i < width; i++) {
    const posX = mapFromRange(i, 0, width - 1, startX, endX);
    points.push(posX, thicknessY, startZ);
  }
  // left
  for (let i = 1; i < height; i++) {
    const posZ = mapFromRange(i, 0, height - 1, startZ, endZ);
    points.push(startX, thicknessY, posZ);
  }
  // // bottom
  for (let i = 1; i < width; i++) {
    const posX = mapFromRange(i, 0, width - 1, startX, endX);
    points.push(posX, thicknessY, endZ);
  }
  // // right
  for (let i = 1; i < height - 1; i++) {
    const posZ = mapFromRange(i, 0, height - 1, startZ, endZ);
    points.push(endX, thicknessY, posZ);
  }
  return points;
};

const addThickIndices = (width, height) => {
  const indices = [];

  // top
  let cptIndex = width * height;
  for (let i = 0; i < width - 1; i++) {
    indices.push(i, i + 1, cptIndex);
    indices.push(i + 1, cptIndex + 1, cptIndex);
    cptIndex++;
  }

  // left
  cptIndex = width * height;
  for (let i = 0; i < height - 1; i++) {
    indices.push(i * width, cptIndex, (i + 1) * width);
    if (i === 0) {
      indices.push(cptIndex + width, (i + 1) * width, cptIndex);
      cptIndex += width;
    } else {
      indices.push(cptIndex + 1, (i + 1) * width, cptIndex);
      cptIndex++;
    }
  }

  // bottom
  const firstLastRowIndex = (width - 1) * height;
  for (let i = firstLastRowIndex; i < firstLastRowIndex + width - 1; i++) {
    indices.push(i, cptIndex, i + 1);
    indices.push(cptIndex, cptIndex + 1, i + 1);
    cptIndex++;
  }

  // right
  const lastBottomIndex = cptIndex;
  const lastFirstLineThickIndex = width * height + (width - 1);
  for (let i = 0; i < height - 1; i++) {
    const gridIndex = width * i + (width - 1);
    const gridNextIndex = width * (i + 1) + (width - 1);
    if (i === 0) {
      indices.push(gridIndex, cptIndex + 1, lastFirstLineThickIndex);
      indices.push(gridNextIndex, cptIndex + 1, gridIndex);
    } else if (i === height - 2) {
      indices.push(gridNextIndex, cptIndex, gridIndex);
      indices.push(lastBottomIndex, cptIndex, gridNextIndex);
    } else {
      indices.push(cptIndex, gridIndex, gridNextIndex);
      indices.push(cptIndex + 1, cptIndex, gridNextIndex);
    }
    cptIndex++;
  }
  return indices;
};

const addThickTextures = (width, height) => {
  const textures = [];
  // todo
  return textures;
};

export default (width, height, options) => {
  const position = getPoints(width, height, options);
  const texture = getTextures(width, height);
  const indices = getIndices(width, height);
  if (options.withThick) {
    return {
      position: position.concat(addThickPoints(width, height, options)),
      texture: texture.concat(addThickTextures(width, height)),
      indices: indices.concat(addThickIndices(width, height, options)),
    };
  }
  return {
    position,
    texture,
    indices,
  };
};
