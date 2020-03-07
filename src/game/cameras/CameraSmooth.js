import Camera from './CameraCoordinatesConversion';
import { Target } from '../geometry';

export default class extends Camera {
  constructor(options) {
    super(options);
    this.options = options;
    this.rotationX = new Target();
    this.targetX = new Target();
    this.zoomZ = new Target(0.7, 0.1);
  }

  update() {
    super.update();
    this.rotationX.update();
    this.zoomZ.update();
    this.targetX.update();

    this.position.set(
      this.options.position.x
        + this.targetX.get()
        + Math.sin(this.rotationX.get())
          * (this.options.position.z * this.zoomZ.get()),
      this.options.position.y,
      Math.cos(this.rotationX.get())
        * (this.options.position.z * this.zoomZ.get()),
    );

    this.target.set(
      this.options.target.x, // + this.targetX.get(),
      this.options.target.y,
      this.options.target.z,
    );
  }

  setSmoothTarget(value) {
    this.targetX.set(value);
  }

  setSmoothRotation(value) {
    this.rotationX.set(value);
  }

  setSmoothZoom(value) {
    this.zoomZ.set(value);
  }

  getZoom() {
    return this.zoomZ.get();
  }

  followPos2D(x, y) {
    this.options.position.x = x;
    this.options.position.y = y;
    this.options.target.x = x;
    this.options.target.y = y;
  }

  followPosY(y) {
    this.options.position.y = y;
    this.options.target.y = y;
  }
}
