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

const svgSize = {
  width: 0,
  height: 0,
};

let windowRequestHome = null;
let lastFrame = new Date().getTime();

const FPS = 1000 / 40;
const POINT_SIZE = 2;
const HALF_POINT_SIZE = POINT_SIZE / 2;

export default async () => {
  const embedElem = document.querySelector("#embed-svg");
  canvas = document.querySelector("#canvas-svg");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context = canvas.getContext("2d");

  embedElem.onload = () => {
    const svgDom = embedElem.getSVGDocument();
    const svg = svgDom.getElementsByTagName("svg")[0];

    proportionnelleDistance = mapFromRange(
      Math.min(canvas.width, canvas.height),
      0,
      10000,
      0,
      800,
    );

    const points = setupPoints(svg);

    const svgSize = {
      width: parseFloat(svg.getAttribute("width")),
      height: parseFloat(svg.getAttribute("height")),
    };

    const scale = canvas.width / svgSize.width;

    for (let i = 0; i < points.length; i += 2) {
      fixPoints[i] = points[i] * scale;
      fixPoints[i + 1] = points[i + 1] * scale;
    }

    const data = setupNodes(fixPoints);
    nodes = data.nodes;
    springs = data.springs;

    window.addEventListener("mousemove", onMouseMove, false);
    windowRequestHome = window.requestAnimationFrame(drawHome);
  };
  embedElem.src = getEnvPath("/svg/cubeClean.svg");

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
  const now = new Date().getTime();
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
  for (var i = 0; i < nodes.length; i++) {
    attractor.attract(nodes[i]);
    nodes[i].update(false, false, true);
    drawLiaisonProche(i);
  }
}

function drawPoints() {
  //attractor.draw();

  let cptNodes = 0;

  for (let i = 0; i < fixPoints.length; i += 2, cptNodes++) {
    // fix
    const x = fixPoints[i];
    const y = fixPoints[i + 1];

    context.fillRect(x, y, 1, 1);

    // moving
    const movX = nodes[cptNodes].position.x - HALF_POINT_SIZE;
    const movY = nodes[cptNodes].position.y - HALF_POINT_SIZE;
    context.fillRect(movX, movY, POINT_SIZE, POINT_SIZE);

    // line between fix and moving
    context.strokeStyle = "rgba(255, 255, 255, 0.8)";
    context.beginPath();
    context.moveTo(x, y);
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
        opacite = mapFromRange(
          distance,
          limiteDistance / 2,
          limiteDistance,
          1,
          0.2,
        );
      } else {
        opacite = mapFromRange(distance, 0, limiteDistance / 2, 0.2, 1);
      }

      context.strokeStyle = "rgba(255, 255, 255, " + opacite + ")";
      context.beginPath();
      context.moveTo(nodes[i].position.x, nodes[i].position.y);
      context.lineTo(nodes[j].position.x, nodes[j].position.y);
      context.stroke();
    }
  }

  context.strokeStyle = "#fff";
}
