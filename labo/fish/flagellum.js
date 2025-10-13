import { Node } from "./node";

function radians(angle) {
  return angle * (Math.PI / 180);
}

export class Flagellum {
  numNodes = 16; // number of nodes on the width
  skinXspacing = 0;
  skinYspacing = 0; // store distance for vertex points that builds the shape
  muscleRange = 6; // controls rotation angle of the neck
  muscleFreq = Math.random(0.06, 0.07); // ondulation strenght
  theta = 180;
  theta_friction = 0.6;
  count = 0;
  nodes = new Array(this.numNodes);

  constructor({ width, height }) {
    // tex size
    this.skinXspacing = width / this.numNodes + 0.5;
    this.skinYspacing = height / 2;

    // initialize nodes
    for (let i = 0; i < this.numNodes; i++) this.nodes[i] = new Node();
    console.log(this.nodes);
  }

  move() {
    // head node
    this.nodes[0].x = Math.cos(radians(this.theta));
    this.nodes[0].y = Math.sin(radians(this.theta));

    // mucular node (neck)
    this.count += this.muscleFreq;
    const thetaMuscle = this.muscleRange * Math.sin(this.count);
    this.nodes[1].x =
      -this.skinXspacing * Math.cos(radians(this.theta + thetaMuscle)) +
      this.nodes[0].x;
    this.nodes[1].y =
      -this.skinXspacing * Math.sin(radians(this.theta + thetaMuscle)) +
      this.nodes[0].y;

    // apply kinetic force trough body nodes (spine)
    for (let n = 2; n < this.numNodes; n++) {
      const dx = this.nodes[n].x - this.nodes[n - 2].x;
      const dy = this.nodes[n].y - this.nodes[n - 2].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      this.nodes[n].x = this.nodes[n - 1].x + (dx * this.skinXspacing) / d;
      this.nodes[n].y = this.nodes[n - 1].y + (dy * this.skinXspacing) / d;
    }
  }

  display(ctx) {
    let prev = [];

    for (let n = 0; n < this.numNodes; n++) {
      let dx;
      let dy;
      if (n === 0) {
        dx = this.nodes[1].x - this.nodes[0].x;
        dy = this.nodes[1].y - this.nodes[0].y;
      } else {
        dx = this.nodes[n].x - this.nodes[n - 1].x;
        dy = this.nodes[n].y - this.nodes[n - 1].y;
      }
      const angle = -Math.atan2(dy, dx);
      const x1 = this.nodes[n].x + Math.sin(angle) * -this.skinYspacing;
      const y1 = this.nodes[n].y + Math.cos(angle) * -this.skinYspacing;
      const x2 = this.nodes[n].x + Math.sin(angle) * this.skinYspacing;
      const y2 = this.nodes[n].y + Math.cos(angle) * this.skinYspacing;

      ctx.save();
      ctx.beginPath();
      ctx.translate(400, 200);
      if (n !== 0) {
        ctx.moveTo(prev[0][0], prev[0][1]);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(prev[1][0], prev[1][1]);
      } else {
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.stroke();
      ctx.restore();

      prev = [
        [x1, y1],
        [x2, y2],
      ];

      ctx.save();
      ctx.beginPath();
      ctx.translate(400, 200);
      ctx.ellipse(x1, y1, 2, 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.beginPath();
      ctx.translate(400, 200);
      ctx.ellipse(x2, y2, 2, 2, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}
