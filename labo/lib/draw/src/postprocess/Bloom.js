import Blur from './Blur'

export default class extends Blur {
  constructor(gl, config, programs = {}) {
    super(gl, config, programs)
    this.scale = config.scale !== undefined ? config.scale : 1.0
    this.threshold = config.threshold !== undefined ? config.threshold : 0.1
  }

  end() {
    super.end()
    this.process()
  }

  process(tex = null) {
    const program = this.applyTexToProg(this.programs.bloom, tex)
    program.setFloat('scale', this.scale)
    program.setFloat('threshold', this.threshold)
    this.renderToPingPong(program)
    this.setBlur()
  }

  setNbPass = (value) => {
    this.blurNbPass = value
  }
}
