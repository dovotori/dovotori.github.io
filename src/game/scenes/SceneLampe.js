import Scene from "./SceneCamera";
import Lampe from "../gl/Lampe";

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);

    this.lampes = [];
    for (let i = 0; i < this.config.lampes.length; i += 1) {
      this.lampes[i] = new Lampe(
        this.gl,
        this.config.lampes[i],
        config.canvas.width,
        config.canvas.height
      );
    }
  }

  renderReperes() {
    for (let i = 0; i < this.config.lampes.length; i += 1) {
      this.lampes[i].renderRepere(this.camera);
    }
  }

  randomLampesPositions(speed = 1.0, index = null) {
    for (let i = 0; i < this.config.lampes.length; i += 1) {
      if (index === null || (index !== null && i === index)) {
        this.lampes[i].move(this.time * speed, i);
      }
    }
  }

  setLampeInfos(program) {
    program.setVector("posEye", this.camera.getPosition());
    program.setInt("numLights", this.config.lampes.length);
    for (let i = 0; i < this.config.lampes.length; i += 1) {
      const {
        type,
        ambiant,
        diffuse,
        specular,
        brillance,
        radius,
        direction,
        strength,
      } = this.config.lampes[i];
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
    }
  }

  computeLampesDepthTexture() {
    // for (let i = 0; i < this.config.lampes.length; i += 1) {
    if (typeof this.renderBasiqueForShadow === "function") {
      for (let i = 0; i < 1; i += 1) {
        this.lampes[i].start();
        this.renderBasiqueForShadow();
        this.lampes[i].end();
      }
    }
  }

  getLampeDepthTexture(i) {
    return this.lampes[i].getDepthTexture();
  }

  getLampeViewMatrix(i) {
    return this.lampes[i].getView();
  }

  getLampeModelMatrix(i) {
    return this.lampes[i].getModel();
  }

  render() {
    super.render();
    this.computeLampesDepthTexture();
  }

  // getTestPoint() {
  //   return this.camera.get2dScreenPoint(
  //     this.lampe.getPositionVec3(),
  //     this.screenSize
  //   );
  // }
}
