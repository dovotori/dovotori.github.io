import Primitive from './Primitive';
import SpringVec3 from '../maths/SpringVec3';
import Vec3 from '../maths/Vec3';

import {
  getSide,
  getIndices,
  getTexture,
  getPoints,
  lineShaderWithAdjacents,
} from '../primitives/line';

export default class extends Primitive {
  constructor(gl, count, { spring, friction }) {
    const points = getPoints(count);
    const { position, next, previous } = lineShaderWithAdjacents(points);
    const indice = getIndices(count);
    const side = getSide(count);
    const texture = getTexture(count);
    const primitive = { position, next, previous, indice, side, texture };
    super(gl, primitive, true);
    this.spring = new SpringVec3({ spring, friction });
    this.points = points;
  }

  update(mousePos) {
    this.points = this.points.map((point, index) => {
      let newPos = point;
      if (index === 0) {
        newPos = this.spring.update(point, [mousePos.x, mousePos.y, 0]);
      } else {
        newPos = this.points[index - 1];
      }
      const vec = Vec3.lerp(new Vec3(...point), new Vec3(...newPos), index === 0 ? 0.9999 : 0.8);
      return vec.get();
    });
    const primitive = lineShaderWithAdjacents(this.points);
    super.update(primitive);
  }

  render(program) {
    this.objet.enable(program, 'next', 3);
    this.objet.enable(program, 'previous', 3);
    this.objet.enable(program, 'side', 1);
    super.render(program);
  }

  init = (pos) => {
    this.points.fill(pos);
  };
}
