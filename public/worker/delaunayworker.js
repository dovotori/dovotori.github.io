import fast from '../../labo/lib/fastcorner';
import Delaunay from '../../labo/lib/delaunay';

const getGrayScaleBuffer = (data, width, height) => {
  const gs = new Uint8Array(width * height);
  let i = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      // data[idx] is red
      // data[idx+1] is green
      // data[idx+2] is blue
      // data[idx+3] is alpha
      // const gray = parseInt(data[idx] * 0.3 + data[idx + 1] * 0.6 + data[idx + 2] * 0.11, 10);
      const gray = (data[idx] >> 2) + (data[idx + 1] >> 1) + (data[idx + 2] >> 2); // faster
      gs[i++] = gray;
    }
  }
  return gs;
};

// Calculate area of triangle formed by (x1, y1), (x2, y2) and (x3, y3)
const computeArea = (x1, y1, x2, y2, x3, y3) =>
  Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);

// Check whether point P(x, y) lies inside the triangle formed by A(x1, y1), B(x2, y2) and C(x3, y3)
const isInside = (x1, y1, x2, y2, x3, y3, x, y) => {
  // Calculate area of triangle ABC
  const A = computeArea(x1, y1, x2, y2, x3, y3);
  // Calculate area of triangle PBC
  const A1 = computeArea(x, y, x2, y2, x3, y3);
  // Calculate area of triangle PAC
  const A2 = computeArea(x1, y1, x, y, x3, y3);
  // Calculate area of triangle PAB
  const A3 = computeArea(x1, y1, x2, y2, x, y);
  // Check if sum of A1, A2 and A3 is same as A
  return A === A1 + A2 + A3;
};

const getColorPixelFromBuffer = (buffer, x, y, width) => {
  const indexPixel = width * Math.max(0, y - 1) + x;
  const offset = 4; // rgba
  const i = indexPixel * offset;
  return buffer.subarray(i, i + offset).values();
};

const getAverageColorOnTriangle = (data, x0, y0, x1, y1, x2, y2, width) => {
  // get the bounding box of the triangle
  const maxX = Math.max(x0, Math.max(x1, x2));
  const minX = Math.min(x0, Math.min(x1, x2));
  const maxY = Math.max(y0, Math.max(y1, y2));
  const minY = Math.min(y0, Math.min(y1, y2));

  const averageColor = { r: 0, g: 0, b: 0 };
  let cptInsidePix = 0;
  for (let x = minX; x <= maxX; x++) {
    for (let y = minY; y <= maxY; y++) {
      if (isInside(x0, y0, x1, y1, x2, y2, x, y)) {
        const imgPixColor = getColorPixelFromBuffer(data, x, y, width);
        averageColor.r += imgPixColor.next().value; // r
        averageColor.g += imgPixColor.next().value; // g
        averageColor.b += imgPixColor.next().value; // b
        cptInsidePix++;
      }
    }
  }
  averageColor.r /= cptInsidePix;
  averageColor.g /= cptInsidePix;
  averageColor.b /= cptInsidePix;
  return averageColor;
};

const computeDelaunay = ({ data, width, height, threshold }) => {
  const gs = getGrayScaleBuffer(data, width, height);
  const corners = fast.detect(gs, width, height, threshold, true);
  const points = corners.reduce((acc, cur) => {
    acc.push([cur.x, cur.y]);
    return acc;
  }, []);
  points.push([0, 0], [width - 1, 0], [0, height - 1], [width - 1, height - 1]); // image corners
  const indices = Delaunay.triangulate(points);
  const coors = [];

  for (let j = 0; j < indices.length; j += 3) {
    const x0 = points[indices[j]][0];
    const y0 = points[indices[j]][1];
    const x1 = points[indices[j + 1]][0];
    const y1 = points[indices[j + 1]][1];
    const x2 = points[indices[j + 2]][0];
    const y2 = points[indices[j + 2]][1];

    const color = getAverageColorOnTriangle(data, x0, y0, x1, y1, x2, y2, width);
    coors.push({ x0, y0, x1, y1, x2, y2, color });
  }
  return { coors, width, height, corners };
};

const computeColor = ({ data, width, height, green, red, blue, bright, grey }) => {
  const newData = data;
  for (let i = 0; i <= data.length; i += 4) {
    const r = data[i] * red;
    const v = data[i + 1] * green;
    const b = data[i + 2] * blue;
    newData[i] = r;
    newData[i + 1] = v;
    newData[i + 2] = b;
    if (grey) {
      const g = Math.min(Number.parseInt(r + v + b / 3, 10), 255);
      newData[i] = g;
      newData[i + 1] = g;
      newData[i + 2] = g;
    }
    newData[i] *= bright;
    newData[i + 1] *= bright;
    newData[i + 2] *= bright;
  }
  return { buffer: newData, width, height };
};

self.onmessage = (e) => {
  const { type, payload, id } = e.data;
  let newPayload = null;
  switch (type) {
    case 'delaunay':
      newPayload = computeDelaunay(payload);
      break;
    case 'color':
      newPayload = computeColor(payload);
      break;
    default:
      break;
  }
  self.postMessage({ type, id, payload: newPayload });
};
