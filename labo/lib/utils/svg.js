import { rgb2hex } from "./color";

const XMLNS = "http://www.w3.org/2000/svg";

export const downloadSVG = (svg, selector, prefix) => {
  const element = document.querySelector(selector);
  element.download = `${prefix}${Date.now()}.svg`;
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);
  // add name spaces.
  /* if (!source.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)) {
    source = source.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
  }
  if (!source.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)) {
    source = source.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
  } */
  // source = `<?xml version="1.0" standalone="no"?>\r\n${source}`;
  const url = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(source)}`;
  element.href = url;
};

export const createSvg = (width, height) => {
  const svg = document.createElementNS(XMLNS, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height} `);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("version", "1.1");
  return svg;
};

export const generateTriangles = (width, height, triangleCoors) => {
  const svg = createSvg(width, height);
  triangleCoors.forEach(({ x0, y0, x1, y1, x2, y2, color }) => {
    const hex = rgb2hex(color.r, color.g, color.b);
    const polygon = document.createElementNS(XMLNS, "polygon");
    polygon.setAttribute("points", `${x0} ${y0} ${x1} ${y1} ${x2} ${y2} `);
    polygon.setAttribute("fill", hex);
    polygon.setAttribute("stroke", hex);
    polygon.setAttribute("style", `fill:${hex};stroke:${hex}`);
    svg.appendChild(polygon);
  });
  return svg;
};

export const generateRectangles = (width, height, coors, corner) => {
  const svg = createSvg(width, height);
  coors.forEach(({ x, y, width: recWidth, height: recHeight, color }) => {
    // const fc = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
    const hex = rgb2hex(color.r, color.g, color.b);
    const polygon = document.createElementNS(XMLNS, "rect");
    polygon.setAttribute("x", x);
    polygon.setAttribute("y", y);
    polygon.setAttribute("width", recWidth);
    polygon.setAttribute("height", recHeight);
    polygon.setAttribute("fill", hex);
    polygon.setAttribute("style", `fill:${hex}`);
    polygon.setAttribute("rx", corner);
    polygon.setAttribute("ry", corner);
    svg.appendChild(polygon);
  });
  return svg;
};
