import { mapFromRange } from '../../utils/numbers';
import PerlinNoise from '../../utils/perlinNoise';

export const getRandomPointsInCube = (count) =>
  Array.from(
    { length: count },
    () => {
      const x = Math.floor(Math.random() * 255);
      const y = Math.floor(Math.random() * 255);
      const z = Math.floor(Math.random() * 255);
      return [x, y, z, 255];
    },
    [],
  ).flat();

const getPointsInSphere = () => {
  const u = Math.random();
  const v = Math.random();
  const theta = u * 2.0 * Math.PI;
  const phi = Math.acos(2.0 * v - 1.0);
  const r = Math.cbrt(Math.random());
  const sinTheta = Math.sin(theta);
  const cosTheta = Math.cos(theta);
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const x = r * sinPhi * cosTheta;
  const y = r * sinPhi * sinTheta;
  const z = r * cosPhi;
  return { x, y, z };
};

export const getRandomPointsInSphere = (count) =>
  Array.from(
    { length: count },
    () => {
      const point = getPointsInSphere();
      const x = Math.floor(((point.x + 1) / 2) * 255);
      const y = Math.floor(((point.y + 1) / 2) * 255);
      const z = Math.floor(((point.z + 1) / 2) * 255);
      return [x, y, z, 255];
    },
    [],
  ).flat();

export const getGridPoints = (nbRows, nbColumns) => {
  let result = [];
  for (let y = 0; y < nbColumns; y++) {
    for (let x = 0; x < nbRows; x++) {
      const posX = mapFromRange(x, 0, nbRows - 1, 0, 255);
      const posY = 0;
      const posZ = mapFromRange(y, 0, nbColumns - 1, 0, 255);
      result = [...result, posX, posY, posZ, 255];
    }
  }
  return result;
};

export const getGridPerlinPoints = (nbRows, nbColumns) => {
  let result = [];
  const perlinNoise = new PerlinNoise();
  for (let y = 0; y < nbColumns; y++) {
    for (let x = 0; x < nbRows; x++) {
      const posX = mapFromRange(x, 0, nbRows - 1, 0, 255);
      const posY = Math.floor(perlinNoise.get(x, y) * 255);
      const posZ = mapFromRange(y, 0, nbColumns - 1, 0, 255);
      result = [...result, posX, posY, posZ, 255];
    }
  }
  return result;
};

export const get2DGridTexturePoints = (width, height) => {
  const texture = []; // texture coord to read position texture
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const posX = mapFromRange(x, 0, width - 1, 0, 1);
      const posY = mapFromRange(y, 0, height - 1, 0, 1);
      texture.push(posX);
      texture.push(posY);
    }
  }
  return texture;
};
