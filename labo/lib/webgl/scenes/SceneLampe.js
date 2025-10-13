import Scene from "./SceneCamera";
import Lampe from "../gl/Lampe";

export default class extends Scene {
  constructor(gl, config) {
    super(gl, config);

    const useDepth = this.canUseDepth();
    const { width, height } = config.canvas;
    this.lampes =
      (config.lampes &&
        config.lampes.map(
          (lampe) => new Lampe(gl, lampe, width, height, useDepth),
        )) ||
      [];
  }

  async setupAssets(assets) {
    await super.setupAssets(assets);
    const programs = this.mngProg.getAll();
    Object.keys(programs).forEach((progKey) => {
      const program = programs[progKey];
      if (program.getLocations().numLights) {
        this.setLampeInfos(program);
      }
    });
  }

  renderReperes() {
    this.lampes.forEach((lampe) => lampe.renderRepere(this.camera));
  }

  randomLampesPositions(speed = 1.0, index = null) {
    this.lampes.forEach((lampe, i) => {
      if (index === null || (index !== null && i === index)) {
        lampe.move(this.time * speed, i);
      }
    });
  }

  setLampeInfos(program) {
    program.setVector("posEye", this.camera.getPosition());
    program.setInt("numLights", this.lampes.length);
    this.config.lampes.forEach((lampeConfig, i) => {
      const {
        type,
        ambiant,
        diffuse,
        specular,
        brillance,
        radius,
        direction,
        strength,
      } = lampeConfig;

      program.setInt(`lights[${i}].type`, type);
      program.setVector(`lights[${i}].position`, this.lampes[i].getPosition());
      program.setVector(`lights[${i}].ambiant`, ambiant);
      program.setVector(`lights[${i}].diffuse`, diffuse);
      program.setVector(`lights[${i}].specular`, specular);
      if (brillance) {
        program.setFloat(`lights[${i}].brillance`, brillance);
      }
      if (radius) {
        program.setFloat(`lights[${i}].radius`, radius);
      }
      if (direction) {
        program.setVector(`lights[${i}].direction`, direction);
      }
      program.setFloat(`lights[${i}].strength`, strength || 1);
    });
  }

  render() {
    super.render();
    if (typeof this.renderBasiqueForLampeDepth === "function") {
      this.renderBasiqueForLampeDepth();
    }
    this.mngProg.setCameraMatrix(this.camera, !!this.config.camera.ortho);
  }

  getLampe(i) {
    if (this.lampes[i]) {
      return this.lampes[i];
    }
    return null;
  }

  resize(box) {
    super.resize(box);
    this.lampes.forEach((lampe) => lampe.resize(box));
  }

  // getTestPoint() {
  //   return this.camera.get2dScreenPoint(
  //     this.lampe.getPositionVec3(),
  //     this.screenSize
  //   );
  // }
}
