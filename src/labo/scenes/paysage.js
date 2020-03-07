import {
  SceneLampe as Scene,
  TexturePerlinNoise,
  Mat4,
  Spring,
  Target,
  PostProcess,
  Buffers,
} from '../../game';

const NAME_OBJ = 'paysage';
const NAME_PROG = 'paysage';

export default class extends Scene {
  constructor(gl, config, assets, width = 512, height = 512) {
    super(gl, config, assets, width, height);

    this.onMouseDrag = this.onMouseDrag.bind(this);
    this.onMouseWheel = this.onMouseWheel.bind(this);
    this.renderToBuffer = this.renderToBuffer.bind(this);

    this.texture = new TexturePerlinNoise(gl, 256, 256);
    this.model = new Mat4();
    this.model.identity();
    this.targetX = new Spring(0);
    this.targetY = new Spring(0);
    this.targetZ = new Target(1, 0.05);
    this.bloomProcess = new PostProcess(
      this.gl,
      ['blurDirection'],
      128,
      128,
      true,
    );
    this.buffers = new Buffers(this.gl, width, height);
  }

  update() {
    super.update();

    this.targetX.update();
    this.targetY.update();
    this.targetZ.update();
    // this.camera.setPosition(null, null, this.targetZ.get());
    this.model.identity();
    this.model.scale(this.targetZ.get());
    this.model.rotate(this.targetX.get(), 0, 1, 0);
    this.model.rotate(this.targetY.get(), 1, 0, 0);
    const normalmatrix = this.model.getMatrice3x3();
    normalmatrix.inverse();

    this.mngProg
      .get('buffers')
      .setMatrix('normalmatrix', normalmatrix.transpose());
    this.setLampeInfos(this.mngProg.get('diffuse'));

    this.buffers.render(
      this.renderToBuffer,
      this.camera,
      this.mngProg.get('buffers'),
      this.mngProg.get('albedo'),
      this.mngProg.get('diffuse'),
      this.getLampeDepthTexture(0).get(),
      this.getLampeViewMatrix(0).get(),
    );

    const currentProg = this.mngProg.get(NAME_PROG);
    currentProg.setVector('resolution', [
      this.containerSize.width,
      this.containerSize.height,
    ]);
    currentProg.setFloat('time', this.time);
    //  currentProg.setTexture(4, this.texture.get(), "displacementMap");
    currentProg.setTexture(2, this.getLampeDepthTexture(0).get(), 'shadowMap');
    currentProg.setTexture(3, this.buffers.getSsaoTexture().get(), 'ssaoMap');
    currentProg.setMatrix('normalmatrix', normalmatrix.transpose());
    currentProg.setMatrix('shadowview', this.getLampeViewMatrix(0).get());
    currentProg.setMatrix('model', this.model.get());
    this.setLampeInfos(currentProg);
  }

  effects() {
    // const delta = Math.sin(this.time * 0.1) * 100.0;
    this.postProcess.setBlur([4.0, 4.0]);
    const { width, height } = this.containerSize;
    const ppm = Math.sqrt(width * width + height * height) / this.camera.getAngle();
    this.postProcess.setDOF(this.camera.getNearFar(), 4.0, 6.0, ppm);
    this.bloomProcess.setBlurPass(0.5, 2);
    this.postProcess.setBloom(this.bloomProcess.getTexture(), 0.1, 2.0);
  }

  renderToBuffer(program) {
    program.setMatrix('model', this.model.get());
    this.mngObj.get(NAME_OBJ).render(program.get());
    // this.renderReperes();
  }

  renderBasiqueForShadow() {
    this.mngProg
      .get('basique3d')
      .setMatrix('projection', this.camera.getProjection().get());
    this.mngProg
      .get('basique3d')
      .setMatrix('view', this.getLampeViewMatrix(0).get());
    this.mngProg.get('basique3d').setMatrix('model', this.model.get());
    this.mngObj.get(NAME_OBJ).render(this.mngProg.get('basique3d').get());
  }

  render() {
    super.render();
    this.randomLampesPositions();

    this.bloomProcess.start();
    this.mngObj.get(NAME_OBJ).render(this.mngProg.get('emissive').get());
    this.bloomProcess.end();

    this.postProcess.start();
    this.mngObj.get(NAME_OBJ).render(this.mngProg.get(NAME_PROG).get());
    this.postProcess.end();
    this.effects();

    this.postProcess.compose(
      this.buffers.getAlbedoTexture().get(),
      this.buffers.getDiffuseTexture().get(),
      this.buffers.getSsaoTexture().get(),
      this.buffers.getDepthTexture().get(),
      this.buffers.getShadowTexture().get(),
    );
    this.postProcess.setGamma(1.2);
    this.postProcess.setFXAA();
    this.postProcess.render();

    // this.postProcess.render(this.getLampeDepthTexture(0).get());
    // this.postProcess.render(this.buffers.getShadowTexture().get());
  }

  onMouseDrag(mouse) {
    this.targetX.set(mouse.relPrevious.x * 0.1);
    this.targetY.set(mouse.relPrevious.y * 0.1);
  }

  onMouseWheel(mouse) {
    let target = this.camera.getPosition()[2] + mouse.deltaY * -0.04;
    target = Math.min(target, 2);
    target = Math.max(target, 1);
    this.targetZ.set(target);
  }
}
