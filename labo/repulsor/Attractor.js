import { vec3 } from './vec3';

export function Attractor() {
  this.position = new vec3(0, 0, 0);
  this.vitesse = new vec3(1, 1, 1);
  this.radius = 100.0; // rayon d'action
  this.strength = -10.0; // positive attraction, negative repulsion
  this.ramp = 1.0; // force elastique 0.01 - 0.99
}

Attractor.prototype.update = function (width, height) {
  if (this.position.x < 0 || this.position.x > width) {
    this.vitesse.x *= -1;
  }
  if (this.position.y < 0 || this.position.y > height) {
    this.vitesse.y *= -1;
  }
  this.position.x += this.vitesse.x;
  this.position.y += this.vitesse.y;
};

Attractor.prototype.draw = function () {
  context.fillRect(this.position.x - 5, this.position.y - 5, 10, 10);
};

Attractor.prototype.attract = function (node) {
  const dx = this.position.x - node.position.x;
  const dy = this.position.y - node.position.y;
  const dz = this.position.z - node.position.z;
  const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

  if (distance > 0 && distance < this.radius) {
    const s = distance / this.radius;
    let force = 1 / Math.pow(s, 0.5 * this.ramp) - 1;
    force = (this.strength * force) / this.radius;

    node.velocity.x += dx * force;
    node.velocity.y += dy * force;
    node.velocity.z += dz * force;
  }
};

Attractor.prototype.setPosition = function (x, y, z) {
  this.position.set(x, y, z);
};
