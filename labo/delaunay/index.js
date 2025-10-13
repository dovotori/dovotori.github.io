import WebWorker from "../lib/WebWorker";
import { downloadSVG } from "../utils";
import * as selectfile from "./selectfile";

import "Assets/style/controls.css";
import "Assets/style/range-input.css";
import "Assets/style/selectfile.css";

import "./style.css";

let canvasDebug = null;
let webworker = null;
let container = null;
let canvas = null;
let rangeThreshold = null;
let rangeGreen = null;
let rangeBlue = null;
let rangeRed = null;
let rangeBright = null;
let boxHide = null;
let boxDebug = null;
let boxGrey = null;

let initialDataImage = null;

const debugFastCorner = (context, corners) => {
  context.fillStyle = "rgba(255, 0, 0, 1)";
  corners.forEach(({ x, y }) => {
    context.beginPath();
    context.arc(x, y, 1, 0, 2 * Math.PI, true);
    context.fill();
  });
};

const drawOnCanvas = (context, coors) => {
  coors.forEach(({ x0, y0, x1, y1, x2, y2, color }) => {
    context.fillStyle = `rgb(${color.r},${color.g},${color.b})`;
    context.beginPath();
    context.moveTo(x0, y0);
    context.lineTo(x1, y1);
    context.lineTo(x2, y2);
    context.fill();
  });
};

const generateSvg = (width, height, coors) => {
  const xmlns = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(xmlns, "svg");
  svg.setAttribute("viewBox", `0 0 ${width} ${height} `);
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);
  svg.setAttribute("version", "1.1");
  svg.setAttribute("xmlns", xmlns);

  coors.forEach(({ x0, y0, x1, y1, x2, y2, color }) => {
    const fc = `rgba(${color.r}, ${color.g}, ${color.b}, 1)`;
    const polygon = document.createElementNS(xmlns, "polygon");
    polygon.setAttribute("points", `${x0} ${y0} ${x1} ${y1} ${x2} ${y2} `);
    polygon.setAttribute("fill", fc);
    polygon.setAttribute("stroke", fc);
    svg.appendChild(polygon);
  });
  return svg;
};

const startDelaunayProcess = (data, threshold) => {
  const { width, height } = canvas;
  const payload = { data, width, height, threshold };
  webworker.postMessage({ type: "delaunay", payload });
};

const redrawSvg = () => {
  container.innerHTML = "";
  const context = canvas.getContext("2d");
  const { data } = context.getImageData(0, 0, canvas.width, canvas.height);
  startDelaunayProcess(data, rangeThreshold.value);
};

const receiveDelaunay = ({ coors, corners, width, height }) => {
  const svg = generateSvg(width, height, coors);
  container.appendChild(svg);

  if (boxDebug.checked) {
    const context = canvasDebug.getContext("2d");
    canvasDebug.width = width;
    canvasDebug.height = height;
    canvasDebug.setAttribute("class", "debug");
    debugFastCorner(context, corners);
    // drawOnCanvas(context, coors);
    container.appendChild(canvasDebug);
  }
  downloadSVG(svg, "#downloadsvg", "delaunay");
};

const receiveColor = ({ buffer, width, height }) => {
  const context = canvas.getContext("2d");
  // const roots = new Uint32Array(width * height);
  // for (let i = 0; i < roots.length; i++) roots[i] = 0xff000000 | (Math.sin(i * 0.0001) * 0xffffff);
  const newImg = new ImageData(new Uint8ClampedArray(buffer), width, height);
  context.putImageData(newImg, 0, 0);

  redrawSvg();
};

const endProcess = (e) => {
  const { type, payload } = e.data;
  switch (type) {
    case "delaunay":
      receiveDelaunay(payload);
      break;
    case "color":
      receiveColor(payload);
      break;
    default:
      break;
  }
};

const loadImage = (url) =>
  new Promise((resolve) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.src = url;
  });

const changeColor = () => {
  const green = parseInt(rangeGreen.value, 10);
  const blue = parseInt(rangeBlue.value, 10);
  const red = parseInt(rangeRed.value, 10);
  const bright = parseFloat(rangeBright.value, 10);
  const { width, height } = canvas;
  const grey = !!boxGrey.checked;
  const payload = {
    data: initialDataImage,
    width,
    height,
    blue,
    red,
    green,
    bright,
    grey,
  };
  webworker.postMessage({ type: "color", payload });
};

const resetSettings = () => {
  rangeGreen.value = 1;
  rangeBlue.value = 1;
  rangeRed.value = 1;
  rangeBright.value = 1;
};

const handleFile = async (file) => {
  const fileSize = file.size / 1024 / 1024;
  if (fileSize < 1) {
    // < 1 Mb
    const img = await loadImage(URL.createObjectURL(file));
    const { width, height } = img;
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    context.drawImage(img, 0, 0);
    const { data: initialData } = context.getImageData(0, 0, width, height);
    initialDataImage = initialData;
    resetSettings();
    redrawSvg();
  } else {
    selectfile.setError("File too big. Please select a file under 1 MB");
  }
};

const stopPropa = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

const changeHide = (elem) => (e) => {
  stopPropa(e);
  elem.classList.toggle("hide");
};

export default async () => {
  // const url = "/public/app/android-chrome-36x36.png";
  canvasDebug = document.createElement("canvas");
  container = document.querySelector("#container");
  canvas = document.querySelector("#imagecanvas");
  rangeThreshold = document.querySelector("#threshold");
  rangeGreen = document.querySelector("#green");
  rangeBlue = document.querySelector("#blue");
  rangeRed = document.querySelector("#red");
  rangeBright = document.querySelector("#bright");
  boxHide = document.querySelector("#boxhide");
  boxDebug = document.querySelector("#boxdebug");
  boxGrey = document.querySelector("#boxgrey");

  const url = "/public/img/japon/japon-0.jpg";
  const img = await loadImage(url);
  const { width, height } = img;
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  context.drawImage(img, 0, 0);
  const { data: initialData } = context.getImageData(0, 0, width, height);
  initialDataImage = initialData;
  webworker = new WebWorker(
    new Worker(new URL("/public/worker/delaunayworker.js", import.meta.url)),
  );
  webworker.setMessageListener(endProcess);
  startDelaunayProcess(initialData, rangeThreshold.value);

  rangeThreshold.addEventListener("change", redrawSvg);
  rangeBright.addEventListener("change", changeColor);
  rangeBlue.addEventListener("change", changeColor);
  rangeRed.addEventListener("change", changeColor);
  rangeGreen.addEventListener("change", changeColor);
  boxHide.addEventListener("change", changeHide(container));
  boxDebug.addEventListener("change", changeHide(canvasDebug));
  boxGrey.addEventListener("change", changeColor);

  selectfile.setup(handleFile);
};

export const destroy = () => {
  if (rangeThreshold) rangeThreshold.removeEventListener("change", redrawSvg);
  if (rangeBright) rangeBright.removeEventListener("change", changeColor);
  if (rangeBlue) rangeBlue.removeEventListener("change", changeColor);
  if (rangeRed) rangeRed.removeEventListener("change", changeColor);
  if (rangeGreen) rangeGreen.removeEventListener("change", changeColor);
  if (boxHide) boxHide.removeEventListener("change", changeHide(container));
  if (boxDebug) boxDebug.removeEventListener("change", changeHide(canvasDebug));
  if (boxGrey) boxGrey.removeEventListener("change", changeColor);
  webworker.destroy();
};
