import Scene from './SceneCamera';
import Lampe from '../gl/Lampe';

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);
    this.lampes = [];

    const useDepth = this.canUseDepth();
    this.lampes =
      config.lampes &&
      config.lampes.map(
        (lampe) => new Lampe(this.gl, lampe, config.canvas.width, config.canvas.height, useDepth)
      );
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
    program.setVector('posEye', this.camera.getPosition());
    program.setInt('numLights', this.lampes.length);
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

  computeLampesDepthTexture() {
    // for (let i = 0; i < this.config.lampes.length; i += 1) {
    if (typeof this.renderBasiqueForShadow === 'function') {
      for (let i = 0; i < 1; i += 1) {
        this.lampes[i].start();
        this.renderBasiqueForShadow();
        this.lampes[i].end();
      }
    }
  }

  getLampeDepthTexture(i) {
    if (this.canUseDepth()) {
      return this.lampes[i].getDepthTexture();
    }
    return null;
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
