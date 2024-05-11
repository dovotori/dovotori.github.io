import Camera from './Camera'
import Vec4 from '../maths/Vec4'
import Mat4 from '../maths/Mat4'

export default class extends Camera {
  get2dTexturePoint(point) {
    const x = point.getX()
    const y = point.getY()
    const z = point.getZ()
    const p = new Vec4(x, y, z, 1)
    const mat = new Mat4()
    mat.equal(this.view).multiply(this.projection)
    p.multiplyMatrix(mat)
    let X = p.getX() / p.getW()
    let Y = p.getY() / p.getW()
    X = (X + 1) * 0.5
    Y = (Y + 1) * 0.5
    return [X, Y]
  }

  get2dScreenPoint(point, screenSize) {
    const pos = this.get2dTexturePoint(point)
    return [pos[0] * screenSize.width, pos[1] * screenSize.height]
  }
}
