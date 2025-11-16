import DualQuaternion from '../lib/utils/maths/DualQuaternion';
import Mat4 from '../lib/utils/maths/Mat4';
import Quaternion from '../lib/utils/maths/Quaternion';
import Vec3 from '../lib/utils/maths/Vec3';
import Camera from '../lib/utils-3d/cameras/Camera';
import Objectif from '../lib/utils-3d/cameras/Objectif';
import { DebugPipeline, DebugTexture, GltfBindGroups, GltfPipeline } from '../lib/webgpu';
import { BufferCamera } from '../lib/webgpu/BufferCamera';
import WebgpuScene from '../lib/webgpu/WebgpuScene';

export default class Scene extends WebgpuScene {
  constructor(context, config) {
    super(context, config);
    this.time = 0;
    const { width, height } = config.canvas;
    this.camera = new Camera(config.camera);
    this.camera.perspective(width, height);

    this.canvasSize = { width, height };

    this.model = new Mat4();
    this.model.identity();

    this.gltfPipeline = new GltfPipeline(context, config);
    this.debug = new DebugTexture(context);

    this.lampe = new Objectif(config.lampes[0]);
    this.lampe.lookAt();

    this.debugCube = new DebugPipeline(context);
  }

  setupCamera(layout, withLight) {
    const device = this.context.getDevice();
    const bufferCamera = new BufferCamera();
    return bufferCamera.setup(device, layout, withLight);
  }

  setupLights(layout) {
    const device = this.context.getDevice();

    const size = Float32Array.BYTES_PER_ELEMENT * 8 * this.config.lampes.length; // vec3 * 2 + 1

    const buffer = device.createBuffer({
      label: 'Light Storage Buffer',
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
      label: 'LightsUniforms',
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

  async setupAssets(assets) {
    const { programs } = await super.setupAssets(assets);

    const firstGltfName = Object.keys(assets.gltfs)[0];
    const gltf = assets.gltfs[firstGltfName];

    console.log({
      assets,
      config: this.config,
      gltf,
    });

    const program = {
      vertex: programs.v_gltf_rig.get(),
      fragment: programs.f_gltf_rig.get(),
    };

    await this.gltfPipeline.setup(gltf, program, this.canvasSize);
    this.uniformCamera = this.setupCamera(
      this.gltfPipeline.getBindGroupLayout(GltfBindGroups.CAMERA),
    );

    this.uniformLights = this.setupLights(
      this.gltfPipeline.getBindGroupLayout(GltfBindGroups.LIGHT),
    );

    await this.debugCube.setup({
      vertex: programs.v_model_camera.get(),
      fragment: programs.f_simple.get(),
    });
    this.debugUniformCamera = this.setupCamera(
      this.debugCube.getBindGroupLayout(GltfBindGroups.CAMERA),
    );
  }

  update(time) {
    // const view = this.camera.getView()
    // view.push()
    // view.rotate(time * 0.01, 0, 1, 0)
    // view.pop()

    this.model.identity();
    const quat = new DualQuaternion();
    quat.rotateY(time * 0.0001);
    // quat.rotateX(time * 0.001);
    // this.model.multiply(quat.toMatrix4());

    this.gltfPipeline.updateAnimations(time);
  }

  updateCameraUniforms(cameraBuffer, lightProjBuffer) {
    const device = this.context.getDevice();

    const projection = this.camera.getModeProjection().get();
    const view = this.camera.getView().get();

    const uniforms = new Float32Array(16 * 3 + 3); // 16 elements for projection, 16 for view, 16 for model, 3 for camera position
    uniforms.set(projection, 0);
    uniforms.set(view, 16);
    uniforms.set(this.model.get(), 32);
    uniforms.set(this.camera.getPosition(), 48);

    device.queue.writeBuffer(
      cameraBuffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength,
    );
    if (lightProjBuffer) {
      const newMat = new Mat4().setFromArray(this.lampe.getView().get()); // need a new one, multiply lampe ortho will directly mutate the matrix
      const uniformsLightProj = new Float32Array(16);
      uniformsLightProj.set(newMat.multiply(this.lampe.getOrtho()).get(), 0);
      device.queue.writeBuffer(
        lightProjBuffer,
        0, // offset
        uniformsLightProj.buffer,
        uniformsLightProj.byteOffset,
        uniformsLightProj.byteLength,
      );
    }
  }

  render() {
    const device = this.context.getDevice();

    this.gltfPipeline.update();

    this.updateCameraUniforms(this.uniformCamera.buffer, this.uniformCamera.bufferLightProj);

    const encoder = device.createCommandEncoder({
      label: 'GltfCommandEncoder',
    });
    const pass = encoder.beginRenderPass(this.gltfPipeline.getRenderPassDescriptor());

    pass.setPipeline(this.gltfPipeline.get());
    pass.setBindGroup(GltfBindGroups.CAMERA, this.uniformCamera.bindGroup);
    pass.setBindGroup(GltfBindGroups.LIGHT, this.uniformLights.bindGroup);

    this.gltfPipeline.drawModel(device, pass);

    this.updateCameraUniforms(this.debugUniformCamera.buffer);
    this.debugCube.render(pass, this.debugUniformCamera.bindGroup);

    pass.end();

    device.queue.submit([encoder.finish()]);
  }

  resize(size) {
    this.canvasSize = size;
    this.gltfPipeline.resize(size);
  }

  headFollowMouse(x, y) {
    const ray = this.camera.getRayFromNDC(x, y);

    const stableDist = 10.0;

    const target = new Vec3(
      ray.origin.getX() + ray.dir.getX() * stableDist,
      ray.origin.getY() + ray.dir.getY() * stableDist,
      ray.origin.getZ() + ray.dir.getZ() * stableDist,
    );

    const headNodeId = 31; // Head
    const headAbsMat = this.gltfPipeline.getNodeAbsoluteMatrix(headNodeId);
    const headArr = headAbsMat.get();
    const headPos = new Vec3(headArr[12], headArr[13] + 4, headArr[14]); // +4 to adjust to center of head to the eyes

    // v1 = target - head
    const v1 = new Vec3(target.getX(), target.getY(), target.getZ()).minus(headPos);
    if (v1.length() === 0) return { angleRad: 0, angleDeg: 0, sign: 0 };
    v1.normalise();

    // v2 = camera - head
    const camArr = this.camera.getPosition();
    const camPos = new Vec3(camArr[0], camArr[1], camArr[2]);
    const v2 = camPos.minus(headPos);
    if (v2.length() === 0) return { angleRad: 0, angleDeg: 0, sign: 0 };
    v2.normalise();

    const dot = Math.max(-1, Math.min(1, v1.dot(v2)));
    const cross = v1.cross(v2);

    const yawRad = Math.atan2(cross.getY(), dot); // signed radians (-PI..PI)
    let yawDeg = yawRad * (180 / Math.PI);
    yawDeg = Math.max(-40, Math.min(40, yawDeg)); // clamp

    const pitchRad = Math.atan2(cross.getX(), dot);
    let pitchDeg = pitchRad * (180 / Math.PI);
    pitchDeg = Math.max(-20, Math.min(7, pitchDeg)); // clamp pitch

    const headLocalMat = this.computeLocalRotationMatrixQuaternion(yawDeg, pitchDeg);

    this.gltfPipeline.setCustomTransform('Head', headLocalMat);

    this.debugCube.setTransform(target.getX(), target.getY(), target.getZ());
  }

  computeLocalRotationMatrixQuaternion(yawDeg = 0, pitchDeg = 0) {
    const rot = new Mat4().identity();
    rot.rotate(yawDeg, 0, 1, 0); // yaw around Y (degrees)
    rot.rotate(pitchDeg, 1, 0, 0); // pitch around X (degrees)
    rot.setTranslation([0, 0, 0]); // ensure pure rotation
    return rot;
  }

  onMouseMove = async (mouse) => {
    this.headFollowMouse(mouse.rel.x, mouse.rel.y);
  };

  onMouseClick = async (mouse) => {};
}
