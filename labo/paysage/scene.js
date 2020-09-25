import Scene from '../lib/webgl/scenes/SceneLampe';
import Mat4 from '../lib/webgl/maths/Mat4';
import Spring from '../lib/webgl/maths/Spring';
import Target from '../lib/webgl/maths/Target';
import DualQuaternion from '../lib/webgl/maths/DualQuaternion';
import Gizmo from '../lib/webgl/meshes/Gizmo';
import Bloom from '../lib/webgl/postprocess/Bloom';
import { degToRad } from '../lib/webgl/utils/numbers';
import ObjetPrimitive from '../lib/webgl/gl/ObjetPrimitive';
import primitive from '../lib/webgl/primitives/plane';

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);

    this.config.MAIN_PROG = config.MAIN_PROG;
    this.config.MAIN_OBJ = config.MAIN_OBJ;

    this.model = new Mat4();
    this.model.identity();
    this.targetX = new Spring(0);
    this.targetY = new Spring(0);
    this.targetZ = new Target(0, 0.05);
    this.gizmo = new Gizmo(gl);
    this.bloom = new Bloom(gl, config.width, config.height, this.canUseDepth());

    this.objet = new ObjetPrimitive(this.gl);
    Object.keys(primitive).forEach((key) => {
      if (key === 'indice') {
        this.objet.setIndices(primitive.indice);
      } else {
        this.objet.setPoints(primitive[key], key);
      }
    });
    this.targetZ.set(1.2);
  }

  update(time) {
    super.update(time);

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

    this.mngGltf.get(this.config.MAIN_OBJ).update(time);
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
    model.translate(0, -1.0, 0);
    model.scale(7.1, 7.0, 6.0);
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
    target = Math.min(target, 1.2);
    target = Math.max(target, 0.8);
    this.targetZ.set(target);
  };
}
