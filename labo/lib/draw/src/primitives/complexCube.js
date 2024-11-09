export const getPoints = (width, height) => {
  const points = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      points.push(x);
      points.push(0.0);
      points.push(y);
    }
  }
  return points;
};
