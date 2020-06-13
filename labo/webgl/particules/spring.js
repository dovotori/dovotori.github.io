import Vec3 from "../maths/Vec3";

export default class { 
  constructor() {
    this.length = 10.0;   // distance avec le point d'origine
    this.stiffness = 0.2; // rigidite entre 0 et 0.999999
    this.damping = 0.9;   // amortissement entre 0 et 0.99999
  }

  update = (origine, node) => {
    let diff = new Vec3(0, 0, 0);
    let target = new Vec3(0, 0, 0);
    let force = new Vec3(0, 0, 0);

    diff = origine.moins(node.position);
    diff.normaliser();
    diff = diff.multiplierValeur(-this.length);

    target = origine.plus(diff);

    force = target.moins(node.position);
    force = force.multiplierValeur(this.stiffness);
    force = force.multiplierValeur(1 - this.damping);

    node.setSpeed(node.vitesse.plus(force));
  }

  setLength = (value) => { this.length = value; }

  setStiffness = (value) => { this.stiffness = value; }

  setDamping = (value) => { this.damping = value; }
}