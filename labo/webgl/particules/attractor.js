import Node from './Node';
import Vec3 from '../maths/Vec3';

export default class extends Node {
  constructor(options = {}) {
    super(options);
    this.radius = 0.5; // rayon d'action
    this.strength = 0.1; // positive attraction, negative repulsion
    this.ramp = 0.2; // force elastique entre 0 et 0.9999
  }

  attract = (node) => {
    let difference = new Vec3().equal(this.position).minus(node.getPosition());
    const distance = difference.length();

    if (distance > 0 && distance < this.radius) {
      const s = distance / this.radius;
      let force = 1 / s ** (0.5 * this.ramp) - 1;
      force = (this.strength * force) / this.radius;

      difference = difference.multiplyNumber(force);
      node.setSpeed(...node.speed.add(difference).get());
    }
  };

  setRadius = (value) => {
    this.radius = value;
  };

  setStrength = (value) => {
    this.strength = value;
  };

  setRamp = (value) => {
    this.ramp = value;
  };
}
