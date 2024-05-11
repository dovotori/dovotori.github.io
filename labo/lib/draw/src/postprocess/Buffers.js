import Fbo from '../gl/Fbo'
// import PingPongBuffer from './PingPongBuffer';

export default class {
  constructor(gl, width = 1024, height = 1024, useDepth = false) {
    this.gl = gl
    this.fboColorDepth = new Fbo(gl, width, height, useDepth)
    this.fboNormal = new Fbo(gl, width, height, useDepth)
    this.fboPosition = new Fbo(gl, width, height, useDepth)
    // this.ppbShadow = new PingPongBuffer(gl, width, height, useDepth);
    // this.fboShadow = new Fbo(gl, width, height, useDepth);
    this.width = width
    this.height = height
  }

  generateTextures(renderScene, program) {
    program.setInt('type', 0)
    this.fboColorDepth.start()
    renderScene(program)
    this.fboColorDepth.end()

    program.setInt('type', 1)
    this.fboNormal.start()
    renderScene(program)
    this.fboNormal.end()

    program.setInt('type', 2)
    this.fboPosition.start()
    renderScene(program)
    this.fboPosition.end()
  }

  // generateShadow(renderScene, program, lampe) {
  //   program.setInt('type', 3);
  //   program.setTexture(3, lampe.getDepthTexture().get(), 'shadowMap');
  //   program.setMatrix('shadowView', lampe.getView().get());
  //   program.setMatrix('shadowProjection', lampe.getOrtho().get());
  //   this.ppbShadow.start();
  //   renderScene(program);
  //   this.ppbShadow.end();
  // }

  getColorTexture() {
    return this.fboColorDepth.getTexture()
  }

  getDepthTexture() {
    return this.fboColorDepth.getDepthTexture()
  }

  getNormalTexture() {
    return this.fboNormal.getTexture()
  }

  getPositionTexture() {
    return this.fboPosition.getTexture()
  }

  // getShadowTexture() {
  //   return this.ppbShadow.getTexture();
  // }
}
