const normalize = ([x, y, z]) => {
  let mag = x * x + y * y + z * z;
  if (mag !== 0.0 && mag !== 1.0) {
    mag = 1.0 / Math.sqrt(mag);
    return [x * mag, y * mag, z * mag];
  }
  return [x, y, z];
};

const midpoint = (a, b) => [
  (a[0] + b[0]) / 2,
  (a[1] + b[1]) / 2,
  (a[2] + b[2]) / 2,
];

const pointToKey = (point) =>
  `${point[0].toPrecision(6)},${point[1].toPrecision(6)},${point[2].toPrecision(6)}`;

// TODO: work out the second half of loop subdivision
// and extract this into its own module.
function subdivide(complex) {
  const { positions, cells } = complex;

  const newCells = [];
  const newPositions = [];
  const midpoints = {};

  // reuse midpoint vertices between iterations.
  // Otherwise, there'll be duplicate vertices in the final
  // mesh, resulting in sharp edges.
  const getMidpoint = (a, b) => {
    const point = midpoint(a, b);
    const pointKey = pointToKey(point);
    const cachedPoint = midpoints[pointKey];
    if (cachedPoint) {
      return cachedPoint;
    }
    midpoints[pointKey] = point;
    return midpoints[pointKey];
  };

  let l = 0;

  for (let i = 0; i < cells.length; i++) {
    const cell = cells[i];
    const c0 = cell[0];
    const c1 = cell[1];
    const c2 = cell[2];
    const v0 = positions[c0];
    const v1 = positions[c1];
    const v2 = positions[c2];

    const a = getMidpoint(v0, v1);
    const b = getMidpoint(v1, v2);
    const c = getMidpoint(v2, v0);

    let ai = newPositions.indexOf(a);
    if (ai === -1) {
      ai = l++;
      newPositions.push(a);
    }
    let bi = newPositions.indexOf(b);
    if (bi === -1) {
      bi = l++;
      newPositions.push(b);
    }
    let ci = newPositions.indexOf(c);
    if (ci === -1) {
      ci = l++;
      newPositions.push(c);
    }

    let v0i = newPositions.indexOf(v0);
    if (v0i === -1) {
      v0i = l++;
      newPositions.push(v0);
    }
    let v1i = newPositions.indexOf(v1);
    if (v1i === -1) {
      v1i = l++;
      newPositions.push(v1);
    }
    let v2i = newPositions.indexOf(v2);
    if (v2i === -1) {
      v2i = l++;
      newPositions.push(v2);
    }

    newCells.push([v0i, ai, ci]);
    newCells.push([v1i, bi, ai]);
    newCells.push([v2i, ci, bi]);
    newCells.push([ai, bi, ci]);
  }

  return {
    cells: newCells,
    positions: newPositions,
  };
}

export default (subdivs = 0, noNormalize = false) => {
  let subdivisions = +subdivs | 0;

  let positions = [];
  const faces = [];
  const uvs = [];
  const t = 0.5 + Math.sqrt(5) / 2;

  positions.push([-1, +t, 0]);
  positions.push([+1, +t, 0]);
  positions.push([-1, -t, 0]);
  positions.push([+1, -t, 0]);

  positions.push([0, -1, +t]);
  positions.push([0, +1, +t]);
  positions.push([0, -1, -t]);
  positions.push([0, +1, -t]);

  positions.push([+t, 0, -1]);
  positions.push([+t, 0, +1]);
  positions.push([-t, 0, -1]);
  positions.push([-t, 0, +1]);

  faces.push([0, 11, 5]);
  faces.push([0, 5, 1]);
  faces.push([0, 1, 7]);
  faces.push([0, 7, 10]);
  faces.push([0, 10, 11]);

  faces.push([1, 5, 9]);
  faces.push([5, 11, 4]);
  faces.push([11, 10, 2]);
  faces.push([10, 7, 6]);
  faces.push([7, 1, 8]);

  faces.push([3, 9, 4]);
  faces.push([3, 4, 2]);
  faces.push([3, 2, 6]);
  faces.push([3, 6, 8]);
  faces.push([3, 8, 9]);

  faces.push([4, 9, 5]);
  faces.push([2, 4, 11]);
  faces.push([6, 2, 10]);
  faces.push([8, 6, 7]);
  faces.push([9, 8, 1]);

  let complex = {
    cells: faces,
    positions,
  };

  while (subdivisions-- > 0) {
    complex = subdivide(complex);
  }

  positions = complex.positions;
  for (let i = 0; i < positions.length; i++) {
    const position = normalize(positions[i]);
    // without normalise icohedre
    if (!noNormalize) {
      positions[i] = position;
    }
    const u = 0.5 * (-(Math.atan2(position[2], -position[0]) / Math.PI) + 1.0);
    const v = 0.5 + Math.asin(position[1]) / Math.PI;
    uvs.push([1 - u, 1 - v]);
  }

  return {
    position: complex.positions.flat(),
    indices: complex.cells.flat(),
    texture: uvs.flat(),
    normale: complex.positions.flat(),
  };
};
