// based on ftp://ftp.cs.brown.edu/pub/techreports/05/cs05-14.pdf
import { mapFromRange } from "../../utils/numbers";

export const getPoints = (width, nbDoublesLines = 1) => {
  const points = [];
  // first line
  let posY = -1;
  for (let y = 0; y < nbDoublesLines; y++) {
    posY++;
    for (let x = 0; x < width; x++) {
      points.push(x, 0, posY);
    }
    // second line
    let moveX = 0;
    posY++;
    for (let x = 0; x < width; x++) {
      points.push(moveX, 0, posY);

      if (x === 0) {
        moveX += 0.5;
        points.push(moveX, 0, posY);
      }

      if (x === width - 2) {
        moveX += 0.5;
      } else {
        moveX++;
      }
    }
  }
  // last line
  posY++;
  for (let x = 0; x < width; x++) {
    points.push(x, 0, posY);
  }
  return points;
};

const getPlateauNbPoints = (width, nbDoublesLines) =>
  width * (nbDoublesLines + 1) + (width + 1) * nbDoublesLines;

const _getNormales = (width, height = 1) => {
  const nbPoints = getPlateauNbPoints(width, height);
  const normales = Array.from({ length: nbPoints }).fill([0, 1, 0]);
  return normales.flat();
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

// export const getContourNbPoints = (width, nbDoublesLines) =>
//   width * 2 + (nbDoublesLines * 2 - 1) * 2;

const addThickPoints = (width, nbDoublesLines, { thicknessY = -1 }) => {
  const points = [];
  // first point
  const lastStripPosition = [width - 1, nbDoublesLines * 2 - 1];
  points.push(lastStripPosition[0], thicknessY, lastStripPosition[1]);
  // bottom side right to left
  const yBottom = nbDoublesLines * 2;
  for (let i = width - 1; i > 0; i--) {
    points.push(i, thicknessY, yBottom);
  }
  // left side bottom to top
  for (let i = nbDoublesLines * 2; i > 0; i--) {
    points.push(0, thicknessY, i);
  }
  // left top left to right
  for (let i = 0; i < width - 1; i++) {
    points.push(i, thicknessY, 0);
  }
  // right side top to bottom - minus first
  for (let i = 0; i < nbDoublesLines * 2 - 1; i++) {
    points.push(width - 1, thicknessY, i);
  }
  return points;
};

const addThickIndices = (width, nbDoublesLines) => {
  const indices = [];
  const lastIndex = getPlateauNbPoints(width, nbDoublesLines) - 1;
  const lastStripIndex = lastIndex - width;
  indices.push(lastStripIndex);
  const firstThickIndex = lastIndex + 1;
  indices.push(firstThickIndex);

  let currentThickIndex = firstThickIndex + 1;
  // bottom side
  for (let i = lastIndex; i > lastIndex - width; i--) {
    indices.push(i);
    indices.push(currentThickIndex);
    currentThickIndex++;
  }
  // left side
  for (let i = nbDoublesLines * 2 - 1; i > 0; i--) {
    const firstIndexLine = width * i + Math.floor(i / 2);
    indices.push(firstIndexLine);
    indices.push(currentThickIndex);
    currentThickIndex++;
  }
  // top side
  for (let i = 0; i < width; i++) {
    indices.push(i);
    indices.push(currentThickIndex);
    currentThickIndex++;
  }
  // right side
  for (let i = 1; i < nbDoublesLines * 2 - 1; i++) {
    const lastIndexLine = width - 1 + (width * i + Math.ceil(i / 2));
    indices.push(lastIndexLine);
    indices.push(currentThickIndex);
    currentThickIndex++;
  }
  indices.push(lastStripIndex);
  indices.push(firstThickIndex);
  return indices;
};

const _addThickNormales = (_width, _nbDoublesLines) => {
  const normales = [];
  // const lastIndex = getPlateauNbPoints(width, nbDoublesLines) - 1;

  return normales;
};

const getMappedPoints = (points, width, height) => {
  const newPoints = [];
  for (let i = 0; i < points.length; i += 3) {
    const x = mapFromRange(points[i], 0, width - 1, -1, 1);
    const y = points[i + 1];
    const z = mapFromRange(points[i + 2], 0, height * 2 - 1, -1, 1);
    newPoints.push(x, y, z);
  }
  return newPoints;
};

export default (width, height, options = {}) => {
  const position = getPoints(width, height, options);
  const indices = getIndices(width, height);
  // const normale = getNormales(width, height);
  if (options.withThick) {
    const allPoints = position.concat(addThickPoints(width, height, options));
    return {
      position: getMappedPoints(allPoints, width, height),
      indices: indices.concat(addThickIndices(width, height)),
      // normale: normale.concat(addThickNormales(width, height)),
    };
  }
  return {
    position,
    indices,
    // normale,
  };
};
