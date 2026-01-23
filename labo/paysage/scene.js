import Mat4 from "../lib/utils/maths/Mat4";
import { MouseInteraction } from "../lib/utils-3d/input/MouseInteraction";
import primitive from "../lib/utils-3d/primitives/plane";
import Primitive from "../lib/webgl/gl/Primitive";
import Buffers from "../lib/webgl/postprocess/Buffers";
import Scene from "../lib/webgl/scenes/SceneLampe";

export default class extends Scene {
  constructor(gl, config) {
    super(gl, config);

    this.config.MAIN_PROG = config.MAIN_PROG;
    this.config.MAIN_OBJ = config.MAIN_OBJ;

    this.model = new Mat4();
    this.model.identity();

    this.interaction = new MouseInteraction();

    this.fakeShadow = new Primitive(gl, primitive);

    this.buffers = new Buffers(this.gl, config.width, config.height, this.canUseDepth());
  }

  update(time) {
    super.update(time);

    this.interaction.update();

    this.model.identity();
    this.model.scale(this.interaction.getTargetZ().get());
    this.model.multiply(this.interaction.getRotation(time));

    const program = this.mngProg.get(this.config.MAIN_PROG);

    // pour faire disparaite les objet qui sorte de la scene
    const invModel = new Mat4();
    invModel.equal(this.camera.getView()).multiply(this.model).inverse();
    program.setMatrix("inverseModel", invModel.get());

    this.mngGltf.get(this.config.MAIN_OBJ).update(time);
  }

  mainRender = (program) => {
    this.renderFakeShadow(this.mngProg.get("color"));
    this.mngGltf.get(this.config.MAIN_OBJ).render(program, this.model);
  };

  renderBasiqueForLampeDepth = () => {
    const lampe = this.getLampe(0);
    const program = this.mngProg.get("basique3d");
    lampe.setDepthProgram(program);
    lampe.start();
    this.mainRender(program);
    lampe.end();
  };

  render() {
    super.render();
    /*
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
      */
    this.mainRender(this.mngProg.get(this.config.MAIN_PROG));
    // }
  }

  renderFakeShadow(program) {
    const model = new Mat4();
    model.identity();
    model.rotate(-90, 1, 0, 0);
    model.translate(0.2, -7, 0);
    model.scale(8.1, 1.0, 6.0);
    model.multiply(this.model);
    program.setMatrix("model", model.get());
    program.setVector("color", [0, 0, 0, 0.9]);
    this.fakeShadow.render(program.get());
  }

  onMouseDrag = (mouse) => {
    this.interaction.onMouseDrag(mouse);
  };

  onMouseWheel = (mouse) => {
    this.interaction.onMouseWheel(mouse);
  };
}
