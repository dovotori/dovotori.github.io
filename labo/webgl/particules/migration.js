import Bird from './Bird';

export default class {
  constructor() {
    this.oiseaux = [];
    this.nbOiseaux = 10;
    this.cpt = 0;
    this.setup();
  }

  setup = () => {
    for (let i = 0; i < this.nbOiseaux; i++) {
      this.oiseaux[i] = new Bird();
      this.oiseaux[i].setup(200, 200, 200);
    }
  };

  draw = () => {
    for (let i = 0; i < this.nbOiseaux; i++) {
      this.oiseaux[i].updateTroupeau(this.oiseaux);
      // this.oiseaux[i].draw();
      this.oiseaux[i].respawnBordures(400, 400, 400);
    }
  };

  getOiseaux = () => {
    return this.oiseaux;
  };

  setNbOiseaux = (valeur) => {
    this.nbOiseaux = valeur;
  };
}
