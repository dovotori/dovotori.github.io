import Mesh from './Mesh';
import Mat3 from '../maths/Mat3';

export default class extends Mesh {
  constructor() {
    super();
    this.normalMatrix = new Mat3();
  }

  setNormalMatrix(program) {
    this.normalMatrix.equal(this.model.getMatrice3x3());
    this.normalMatrix.inverse();
    normalmatrix.transpose();
    program.setMatrix('normalmatrix', this.normalMatrix.get());
  }
}
