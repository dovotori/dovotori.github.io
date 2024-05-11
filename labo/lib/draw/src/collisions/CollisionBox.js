import CollisionEndpoint from './CollisionEndpoint'

export default class {
  constructor() {
    this.min = Array(3)
    this.max = Array(3)
    this.id = 0
  }

  setup(id) {
    this.id = id
    for (let i = 0; i < 3; i += 1) {
      this.min[i] = new CollisionEndpoint()
      this.max[i] = new CollisionEndpoint()
      this.min[i].setup(true, this.id)
      this.max[i].setup(false, this.id)
    }
  }

  update(x, y, z, w, h, d = 0) {
    this.setMinMax(x, y, z, x + w, y + h, z + d)
  }

  setMinMax(minx, miny, minz, maxx, maxy, maxz) {
    this.min[0].set(minx)
    this.min[1].set(miny)
    this.min[2].set(minz)
    this.max[0].set(maxx)
    this.max[1].set(maxy)
    this.max[2].set(maxz)
  }

  getID() {
    return this.id
  }

  getMinMax(isMin, axe) {
    if (isMin) {
      return this.min[axe].get()
    }
    return this.max[axe].get()
  }

  getMin(axe) {
    return this.min[axe]
  }

  getMax(axe) {
    return this.max[axe]
  }
}
