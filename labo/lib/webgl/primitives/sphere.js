// based on https://sites.google.com/site/ofauckland/examples/geographic-grid-tessellated-sphere

export const getPoints = (stacks = 32, slices = 32) => {
  const points = [];
  points.push(0, 0, 1);

  for (let i = 1; i < stacks; i++) {
    const phi = Math.PI * (i / stacks);
    const cosPhi = Math.cos(phi);
    const sinPhi = Math.sin(phi);
    for (let j = 0; j < slices; j++) {
      const theta = Math.PI * 2 * (j / slices);
      points.push(Math.cos(theta) * sinPhi);
      points.push(Math.sin(theta) * sinPhi);
      points.push(cosPhi);
    }
  }
  points.push(0, 0, -1);
  return points;
};

export const getIndices = (stacks = 32, slices = 32, nbPoints) => {
  const indices = [];
  // top row triangle fan
  for (let j = 1; j < slices; j++) {
    indices.push(0, j, j + 1);
  }
  indices.push(0, slices, 1);
  // triangle strips
  for (let i = 0; i < stacks - 2; i++) {
    const top = i * slices + 1;
    const bottom = (i + 1) * slices + 1;
    for (let j = 0; j < slices - 1; j++) {
      indices.push(bottom + j, bottom + j + 1, top + j + 1);
      indices.push(bottom + j, top + j + 1, top + j);
    }
    indices.push(bottom + slices - 1, bottom, top);
    indices.push(bottom + slices - 1, top, top + slices - 1);
  }
  // bottom row triangle fan
  const last = nbPoints - 1;
  for (let j = last - 1; j > last - slices; j--) {
    indices.push(last, j, j - 1);
  }
  indices.push(last, last - slices, last - 1);
  return indices;
};

export default (width, height) => {
  const position = getPoints(width, height);
  return {
    position,
    indices: getIndices(width, height, position.length / 3),
  };
};
