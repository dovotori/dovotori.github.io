export function vec3(x, y, z) {
  this.x = 0;
  this.y = 0;
  this.z = 0;

  if (x || y || z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

vec3.prototype.init = function () {
  this.x = 0;
  this.y = 0;
  this.z = 0;
};

vec3.prototype.normaliser = function () {
  var longueur = Math.sqrt(this.x ** 2 + this.y ** 2 + this.z ** 2);

  if (longueur !== 0.0) {
    this.x /= longueur;
    this.y /= longueur;
    this.z /= longueur;
  }
};

vec3.prototype.afficher = function () {
  alert("v: " + this.x + " " + this.y + " " + this.z);
};

vec3.prototype.produitVectoriel = function (vec31, vec32) {
  this.x = vec31.y * vec32.z - vec31.z * vec32.y;
  this.y = vec31.z * vec32.x - vec31.x * vec32.z;
  this.z = vec31.x * vec32.y - vec31.y * vec32.x;
};

vec3.prototype.produitScalaire = (vec31, vec32) =>
  vec31.x * vec32.x + vec31.y * vec32.y + vec31.z * vec32.z;

vec3.prototype.set = function (x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
};

vec3.prototype.egale = function (v) {
  this.x = v.x;
  this.y = v.y;
  this.z = v.z;
};

vec3.prototype.moins = function (v) {
  var resultat = new vec3();
  resultat.x = this.x - v.x;
  resultat.y = this.y - v.y;
  resultat.z = this.z - v.z;
  return resultat;
};

vec3.prototype.multiply = function (valeur) {
  this.x *= valeur;
  this.y *= valeur;
  this.z *= valeur;
};

vec3.prototype.addVector = function (vec3) {
  this.x += vec3.x;
  this.y += vec3.y;
  this.z += vec3.z;
};

vec3.prototype.distance = function (vec32) {
  return Math.sqrt(
    (vec32.y - this.y) * (vec32.y - this.y) +
      (vec32.x - this.x) * (vec32.x - this.x),
  );
};
