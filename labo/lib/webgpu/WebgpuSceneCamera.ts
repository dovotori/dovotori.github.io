import Mat4 from "../utils/maths/Mat4";
import Camera from "../utils-3d/cameras/Camera";
import { BufferCamera } from "./BufferCamera";
import WebgpuScene from "./WebgpuScene";

export default class WebgpuSceneCamera extends WebgpuScene {
  camera: Camera;
  model: Mat4;
  cameraBuffers: {
    buffer: GPUBuffer;
    bindGroup: GPUBindGroup;
    bufferLightProj?: GPUBuffer;
  };

  constructor(context, config) {
    super(context, config);
    this.camera = new Camera(config.camera);
    this.model = new Mat4();
    this.model.identity();
  }

  // should create one for each pipeline
  setupCamera(layout: GPUBindGroupLayout, withLight = false) {
    const device = this.context.getDevice();
    const bufferCamera = new BufferCamera();
    this.cameraBuffers = bufferCamera.setup(device, layout, withLight);
  }

  updateCameraUniforms() {
    const device = this.context.getDevice();

    const projection = this.camera.getModeProjection().get();
    const view = this.camera.getView().get();

    const uniforms = new Float32Array(16 * 3 + 3); // 16 elements for projection, 16 for view, 16 for model, 3 for camera position
    uniforms.set(projection, 0);
    uniforms.set(view, 16);
    uniforms.set(this.model.get(), 32);
    uniforms.set(this.camera.getPosition(), 48);

    device.queue.writeBuffer(
      this.cameraBuffers.buffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength,
    );
    // if (this.cameraBuffers.bufferLightProj) {
    //   const newMat = new Mat4().setFromArray(this.lampe.getView().get()); // need a new one, multiply lampe ortho will directly mutate the matrix
    //   const uniformsLightProj = new Float32Array(16);
    //   uniformsLightProj.set(newMat.multiply(this.lampe.getOrtho()).get(), 0);
    //   device.queue.writeBuffer(
    //     this.cameraBuffers.bufferLightProj,
    //     0, // offset
    //     uniformsLightProj.buffer,
    //     uniformsLightProj.byteOffset,
    //     uniformsLightProj.byteLength,
    //   );
    // }
  }
}
