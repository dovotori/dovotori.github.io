import { vec3 } from "./vec3";

export function Spring() {
  this.length = 1.0; // distance avec le point d'origine
  this.stiffness = 0.6; // rigidite
  this.damping = 0.9; // amortissement
}

Spring.prototype.update = function (origine, node) {
  let diff = new vec3(0, 0, 0);
  const target = new vec3(0, 0, 0);
  let force = new vec3(0, 0, 0);

  diff = origine.moins(node.position);
  diff.normaliser();
  diff.multiply(this.length * -1);
  target.egale(origine);
  target.addVector(diff);

  force = target.moins(node.position);
  force.multiply(this.stiffness);
  force.multiply(1 - this.damping);

  node.velocity.addVector(force);
};
