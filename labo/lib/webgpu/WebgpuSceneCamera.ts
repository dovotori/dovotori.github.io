import Mat4 from "../utils/maths/Mat4";
import Camera from "../utils-3d/cameras/Camera";
import Objectif from "../utils-3d/cameras/Objectif";
import { BufferCamera, type CameraBuffers } from "./BufferCamera";
import WebgpuScene from "./WebgpuScene";

export default class WebgpuSceneCamera extends WebgpuScene {
  camera: Camera;
  model: Mat4;
  lampe: Objectif;

  constructor(context, config) {
    super(context, config);
    this.camera = new Camera(config.camera);
    this.model = new Mat4();
    this.model.identity();

    if (config.lampes && config.lampes.length > 0) {
      this.lampe = new Objectif(config.lampes[0]);
      this.lampe.lookAt();
    }
  }

  // should create one for each pipeline
  setupCamera(layout: GPUBindGroupLayout, withLight = false) {
    const device = this.context.getDevice();
    const bufferCamera = new BufferCamera();
    return bufferCamera.setup(device, layout, withLight);
  }

  setupLights(layout) {
    const device = this.context.getDevice();

    const size = Float32Array.BYTES_PER_ELEMENT * 8 * this.config.lampes.length; // vec3 * 2 + 1

    const buffer = device.createBuffer({
      label: "Light Storage Buffer",
      size,
      usage: window.GPUBufferUsage.STORAGE | window.GPUBufferUsage.COPY_DST,
    });

    // because it didnt update, we set it directly here
    const array = [];
    this.config.lampes.forEach((lampe) => {
      const t = [
        lampe.position.x,
        lampe.position.y,
        lampe.position.z,
        0, // pad
        ...lampe.ambiant,
        lampe.strength,
      ];
      array.push(...t);
    });

    const uniforms = new Float32Array(array);
    // direct setup
    device.queue.writeBuffer(buffer, 0, uniforms.buffer, uniforms.byteOffset, uniforms.byteLength);

    const bindGroup = device.createBindGroup({
      label: "LightsUniforms",
      layout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer,
          },
        },
      ],
    });

    return {
      buffer,
      bindGroup,
    };
  }

  updateCameraUniforms(cameraBuffers: CameraBuffers) {
    const device = this.context.getDevice();

    const projection = this.camera.getModeProjection().get();
    const view = this.camera.getView().get();

    const uniforms = new Float32Array(16 * 3 + 5); // projection(16) + view(16) + model(16) + camera position(3) + near + far
    uniforms.set(projection, 0);
    uniforms.set(view, 16);
    uniforms.set(this.model.get(), 32);
    uniforms.set(this.camera.getPosition(), 48);
    // store near/far after the camera position (padding occupies index 51)
    uniforms[52] = this.camera.getNear();
    uniforms[53] = this.camera.getFar();

    device.queue.writeBuffer(
      cameraBuffers.buffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength,
    );

    if (cameraBuffers.bufferLightProj && this.lampe) {
      const newMat = new Mat4().setFromArray(this.lampe.getView().get()); // need a new one, multiply lampe ortho will directly mutate the matrix
      const uniformsLightProj = new Float32Array(16);
      uniformsLightProj.set(newMat.multiply(this.lampe.getOrtho()).get(), 0);
      device.queue.writeBuffer(
        cameraBuffers.bufferLightProj,
        0, // offset
        uniformsLightProj.buffer,
        uniformsLightProj.byteOffset,
        uniformsLightProj.byteLength,
      );
    }
  }
}
