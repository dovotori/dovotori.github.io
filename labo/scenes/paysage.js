import Scene from '../webgl/scenes/SceneLampe';
import Mat4 from '../webgl/maths/Mat4';
import Spring from '../webgl/maths/Spring';
import Target from '../webgl/maths/Target';
import DualQuaternion from '../webgl/maths/DualQuaternion';
import Gizmo from '../webgl/meshes/Gizmo';
import Bloom from '../webgl/postprocess/Bloom';
import { degToRad } from '../webgl/utils/numbers';
import ObjetPrimitive from '../webgl/gl/ObjetPrimitive';
import primitive from '../webgl/primitives/plane';

export default class extends Scene {
  constructor(gl, config, assets, width = 512, height = 512) {
    super(gl, config, assets, width, height);

    this.config.MAIN_PROG = config.MAIN_PROG;
    this.config.MAIN_OBJ = config.MAIN_OBJ;

    this.model = new Mat4();
    this.model.identity();
    this.targetX = new Spring(0);
    this.targetY = new Spring(0);
    this.targetZ = new Target(1, 0.05);
    this.gizmo = new Gizmo(gl);
    this.bloom = new Bloom(gl, width, height, this.canUseDepth());

    this.objet = new ObjetPrimitive(this.gl);
    Object.keys(primitive).forEach((key) => {
      if (key === 'indice') {
        this.objet.setIndices(primitive.indice);
      } else {
        this.objet.setPoints(primitive[key], key);
      }
    });
  }

  update() {
    super.update();

    this.targetX.update();
    this.targetY.update();
    this.targetZ.update();

    this.model.identity();
    this.model.scale(this.targetZ.get());

    const angle = degToRad(this.targetX.get());
    // const angle2 = degToRad(this.targetY.get());

    const quat = new DualQuaternion();
    quat.rotateY(-angle);
    // quat.rotateX(-angle2);
    this.model.multiply(quat.toMatrix4());

    const program = this.mngProg.get(this.config.MAIN_PROG);
    program.setVector('resolution', [this.containerSize.width, this.containerSize.height]);
    if (this.canUseDepth()) {
      program.setTexture(2, this.getLampeDepthTexture(0).get(), 'shadowMap');
    }
    program.setMatrix('shadowview', this.getLampeViewMatrix(0).get());
    const invModel = new Mat4();
    invModel.equal(this.camera.getView());
    invModel.multiply(this.model);
    invModel.inverse();
    program.setMatrix('inverseModel', invModel.get());
    this.setLampeInfos(program);
  }

  mainRender(program) {
    this.renderFakeShadow();

    // this.gizmo.render(this.camera, this.model);
    this.mngGltf.get(this.config.MAIN_OBJ).render(program, this.model);
  }

  renderToBuffer = (program) => {
    this.mainRender(program);
  };

  renderBasiqueForShadow() {
    const program = this.mngProg.get('basique3d');
    program.setMatrix('projection', this.camera.getProjection().get());
    program.setMatrix('view', this.getLampeViewMatrix(0).get());
    program.setMatrix('model', this.model.get());
    this.renderToBuffer(program);
  }

  render() {
    super.render();

    // const program = this.mngProg.get('bone');
    // program.setMatrix('projection', this.camera.getProjection().get());
    // program.setMatrix('view', this.camera.getView().get());
    // this.mngGltf.get(this.config.MAIN_OBJ).setBoneProgram(program);

    if (this.config.support.useDepth) {
      this.postProcess.start();
      this.mainRender(this.mngProg.get(this.config.MAIN_PROG));
      this.postProcess.end();
      this.effects();
      this.postProcess.render();
    } else {
      this.mainRender(this.mngProg.get(this.config.MAIN_PROG));
    }

    // DEBUG
    // this.postProcess.render(this.bloom.getTexture().get());
  }

  renderFakeShadow() {
    const program = this.mngProg.get('color');
    program.setMatrix('projection', this.camera.getProjection().get());
    program.setMatrix('view', this.camera.getView().get());

    const model = new Mat4();
    model.identity();
    model.rotate(-90, 1, 0, 0);
    model.translate(0, -0.8, 0);
    model.scale(1.1, 1, 0.8);
    model.multiply(this.model);
    program.setMatrix('model', model.get());
    program.setVector('color', [0.0, 0.0, 0.0, 0.4]);
    this.objet.enable(program.get(), 'position', 3);
    this.objet.render();
  }

  onMouseDrag = (mouse) => {
    this.targetX.set(mouse.relPrevious.x * 0.1);
    this.targetY.set(mouse.relPrevious.y * 0.1);
  };

  onMouseWheel = (mouse) => {
    let target = -mouse.deltaY;
    target = Math.min(target, 2);
    target = Math.max(target, 1);
    this.targetZ.set(target);
  };
}
