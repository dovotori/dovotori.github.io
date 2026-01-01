import SpringVec3 from "../../utils/maths/SpringVec3";
import Vec3 from "../../utils/maths/Vec3";
import Primitive from "../../webgl/gl/Primitive";

import {
  getIndices,
  getPoints,
  getSide,
  getTexture,
  lineShaderWithAdjacents,
} from "../primitives/line";

export default class {
  constructor(gl, count, { spring, friction }) {
    const points = getPoints(count);
    const { position, next, previous } = lineShaderWithAdjacents(points);
    const indices = getIndices(count);
    const side = getSide(count);
    const texture = getTexture(count);
    const primitive = { position, next, previous, indices, side, texture };
    this.vbo = new Primitive(gl, primitive, true);
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
    this.vbo.update(primitive);
  }

  render(program) {
    this.vbo.render(program);
  }

  init = (pos) => {
    this.points.fill(pos);
  };
}
