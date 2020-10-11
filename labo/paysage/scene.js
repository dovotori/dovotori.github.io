import Scene from '../lib/webgl/scenes/SceneLampe';
import Mat4 from '../lib/webgl/maths/Mat4';
import Spring from '../lib/webgl/maths/Spring';
import Target from '../lib/webgl/maths/Target';
import DualQuaternion from '../lib/webgl/maths/DualQuaternion';
import { degToRad } from '../lib/webgl/utils/numbers';
import ObjetPrimitive from '../lib/webgl/gl/ObjetPrimitive';
import Buffers from '../lib/webgl/postprocess/Buffers';
import primitive from '../lib/webgl/primitives/plane';

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);

    this.config.MAIN_PROG = config.MAIN_PROG;
    this.config.MAIN_OBJ = config.MAIN_OBJ;

    this.model = new Mat4();
    this.model.identity();
    this.targetX = new Spring(0);
    this.targetZ = new Target(0, 0.05);

    this.fakeShadow = new ObjetPrimitive(this.gl);
    Object.keys(primitive).forEach((key) => {
      if (key === 'indice') {
        this.fakeShadow.setIndices(primitive.indice);
      } else {
        this.fakeShadow.setPoints(primitive[key], key);
      }
    });
    this.targetZ.set(1.2);

    this.buffers = new Buffers(this.gl, config.width, config.height, this.canUseDepth());
  }

  update(time) {
    super.update(time);

    this.targetX.update();
    this.targetZ.update();

    this.model.identity();
    this.model.scale(this.targetZ.get());

    const angle = degToRad(this.targetX.get()) + time * 0.0001;
    const quat = new DualQuaternion();
    quat.rotateY(-angle);
    this.model.multiply(quat.toMatrix4());

    const program = this.mngProg.get(this.config.MAIN_PROG);

    // pour faire disparaite les objet qui sorte de la scene
    const invModel = new Mat4();
    invModel.equal(this.camera.getView()).multiply(this.model).inverse();
    program.setMatrix('inverseModel', invModel.get());

    this.mngGltf.get(this.config.MAIN_OBJ).update(time);
  }

  mainRender = (program) => {
    // this.gizmo.render(this.camera, this.model);
    this.mngGltf.get(this.config.MAIN_OBJ).render(program, this.model);
  };

  renderBasiqueForShadow = (program) => {
    this.mainRender(program);
  };

  render() {
    super.render();

    if (this.canUseDepth()) {
      const progBuffers = this.mngProg.get('buffers');
      this.buffers.generateTextures(this.mainRender, progBuffers);
      this.ssao.compute(this.buffers.getDepthTexture().get());
      const lampe = this.getLampe(0);
      this.shadow.start(lampe);
      this.mainRender(this.shadow.getProgram());
      this.shadow.end();
      this.shadow.setBrightContrast(0.0, 4.0);
      this.shadow.setBlur();

      this.postProcess.start();
      this.renderFakeShadow();
      this.mainRender(this.mngProg.get(this.config.MAIN_PROG));
      this.postProcess.end();

      this.postProcess.setCompose(
        this.ssao.getTexture().get(),
        this.shadow.getTexture().get(),
        this.buffers.getDepthTexture().get()
      );
      this.postProcess.setFxaa2();
      this.postProcess.render();
    } else {
      this.mainRender(this.mngProg.get(this.config.MAIN_PROG));
    }
  }

  renderFakeShadow() {
    const program = this.mngProg.get('color');
    const model = new Mat4();
    model.identity();
    model.rotate(-90, 1, 0, 0);
    model.translate(0, -1.0, 0);
    model.scale(7.1, 7.0, 6.0);
    model.multiply(this.model);
    program.setMatrix('model', model.get());
    program.setVector('color', [0.0, 0.0, 0.0, 0.4]);
    this.fakeShadow.enable(program.get(), 'position', 3);
    this.fakeShadow.render();
  }

  onMouseDrag = (mouse) => {
    this.targetX.set(mouse.relPrevious.x * 0.1);
  };

  onMouseWheel = (mouse) => {
    let target = -mouse.deltaY;
    target = Math.min(target, 1.2);
    target = Math.max(target, 0.8);
    this.targetZ.set(target);
  };
}
