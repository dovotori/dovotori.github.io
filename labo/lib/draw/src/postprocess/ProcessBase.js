import PingPongBuffer from './PingPongBuffer'
import Screen from '../gl/Screen'

export default class {
  constructor(gl, config = {}, programs = {}) {
    this.gl = gl
    const { width = 1024, height = 1024, useDepth = false } = config
    this.ppb = new PingPongBuffer(gl, width, height, useDepth)
    this.screen = new Screen(gl)
    this.passCount = 0
    this.programs = programs
    this.viewportSize = { width, height }
  }

  start() {
    this.ppb.start()
    this.passCount = 0
  }

  end() {
    this.ppb.end()
  }

  resize(box) {
    this.ppb.resize(box)
    this.viewportSize = box
  }

  applyTexToProg(program, tex = null) {
    const usePPBtex = tex === null
    this.passCount = usePPBtex ? this.passCount + 1 : 0
    /*
     * texture index ne peux pas etre 0 car 0 est utilisé
     * pour écrire la texture -> gl.COLOR_ATTACHMENT0
     */
    const textureIdx = this.passCount + 1
    const finalTexture = usePPBtex ? this.ppb.getTexture().get() : tex
    program.setTexture(textureIdx, finalTexture, 'textureMap')
    // const flipY = this.passCount % 2 === 0 ? -1.0 : 1.0;
    // program.setFloat('flipY', flipY);
    program.setFloat('flipY', -1.0)
    return program
  }

  setBrightContrast(bright, contrast, tex = null) {
    const program = this.applyTexToProg(this.programs.brightcontrast, tex)
    program.setFloat('brightness', bright)
    program.setFloat('contrast', contrast)
    this.renderToPingPong(program)
  }

  setFxaa(tex = null) {
    const program = this.applyTexToProg(this.programs.fxaa, tex)
    this.renderToPingPong(program)
  }

  setFxaa2(tex = null) {
    const program = this.applyTexToProg(this.programs.fxaa2, tex)
    this.renderToPingPong(program)
  }

  renderToPingPong(program) {
    this.ppb.swap()
    this.ppb.start()
    this.screen.render(program.get())
    this.ppb.end()
  }

  render(tex = null, isDebug = false) {
    const program = this.applyTexToProg(this.programs[isDebug ? 'debug' : 'screen'], tex)
    this.gl.viewport(0, 0, this.viewportSize.width, this.viewportSize.height)
    this.screen.render(program.get())
  }

  renderInverse(tex = null, isDebug = false) {
    const program = this.applyTexToProg(this.programs[isDebug ? 'debug' : 'screen'], tex)
    program.setFloat('flipY', 1.0)
    this.gl.viewport(0, 0, this.viewportSize.width, this.viewportSize.height)
    this.screen.render(program.get())
  }

  getTexture() {
    return this.ppb.getTexture()
  }
}
