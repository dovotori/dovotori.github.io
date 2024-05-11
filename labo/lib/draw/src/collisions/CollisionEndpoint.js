export default class {
  constructor() {
    this.value = null
    this.isMin = false
    this.ownerId = null
  }

  setup(isMin, id) {
    this.isMin = isMin
    this.ownerId = id // box owner id
  }

  set(v) {
    this.value = v
  }

  get() {
    return this.value
  }

  getID() {
    return this.ownerId
  }

  isMinimum() {
    return this.isMin
  }
}
