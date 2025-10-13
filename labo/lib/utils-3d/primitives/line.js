import Vec3 from "../../utils/maths/Vec3";

const getNormale = (point1, point2) => {
  const v1 = new Vec3(...point1);
  const v2 = new Vec3(...point2);
  const v = new Vec3().equal(v1).minus(v2);
  const n = v.cross(new Vec3(0, 0, 1));
  return n.get();
};

const getNewPoint = (point, normale, distance) => {
  const n = new Vec3(...normale).multiplyNumber(distance);
  const v1 = new Vec3(...point).add(n);
  return v1.get();
};

const flat = (points) => points.reduce((acc, point) => [...acc, ...point], []);

// pass points [[x, y, z], ...] which represents line direction
export const line = (points, weight = 0.1) => {
  const nbPoints = points.length;
  if (nbPoints > 1) {
    const newPoints = points.reduce((acc, point, index) => {
      let normale = null;
      switch (index) {
        case 0: {
          const nextPoint = points[index + 1];
          normale = getNormale(point, nextPoint);
          break;
        }
        case nbPoints - 1: {
          const prevPoint = points[index - 1];
          normale = getNormale(prevPoint, point);
          break;
        }
        default: {
          const prevPoint = points[index - 1];
          const nextPoint = points[index + 1];
          normale = getNormale(prevPoint, nextPoint);
          break;
        }
      }
      if (normale) {
        const newPoint = getNewPoint(point, normale, weight);
        return [...acc, point, newPoint];
      }
      return acc;
    }, []);
    const indices = Array(newPoints.length - 2)
      .fill()
      .reduce((acc, _, idx) => {
        if (idx % 2 === 0) {
          return [...acc, idx, idx + 1, idx + 2];
        }
        return [...acc, idx, idx + 2, idx + 1];
      }, []);
    return { position: flat(newPoints), indices };
  }

  return { position: flat(points) };
};

export const getPoints = (count) => new Array(count).fill([0, 0, 0]);

export const getSimpleLinePoints = (count) =>
  new Array(count).fill().map((_, i) => {
    const relValue = 2 * (i / count) - 1.0;
    const x = relValue;
    const y = 0;
    const z = 0;
    return [x, y, z];
  });

export const pointsLineWithAdjacents = (points) => {
  const nbPoints = points.length;
  if (nbPoints > 1) {
    let position = [];
    let next = [];
    let previous = [];

    points.forEach((point, index) => {
      position = [...position, ...point, ...point];

      let prevPoint = [];
      if (index === 0) {
        const secondPoint = points[1];
        prevPoint = [
          point[0] + (secondPoint[0] - point[0]),
          point[1] + (secondPoint[1] - point[1]),
          point[2] + (secondPoint[2] - point[2]),
        ];
      } else {
        prevPoint = points[index - 1];
      }
      previous = [...previous, ...prevPoint, ...prevPoint];

      let nextPoint = [];
      if (nbPoints - 1) {
        const beforeLastPoint = points[nbPoints - 2];
        nextPoint = [
          point[0] + (beforeLastPoint[0] - point[0]),
          point[1] + (beforeLastPoint[1] - point[1]),
          point[2] + (beforeLastPoint[2] - point[2]),
        ];
      } else {
        nextPoint = points[index + 1];
      }
      next = [...next, ...nextPoint, ...nextPoint];
    });
  }
};

export const getIndices = (nbPoints) =>
  Array((nbPoints - 1) * 2)
    .fill()
    .reduce((acc, _, idx) => {
      if (idx % 2 === 0) {
        return [...acc, idx, idx + 1, idx + 2];
      }
      return [...acc, idx, idx + 2, idx + 1];
    }, []);

export const getSide = (nbPoints) => {
  const side = new Float32Array(nbPoints * 2);
  Array(nbPoints)
    .fill()
    .forEach((_, index) => {
      side.set([-1, 1], index * 2);
    });
  return side;
};

export const getTexture = (nbPoints) => {
  let texture = [];
  Array(nbPoints)
    .fill()
    .forEach((_, index) => {
      texture = [...texture, index / nbPoints, 0, index / nbPoints, 1];
    });
  return texture;
};

// to compute width on shader
export const lineShaderWithAdjacents = (points) => {
  const nbPoints = points.length;

  if (nbPoints > 1) {
    let position = [];
    let next = [];
    let previous = [];

    points.forEach((point, index) => {
      position = [...position, ...point, ...point];

      let prevPoint = [];
      if (index === 0) {
        const secondPoint = points[1];
        prevPoint = [
          point[0] + secondPoint[0] - point[0],
          point[1] + secondPoint[1] - point[1],
          point[2] + secondPoint[2] - point[2],
        ];
      } else {
        prevPoint = points[index - 1];
      }
      previous = [...previous, ...prevPoint, ...prevPoint];

      let nextPoint = [];
      if (nbPoints - 1) {
        const beforeLastPoint = points[nbPoints - 2];
        nextPoint = [
          point[0] + beforeLastPoint[0] - point[0],
          point[1] + beforeLastPoint[1] - point[1],
          point[2] + beforeLastPoint[2] - point[2],
        ];
      } else {
        nextPoint = points[index + 1];
      }
      next = [...next, ...nextPoint, ...nextPoint];
    });
    return { position, next, previous };
  }

  return { position: flat(points) };
};

export const simpleLine = (count, weight) => {
  const points = getSimpleLinePoints(count);
  return line(points, weight);
};

export const sinusLine = (count, weight) => {
  const points = new Array(count).fill().map((_, i) => {
    const relValue = 2 * (i / count) - 1.0;
    const x = relValue;
    const y = Math.sin(relValue * 10.0) * 0.5;
    const z = 0;
    return [x, y, z];
  });
  return line(points, weight);
};
