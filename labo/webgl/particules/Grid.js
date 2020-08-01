import { mapFromRange } from '../utils/numbers';
import Attractor from './Attractor';
import Node from './Node';

export default class {
  constructor(nbRows = 3, nbColumns) {
    this.nbRows = nbRows;
    this.nbColumns = nbColumns || nbRows;
    this.nodes = new Array(this.nbRows * this.nbColumns)
      .fill()
      .map((_) => new Node({ withRebond: true, withSlowDown: false }));
    this.attractor = new Attractor();
    this.attractor.setPosition(0, 0, 0);
    this.placeNodes();
  }

  update = () => {
    this.attractor.update();
    this.nodes.forEach((node) => {
      this.attractor.attract(node);
      node.update();
    });
  };

  placeNodes = () => {
    let cpt = 0;
    for (let y = 0; y < this.nbColumns; y++) {
      for (let x = 0; x < this.nbRows; x++) {
        const posX = mapFromRange(x, 0, this.nbRows - 1, -1, 1);
        const posY = mapFromRange(y, 0, this.nbColumns - 1, -1, 1);
        this.nodes[cpt].setPosition(posX, posY, 0);
        cpt++;
      }
    }
  };

  getPositions() {
    return this.nodes.reduce((acc, node) => [...node.getPosition().get(), ...acc], []);
  }
}
