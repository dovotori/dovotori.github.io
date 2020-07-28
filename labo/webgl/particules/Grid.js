import Attractor from './Attractor';

export default class {
  constructor() {
    this.nbNodes = 30;
    this.distanceInterval = 10;
    this.nodes = new Array(this.nbNodes * this.nbNodes);
    this.attractor = new Attractor();
  }

  setup = (width, height) => {
    this.reset();
    this.attractor.setPosition(0, 0, 0);
    Node.setBox(0, 0, 0, width, height, 1000);
  };

  update = () => {
    this.attractor.update();
    for (let i = 0; i < this.nbNodes * this.nbNodes; i++) {
      this.attractor.attract(this.nodes[i]);
      this.nodes[i].update(false, false, true);
    }
  };

  reset = () => {
    let cpt = 0;
    for (let y = 0; y < this.nbNodes; y++) {
      for (let x = 0; x < this.nbNodes; x++) {
        const posX = x * this.distanceInterval;
        const posY = y * this.distanceInterval;
        this.nodes[cpt] = null;
        this.nodes[cpt] = new Node();
        this.nodes[cpt].setPosition(posX, posY, 0);
        cpt++;
      }
    }
  };
}
