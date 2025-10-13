import { vec3 } from "./vec3";

export function Node() {
  this.position = new vec3(0, 0, 0);
  this.velocity = new vec3(0, 0, 0);
}

Node.damping = 0.3; // amortissement
Node.minX = 0;
Node.minY = 0;
Node.minZ = 0;
Node.maxX = 1000;
Node.maxY = 1000;
Node.maxZ = 1000;

Node.prototype.update = function (lockX, lockY, lockZ) {
  if (!lockX) {
    this.position.x += this.velocity.x;
  }
  if (!lockY) {
    this.position.y += this.velocity.y;
  }
  if (!lockZ) {
    this.position.z += this.velocity.z;
  }

  if (this.position.x < Node.minX) {
    this.position.x = Node.minX - (this.position.x - Node.minX);
    this.velocity.x *= -1;
  }

  if (this.position.x > Node.maxX) {
    this.position.x = Node.maxX - (this.position.x - Node.maxX);
    this.velocity.x *= -1;
  }

  if (this.position.y < Node.minY) {
    this.position.y = Node.minY - (this.position.y - Node.minY);
    this.velocity.y *= -1;
  }

  if (this.position.y > Node.maxY) {
    this.position.y = Node.maxY - (this.position.y - Node.maxY);
    this.velocity.y *= -1;
  }

  if (this.position.z < Node.minZ) {
    this.position.z = Node.minZ - (this.position.z - Node.minZ);
    this.velocity.z *= -1;
  }

  if (this.position.z > Node.maxZ) {
    this.position.z = Node.maxZ - (this.position.z - Node.maxZ);
    this.velocity.z *= -1;
  }

  this.velocity.multiply(Node.damping);
};

Node.prototype.draw = function () {
  context.fillRect(this.position.x, this.position.y, 1, 1);
};

Node.setBox = (minX, minY, minZ, maxX, maxY, maxZ) => {
  Node.minX = minX;
  Node.minY = minY;
  Node.minZ = minZ;
  Node.maxX = maxX;
  Node.maxY = maxY;
  Node.maxZ = maxZ;
};

Node.prototype.setPosition = function (x, y, z) {
  this.position.set(x, y, z);
};
