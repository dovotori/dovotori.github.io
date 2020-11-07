// based on ftp://ftp.cs.brown.edu/pub/techreports/05/cs05-14.pdf
import { mapFromRange } from '../utils/numbers';

export const getPoints = (width, nbDoublesLines = 1) => {
  const distanceX = 1;
  const distanceY = 0.5;
  const points = [];
  // first line
  let posY = -distanceY;
  for (let y = 0; y < nbDoublesLines; y++) {
    posY += distanceY;
    for (let x = 0; x < width; x++) {
      const posX = x * distanceX;
      points.push(mapFromRange(posX, 0, width, -1, 1));
      points.push(0);
      points.push(mapFromRange(posY, 0, nbDoublesLines, -1, 1));
    }
    // second line
    let moveX = 0;
    posY += distanceY;
    for (let x = 0; x < width; x++) {
      points.push(mapFromRange(moveX, 0, width, -1, 1));
      points.push(0);
      points.push(mapFromRange(posY, 0, nbDoublesLines, -1, 1));

      if (x === 0) {
        moveX += distanceX * 0.5;
        points.push(mapFromRange(moveX, 0, width, -1, 1));
        points.push(0);
        points.push(mapFromRange(posY, 0, nbDoublesLines, -1, 1));
      }

      if (x === width - 2) {
        moveX += distanceX * 0.5;
      } else {
        moveX += distanceX;
      }
    }
  }
  // last line
  posY += distanceY;
  for (let x = 0; x < width; x++) {
    const posX = x * distanceX;
    points.push(mapFromRange(posX, 0, width, -1, 1));
    points.push(0);
    points.push(mapFromRange(posY, 0, nbDoublesLines, -1, 1));
  }
  return points;
};

export const getIndices = (width, nbDoublesLines = 1) => {
  const indices = [];
  const nbIndicesPerDoubleLine = width + width + 1;
  for (let y = 0; y < nbDoublesLines; y++) {
    const refX = nbIndicesPerDoubleLine * y;
    // first line
    for (let x = width - 1; x >= 0; x--) {
      const down = x + width + refX;
      if (x === width - 1) {
        indices.push(down + 1);
      }
      indices.push(x + refX);
      // avoid repeating first index from second line
      if (x !== 0) {
        indices.push(down);
      }
    }
    // second line
    const secondLineLength = width + 1;

    for (let x = width; x < width + secondLineLength; x++) {
      indices.push(x + refX);
      if (x !== width + secondLineLength - 1) {
        const down = x + secondLineLength + refX;
        indices.push(down);
      }
    }
    // degenerate -> we duplicate the last one to setup correctly the next double line
    if (y !== nbDoublesLines - 1) {
      indices.push(width + width + refX);
    }
  }
  return indices;
};

export default (width, height, options) => ({
  position: getPoints(width, height, options),
  indices: getIndices(width, height),
});
