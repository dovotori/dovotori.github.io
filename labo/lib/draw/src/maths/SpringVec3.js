import Vec3 from './Vec3'

export default class {
  constructor({ spring, friction }) {
    this.spring = spring
    this.friction = friction
    this.velocity = new Vec3()
  }

  update = (point, nextPoint) => {
    const vecPoint = new Vec3(...point)
    const tmp = new Vec3(...nextPoint).minus(vecPoint).multiplyNumber(this.spring)
    this.velocity.add(tmp).multiplyNumber(this.friction)
    return vecPoint.add(this.velocity).get()
  }
}
