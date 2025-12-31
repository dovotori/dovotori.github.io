import { getEnvPath, mapFromRange } from "../../src/utils";
import { Attractor } from "./Attractor";
import { Node } from "./Node";
import { ParsingSvg } from "./ParsingSvg";
import { Spring } from "./Spring";
import { vec3 } from "./vec3";

const attractor = new Attractor();
let canvas = null;
let nodes = [];
let springs = [];
const fixPoints = [];
let cptHome = 0;
let context = null;
let proportionnelleDistance = 0;

let windowRequestHome = null;
let lastFrame = Date.now();

const FPS = 1000 / 40;
const POINT_SIZE = 4;
const HALF_POINT_SIZE = POINT_SIZE / 2;

const getSvgSize = (svg) => {
  let width = 400;
  let height = 400;
  const viewBox = svg.getAttribute("viewBox");
  if (viewBox) {
    const parts = viewBox.split(/\s+|,/).map(parseFloat);
    if (parts.length === 4) {
      width = parts[2];
      height = parts[3];
    }
  }

  // Default to 400 if still NaN
  if (Number.isNaN(width)) width = 400;
  if (Number.isNaN(height)) height = 400;

  return { width, height };
};

export default async () => {
  const embedElem = document.querySelector("#embed-svg");
  canvas = document.querySelector("#canvas-svg");
  function resizeCanvasAndBounds() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    Node.setBox(0, 0, 0, canvas.width, canvas.height, 1000);
  }
  resizeCanvasAndBounds();
  context = canvas.getContext("2d");

  window.addEventListener("resize", () => {
    resizeCanvasAndBounds();
  });

  embedElem.onload = () => {
    const svgDom = embedElem.getSVGDocument();
    const svg = svgDom.getElementsByTagName("svg")[0];

    proportionnelleDistance = mapFromRange(
      Math.min(canvas.width, canvas.height),
      0,
      10000,
      0,
      1600
    );

    const points = setupPoints(svg);
    const svgSize = getSvgSize(svg);
    const box = canvas.getBoundingClientRect();

    // Use uniform scale to preserve aspect ratio
    const scale = Math.min(box.width / svgSize.width, box.height / svgSize.height);

    // Find SVG shape bounds
    let minSvgX = Infinity,
      minSvgY = Infinity,
      maxSvgX = -Infinity,
      maxSvgY = -Infinity;
    for (let i = 0; i < points.length; i += 2) {
      if (points[i] < minSvgX) minSvgX = points[i];
      if (points[i] > maxSvgX) maxSvgX = points[i];
      if (points[i + 1] < minSvgY) minSvgY = points[i + 1];
      if (points[i + 1] > maxSvgY) maxSvgY = points[i + 1];
    }
    const shapeWidth = (maxSvgX - minSvgX) * scale;
    const shapeHeight = (maxSvgY - minSvgY) * scale;

    // Center the shape in the canvas (letterboxing)
    const offsetX = (canvas.width - shapeWidth) / 2 - minSvgX * scale;
    const offsetY = (canvas.height - shapeHeight) / 2 - minSvgY * scale;

    // Scale and translate points
    for (let i = 0; i < points.length; i += 2) {
      fixPoints[i] = points[i] * scale + offsetX;
      fixPoints[i + 1] = points[i + 1] * scale + offsetY;
    }

    console.log({
      points,
      fixPoints,
      scale,
      svgSize,
      canvasSize: { width: canvas.width, height: canvas.height },
      offsetX,
      offsetY,
    });

    Node.setBox(-100, -100, 0, canvas.width + 100, canvas.height + 100, 0);

    const data = setupNodes(fixPoints);
    nodes = data.nodes;
    springs = data.springs;

    window.addEventListener("mousemove", onMouseMove, false);
    windowRequestHome = window.requestAnimationFrame(drawHome);
  };
  embedElem.src = getEnvPath("/svg/leaf3.svg"); // should not have curbs, and no group transforms

  // const svg = await fetch(getEnvPath('/svg/cubeClean.svg')).then((x) => x.text());
};

function setupPoints(svg) {
  const parseSvg = new ParsingSvg();
  parseSvg.setup(svg);
  return parseSvg.getPoints();
}

function setupNodes(points) {
  attractor.setPosition(0, 0, 0);
  let cptNodes = 0;
  const nodes = [];
  const springs = [];
  for (let i = 0; i < points.length; i += 2, cptNodes++) {
    nodes[cptNodes] = new Node();
    nodes[cptNodes].setPosition(points[i], points[i + 1], 0);
    springs[cptNodes] = new Spring();
  }
  return { nodes, springs };
}

function onMouseMove(event) {
  event.preventDefault();
  const box = canvas.getBoundingClientRect();
  let x = event.clientX - box.left;
  let y = event.clientY - box.top;
  x = mapFromRange(x, 0, canvas.offsetWidth, 0, canvas.width);
  y = mapFromRange(y, 0, canvas.offsetHeight, 0, canvas.height);

  attractor.setPosition(x, y, 0);
}

function drawHome() {
  const now = Date.now();
  const milli = now - lastFrame;

  if (milli > FPS) {
    context.clearRect(0, 0, canvas.width, canvas.height);

    drawForme();
    lastFrame = now;
  }

  windowRequestHome = window.requestAnimationFrame(drawHome);
}

function drawForme() {
  context.fillStyle = "#fff";

  updatePoints();
  drawPoints();
}

function updatePoints() {
  for (let i = 0; i < nodes.length; i++) {
    attractor.attract(nodes[i]);
    nodes[i].update(false, false, true);
    // drawLiaisonProche(i);
  }
}

function drawPoints() {
  // attractor.draw();

  let cptNodes = 0;

  for (let i = 0; i < fixPoints.length; i += 2, cptNodes++) {
    const x = fixPoints[i];
    const y = fixPoints[i + 1];

    context.fillRect(x, y, POINT_SIZE, POINT_SIZE);

    // moving
    const movX = nodes[cptNodes].position.x;
    const movY = nodes[cptNodes].position.y;
    context.fillRect(movX - HALF_POINT_SIZE, movY - HALF_POINT_SIZE, POINT_SIZE, POINT_SIZE);

    // line between fix and moving
    context.strokeStyle = "rgba(255, 255, 255, 0.8)";
    context.beginPath();
    context.moveTo(x + HALF_POINT_SIZE, y + HALF_POINT_SIZE);
    context.lineTo(movX, movY);
    context.stroke();

    const origine = new vec3(x, y, 0);
    springs[cptNodes].update(origine, nodes[cptNodes]);
  }
}

function drawLiaisonProche(i) {
  const limiteDistance =
    proportionnelleDistance + Math.cos(cptHome) * (proportionnelleDistance / 8);

  cptHome += 0.0001;

  for (let j = 0; j < nodes.length; j++) {
    const distance = nodes[i].position.distance(nodes[j].position);

    if (distance > 1 && distance < limiteDistance) {
      let opacite = 0;
      if (distance > limiteDistance / 2) {
        opacite = mapFromRange(distance, limiteDistance / 2, limiteDistance, 1, 0.2);
      } else {
        opacite = mapFromRange(distance, 0, limiteDistance / 2, 0.2, 1);
      }

      context.strokeStyle = `rgba(255, 255, 255, ${opacite})`;
      context.beginPath();
      context.moveTo(nodes[i].position.x, nodes[i].position.y);
      context.lineTo(nodes[j].position.x, nodes[j].position.y);
      context.stroke();
    }
  }

  context.strokeStyle = "#fff";
}
