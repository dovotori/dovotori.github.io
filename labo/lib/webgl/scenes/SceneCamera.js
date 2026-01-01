import Camera from "../../utils-3d/cameras/CameraSmooth";
import Scene from "./Scene";

export default class extends Scene {
  constructor(gl, config) {
    super(gl, config);

    this.camera = new Camera(config.camera);
    this.camera.perspective(this.containerSize.width, this.containerSize.height);
  }

  resize(box) {
    super.resize(box);
    this.camera.perspective(this.containerSize.width, this.containerSize.height);
  }

  update(time) {
    super.update(time);
    this.camera.update();
    this.mngProg.setCameraMatrix(this.camera, !!this.config.camera.ortho);
  }

  // getTestPoint() {
  //   return this.camera.get2dScreenPoint(
  //     this.lampe.getPositionVec3(),
  //     this.containerSize
  //   );
  // }
}
