import PingPongBuffer from './PingPongBuffer';
import Screen from '../gl/Screen';
import Program from '../gl/Program';
import screen from '../shaders/screen/screen';
import debug from '../shaders/screen/debug';

export default class {
  constructor(gl, width = 1024, height = 1024, useDepth = false) {
    this.gl = gl;
    this.ppb = new PingPongBuffer(gl, width, height, useDepth);
    this.screen = new Screen(gl);
    this.width = width;
    this.height = height;
    this.passCount = 0;
    this.programs = {
      screen: new Program(gl, screen),
      debug: new Program(gl, debug),
    };
  }

  start() {
    this.ppb.start();
    this.passCount = 0;
  }

  end() {
    this.ppb.end();
  }

  resize(box) {
    this.ppb.resize(box);
  }

  applyTexToProg(program, tex = null) {
    const usePPB = tex === null;
    this.passCount = usePPB ? this.passCount + 1 : 0;
    /*
     * texture index ne peux pas etre 0 car 0 est utilisé
     * pour écrire la texture -> gl.COLOR_ATTACHMENT0
     */
    const textureIdx = this.passCount + 1;
    const finalTexture = usePPB ? this.ppb.getTexture().get() : tex;
    program.setTexture(textureIdx, finalTexture, 'textureMap');

    const flipY = this.passCount > 0 ? -1.0 : 1.0;
    program.setFloat('flipY', flipY);
    return program;
  }

  renderToPingPong(program) {
    this.ppb.swap();
    this.ppb.start();
    this.screen.render(program.get());
    this.ppb.end();
  }

  render(tex = null, isDebug = false) {
    const program = this.applyTexToProg(this.programs[isDebug ? 'debug' : 'screen'], tex);
    this.screen.render(program.get());
  }

  getTexture() {
    return this.ppb.getTexture();
  }

  renderSimple(program) {
    program.setFloat('flipY', -1.0);
    this.screen.render(program.get());
  }
}
