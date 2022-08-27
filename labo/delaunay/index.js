import fast from '../lib/fastcorner';
import Delaunay from '../lib/delaunay';

import 'Assets/style/controls.css';
import 'Assets/style/range-input.css';

import './style.css';

const container = document.querySelector('#container');
const webworker = new Worker('/public/worker/delaunayworker.js');

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

// A utility function to calculate area of triangle formed by (x1, y1), (x2, y2) and (x3, y3)
const area = (x1, y1, x2, y2, x3, y3) => Math.abs((x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2)) / 2.0);

// A function to check whether point P(x, y) lies inside the triangle formed by A(x1, y1), B(x2, y2) and C(x3, y3)
const isInside = (x1, y1, x2, y2, x3, y3, x, y) => {
  // Calculate area of triangle ABC
  const A = area(x1, y1, x2, y2, x3, y3);
  // Calculate area of triangle PBC
  const A1 = area(x, y, x2, y2, x3, y3);
  // Calculate area of triangle PAC
  const A2 = area(x1, y1, x, y, x3, y3);
  // Calculate area of triangle PAB
  const A3 = area(x1, y1, x2, y2, x, y);
  // Check if sum of A1, A2 and A3 is same as A
  return (A === A1 + A2 + A3);
};

const getAverageColorOnTriangle = (context, x0, y0, x1, y1, x2, y2) => {
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
        const imgPixColor = context.getImageData(x, y, 1, 1);
        const [r, g, b] = imgPixColor.data;
        averageColor.r += r;
        averageColor.g += g;
        averageColor.b += b;
        cptInsidePix++;
        // context.fillRect(x, y, 1, 1);
        // context.fill();
      }
    }
  }
  averageColor.r /= cptInsidePix;
  averageColor.g /= cptInsidePix;
  averageColor.b /= cptInsidePix;
  return averageColor;
};

const debugFastCorner = (context, corners) => {
  context.fillStyle = 'rgba(255, 0, 0, 1)';
  corners.forEach(({ x, y }) => {
    context.beginPath();
    context.arc(x, y, 1, 0, 2 * Math.PI, true);
    context.fill();
  });
};

const drawOnCanvas = (context, coors) => {
  coors.forEach(({ x0, y0, x1, y1, x2, y2, color }) => {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineTo(x2, y2);
    context.fill();
  });
};

const generateSvg = (width, height, coors) => {
  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, 'svg');
  svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("version", "1.1");

  coors.forEach(({ x0, y0, x1, y1, x2, y2, color }) => {
    const fc = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
    const polygon = document.createElementNS(xmlns, 'polygon');
    polygon.setAttribute('points', `${x0} ${y0} ${x1} ${y1} ${x2} ${y2}`);
    polygon.setAttribute('fill', fc);
    polygon.setAttribute('stroke', fc);
    svg.appendChild(polygon);
  });
  return svg;
};

const executeDelaunayOnImage = (img, threshold) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const { width } = img;
  const { height } = img;
  canvas.width = width;
  canvas.height = height;
  context.drawImage(img, 0, 0);
  const { data } = context.getImageData(0, 0, width, height);

  const gs = getGrayScaleBuffer(data, width, height);
  const corners = fast.detect(gs, width, height, threshold, true);
  const points = corners.reduce((acc, cur) => { acc.push([cur.x, cur.y]); return acc; }, []);
  points.push([0, 0], [width, 0], [0, height], [width, height]); // image corners
  const indices = Delaunay.triangulate(points);
  const coors = [];

  for (let j = 0; j < indices.length; j += 3) {
    const x0 = points[indices[j]][0];
    const y0 = points[indices[j]][1];
    const x1 = points[indices[j + 1]][0];
    const y1 = points[indices[j + 1]][1];
    const x2 = points[indices[j + 2]][0];
    const y2 = points[indices[j + 2]][1];

    const color = getAverageColorOnTriangle(context, x0, y0, x1, y1, x2, y2);
    coors.push({ x0, y0, x1, y1, x2, y2, color });
  }

  debugFastCorner(context, corners);
  // drawOnCanvas(context, coors);

  container.appendChild(generateSvg(width, height, coors));
  container.appendChild(canvas);
  container.appendChild(img); // show img

}

const loadImage = (url) => new Promise(resolve => {
  const img = new Image();
  img.addEventListener("load", () => resolve(img));
  img.src = url;
});

const computeImage = async (threshold) => {
  await loadImage("/public/img/japon/japon-0.jpg").then(img => {
    executeDelaunayOnImage(img, threshold);
  });
};

export default async () => {
  const range = document.querySelector('#threshold');
  webworker.onmessage = (e) => {
    console.log(e);

  };
  webworker.postMessage('Principal');
  await computeImage(40);
  range.addEventListener("change", async () => {
    container.innerHTML = '';
    await computeImage(range.value);
  })
};


