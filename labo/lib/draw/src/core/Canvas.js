import Context from '../gl/Context'
import ContextGpu from '../webgpu/Context'

export default class {
  constructor(isWebGpu = false) {
    this.canvas = document.createElement('canvas')
    this.isWebGpu = isWebGpu
  }

  async setup() {
    if (this.isWebGpu) {
      this.context = new ContextGpu()
      await this.context.setup(this.canvas)
    } else {
      this.context = new Context(this.canvas)
    }
  }

  resize = (box) => {
    this.canvas.setAttribute('width', box.width)
    this.canvas.setAttribute('height', box.height)
  }

  get() {
    return this.canvas
  }

  getContext() {
    return this.context.get()
  }

  getSupport() {
    return this.context.getSupport()
  }
}
