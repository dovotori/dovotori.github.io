import Vec3 from "../maths/Vec3";

export default class {
  constructor() {
    this.position = new Vec3(0, 0, 0);
    this.vitesse = new Vec3(1, 1, 1);
    this.radius = 40.0;     // rayon d'action
    this.strength = -10.0;   // positive attraction, negative repulsion
    this.ramp = 0.2;		// force elastique entre 0 et 0.9999
  }

  updatePong = (width = 600, height = 600) => {
    if(this.position.x < 0 || this.position.x > width){
      this.vitesse.x *= -1;
    }
    if(this.position.y < 0 || this.position.y > height){
      this.vitesse.y *= -1;
    }
    this.position.x += this.vitesse.x;
    this.position.y += this.vitesse.y;
  }

  attract = (node) => {
    let difference = this.position.moins(node.position);
    const distance = difference.longueur();

    if (distance > 0 && distance < this.radius) {
      const s = distance / this.radius;
      let force = 1 / (s ** (0.5 * this.ramp)) - 1;
      force = this.strength * force / this.radius;

      difference = difference.multiplierValeur(force);
      node.setSpeed(node.vitesse.plus(difference));
    }
  }

  setPosition = (x = 0, y = 0, z = 0) => {
    this.position.set(x, y, z);
  }

  setRadius = (value) => { this.radius = value; }     // rayon d'action 

  setStrength = (value) => { this.strength = value; }  // positive  attraction, negative repulsion

  setRamp = (value) => { this.ramp = value; } // force elastique entre 0 et 0.9999

  getPosition = () => { return this.position; } 
}
