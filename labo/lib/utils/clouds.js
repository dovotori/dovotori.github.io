import Vec3 from './maths/Vec3';

const getRandomSamplesOnGrid = (width, height, depth = null) => {
  const samples = [];
  if (depth === null) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        samples.push([x + Math.random(), y + Math.random()]);
      }
    }
  } else {
    for (let z = 0; z < depth; z++) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          samples.push([x + Math.random(), y + Math.random(), z + Math.random()]);
        }
      }
    }
  }
  return samples;
};

const find3DClosestDistanceFromSamples = (point, samples) => {
  const p1 = new Vec3(...point);
  return Math.max(
    0,
    samples.reduce((acc, cur) => {
      const p2 = new Vec3(...cur);
      const newDistance = p1.distance(p2);
      return Math.min(acc, newDistance);
    }, 1),
  );
};

const get2Ddistance = (p1, p2) =>
  Math.sqrt((p2[0] - p1[0]) * (p2[0] - p1[0]) + (p2[1] - p1[1]) * (p2[1] - p1[1]));

const find2DClosestDistanceFromSamples = (point, samples) =>
  Math.max(
    0,
    samples.reduce((acc, cur) => {
      const newDistance = get2Ddistance(point, cur);
      return Math.min(acc, newDistance);
    }, 1),
  );

const getSampleFromGridPos = (gridPos, samples, sizes) => {
  const [x, y, z = null] = gridPos;
  const width = sizes[0];
  const height = sizes[1];
  const depth = sizes[2];

  let newX = x;
  let isInverseX = false;
  if (x === -1) {
    newX = width - 1;
    isInverseX = true;
  } else if (x === width) {
    newX = 0;
    isInverseX = true;
  }

  let newY = y;
  let isInverseY = false;
  if (y === -1) {
    newY = height - 1;
    isInverseY = true;
  } else if (y === height) {
    newY = 0;
    isInverseY = true;
  }

  let newZ = z;
  let isInverseZ = false;
  if (z === -1) {
    newZ = depth - 1;
    isInverseZ = true;
  } else if (z === depth) {
    newZ = 0;
    isInverseZ = true;
  }

  let index = newY * height + newX;
  if (z !== null) {
    index += newZ * depth;
  }
  const newSample = [...samples[index]];

  if (isInverseX) {
    if (x === -1) {
      newSample[0] -= width;
    } else {
      newSample[0] += width;
    }
  }
  if (isInverseY) {
    if (y === -1) {
      newSample[1] -= height;
    } else {
      newSample[1] += height;
    }
  }
  if (isInverseZ) {
    if (z === -1) {
      newSample[2] -= depth;
    } else {
      newSample[2] += depth;
    }
  }
  return newSample;
};

const getSurroundingGridCase = (gridPos, sizes) => {
  const surroundingGridCase = [];
  if (sizes.length === 3) {
    for (let z = -1; z <= 1; z++) {
      for (let y = -1; y <= 1; y++) {
        for (let x = -1; x <= 1; x++) {
          surroundingGridCase.push([gridPos[0] + x, gridPos[1] + y, gridPos[2] + z]);
        }
      }
    }
  } else {
    for (let y = -1; y <= 1; y++) {
      for (let x = -1; x <= 1; x++) {
        surroundingGridCase.push([gridPos[0] + x, gridPos[1] + y]);
      }
    }
  }
  return surroundingGridCase;
};

export const getNearSamples = (gridPos, sizes, samples) => {
  const surroundingGridCase = getSurroundingGridCase(gridPos, sizes);
  return surroundingGridCase.map((pos) => getSampleFromGridPos(pos, samples, sizes));
};

export const generate2DTexture = (width, height, resolution) => {
  const samples = getRandomSamplesOnGrid(width, height);
  const sizes = [width, height];
  const values = [];
  let gridPos = [0, 0];
  let samplesToCompare = getNearSamples(gridPos, sizes, samples);

  for (let y = 0; y < height * resolution; y++) {
    for (let x = 0; x < width * resolution; x++) {
      const current = [x / resolution, y / resolution];
      const currentGridPos = current.map((c) => Math.floor(c));
      if (gridPos[0] !== currentGridPos[0] || gridPos[1] !== currentGridPos[1]) {
        gridPos = currentGridPos;
        samplesToCompare = getNearSamples(gridPos, sizes, samples);
      }
      const closestDistance = find2DClosestDistanceFromSamples(current, samplesToCompare);
      values.push(closestDistance);
    }
  }
  return values;
};

export const generate3DTexture = (width, height, depth, resolution) => {
  const samples = getRandomSamplesOnGrid(width, height, depth);
  const sizes = [width, height, depth];
  const values = [];
  let gridPos = [0, 0, 0];
  let samplesToCompare = getNearSamples(gridPos, sizes, samples);

  for (let z = 0; z < depth * resolution; z++) {
    for (let y = 0; y < height * resolution; y++) {
      for (let x = 0; x < width * resolution; x++) {
        const current = [x / resolution, y / resolution, z / resolution];
        const currentGridPos = current.map((c) => Math.floor(c));
        if (
          gridPos[0] !== currentGridPos[0] ||
          gridPos[1] !== currentGridPos[1] ||
          gridPos[2] !== currentGridPos[2]
        ) {
          gridPos = currentGridPos;
          samplesToCompare = getNearSamples(gridPos, sizes, samples);
        }
        const closestDistance = find3DClosestDistanceFromSamples(current, samplesToCompare);
        values.push(closestDistance);
      }
    }
  }
  return values;
};
