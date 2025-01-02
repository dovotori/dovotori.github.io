import { mapFromRange } from "../../../utils/numbers";

export const getPoints = (nbPoints = 32) => {
  const points = [];
  for (let i = 0; i < nbPoints; i++) {
    const radian = mapFromRange(i, 0, nbPoints, 0, Math.PI * 2);
    const x = Math.cos(radian);
    const y = Math.sin(radian);
    const z = 0;
    points.push(x, y, z);
  }
  return points;
};

export default (nbPoints) => ({
  position: getPoints(nbPoints),
});
