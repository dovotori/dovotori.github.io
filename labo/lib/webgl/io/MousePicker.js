import { mapFromRange } from '../utils/numbers';
import Vec4 from '../maths/Vec4';
import Mat4 from '../maths/Mat4';

export default class {
  constructor() {
    this.rayon = new Vec4(0, 0, 0, 0);
  }

  get(mousePos, camera) {
    const relX = mapFromRange(mousePos.clientX, 0, window.innerWidth, -1, 1);
    const relY = mapFromRange(mousePos.clientY, 0, window.innerHeight, 1, -1);
    this.rayon.set(relX, relY, -1.0, 1.0); // -1 en z pour pointer "devant"

    const proj = new Mat4();
    proj.equal(camera.getProjection()).inverse();
    this.rayon.equal(this.rayon.multiplyMatrix(proj)).set(this.rayon.x, this.rayon.y, -1.0, 0.0);

    const view = new Mat4();
    view.equal(camera.getView()).inverse();
    this.rayon.equal(this.rayon.multiplyMatrix(view)).normalise();
    return this.rayon;
  }
}
