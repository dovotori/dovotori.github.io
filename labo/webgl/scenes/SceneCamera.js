import Scene from "./Scene";
import Camera from "../cameras/CameraSmooth";

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);

    this.camera = new Camera(config.camera);

    this.camera.perspective(
      this.containerSize.width,
      this.containerSize.height
    );
  }

  resize(box) {
    super.resize(box);
    this.camera.perspective(
      this.containerSize.width,
      this.containerSize.height
    );
  }

  update() {
    super.update();
    this.camera.update();
    this.mngProg.setCameraMatrix(this.camera);
  }

  // getTestPoint() {
  //   return this.camera.get2dScreenPoint(
  //     this.lampe.getPositionVec3(),
  //     this.containerSize
  //   );
  // }
}
