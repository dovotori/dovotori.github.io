import PostProcess from './PostProcess';
import Fbo from '../gl/Fbo';
import Screen from '../gl/Screen';

export default class {
  constructor(gl, width = 1024, height = 1024, useDepth = false) {
    this.gl = gl;
    this.fboColorDepth = new Fbo(gl, width, height, useDepth);
    this.fboNormal = new Fbo(gl, width, height, useDepth);
    this.fboPosition = new Fbo(gl, width, height, useDepth);
    this.fboAlbedo = new Fbo(gl, width, height, useDepth);
    this.fboDiffuse = new Fbo(gl, width, height, useDepth);
    this.fboShadow = new Fbo(gl, width, height, useDepth);
    this.screen = new Screen(this.gl);
    this.postProcess = new PostProcess(this.gl, width, height, useDepth, ['ssao', 'blurDirection']);
    this.width = width;
    this.height = height;
  }

  render(renderScene, camera, program, programAlbedo, programDiffuse, lampeDepthTex, lampeMatrix) {
    this.fboColorDepth.start();
    program.setInt('type', 0);
    renderScene(program);
    this.fboColorDepth.end();

    this.fboNormal.start();
    program.setInt('type', 1);
    renderScene(program);
    this.fboNormal.end();

    this.fboPosition.start();
    program.setInt('type', 2);
    renderScene(program);
    this.fboPosition.end();

    this.fboShadow.start();
    program.setInt('type', 3);
    program.setTexture(0, lampeDepthTex, 'shadowMap');
    program.setMatrix('shadowview', lampeMatrix);
    program.setVector('resolution', [this.width, this.height]);
    renderScene(program);
    this.fboShadow.end();

    this.fboAlbedo.start();
    renderScene(programAlbedo);
    this.fboAlbedo.end();

    programDiffuse.setTexture(0, this.getNormalTexture().get(), 'normalMap');
    programDiffuse.setTexture(1, this.getDepthTexture().get(), 'depthMap');
    programDiffuse.setTexture(2, this.getPositionTexture().get(), 'positionMap');
    this.fboDiffuse.start();
    this.postProcess.renderSimple(programDiffuse);
    this.fboDiffuse.end();

    this.postProcess.start();
    renderScene(program); // pass inutile
    this.postProcess.end();
    this.postProcess.setSSAO(
      camera.getProjection(),
      camera.getView(),
      this.getPositionTexture().get(),
      this.getNormalTexture().get(),
      this.getDepthTexture().get(),
      0.02
    );
    this.postProcess.setBlurPass(0.02, 2);
  }

  getColorTexture() {
    return this.fboColorDepth.getTexture();
  }

  getDepthTexture() {
    return this.fboColorDepth.getDepthTexture();
  }

  getNormalTexture() {
    return this.fboNormal.getTexture();
  }

  getPositionTexture() {
    return this.fboPosition.getTexture();
  }

  getAlbedoTexture() {
    return this.fboAlbedo.getTexture();
  }

  getDiffuseTexture() {
    return this.fboDiffuse.getTexture();
  }

  getSsaoTexture() {
    return this.postProcess.getTexture();
  }

  getShadowTexture() {
    return this.fboShadow.getTexture();
  }
}
