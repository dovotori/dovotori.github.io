import DualQuaternion from '../lib/utils/maths/DualQuaternion';
import Mat4 from '../lib/utils/maths/Mat4';
import Quaternion from '../lib/utils/maths/Quaternion';
import Vec3 from '../lib/utils/maths/Vec3';
import Camera from '../lib/utils-3d/cameras/Camera';
import Objectif from '../lib/utils-3d/cameras/Objectif';
import { DebugTexture, GltfBindGroups, GltfPipeline } from '../lib/webgpu';
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

    // this.debugCube = new DebugPipeline(context);
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

    pass.end();

    device.queue.submit([encoder.finish()]);
  }

  resize(size) {
    this.canvasSize = size;
    this.gltfPipeline.resize(size);
  }

  headFollowMouse(x, y) {
    const ray = this.camera.getRayFromNDC(x, y);

    const headAbsMat = this.gltfPipeline.getNodeAbsoluteMatrix(31); // Head
    const headArr = headAbsMat.get();
    const headPos = new Vec3(headArr[12], headArr[13], headArr[14]);

    const t = (headPos.getY() - ray.origin.getY()) / ray.dir.getY();
    const target = new Vec3(
      ray.origin.getX() + ray.dir.getX() * t,
      headPos.getY(),
      ray.origin.getZ() + ray.dir.getZ() * t,
    );

    const headLocalMat = this.computeLocalRotationMatrixQuaternion(headAbsMat, target);
    this.gltfPipeline.setCustomTransform('Head', headLocalMat);
  }

  computeLocalRotationMatrixQuaternion(nodeAbsMat, target) {
    // head world position (column-major indices 12,13,14)
    const d = nodeAbsMat.get();
    const nodePos = new Vec3(d[12], d[13], d[14]);

    // direction from head to target (world space)
    const dir = new Vec3(target.getX(), target.getY(), target.getZ()).minus(nodePos).normalise();

    // model-forward in head local space (adjust if your model uses different axis)
    const forward = new Vec3(0, 0, 1);

    // build quaternion rotating forward -> dir (this is world-aligned rotation)
    const q = Quaternion.fromUnitVectors(forward, dir);

    // convert quaternion to rotation matrix
    const rotMat = q.toMatrix4();

    // rotMat is a pure rotation; keep translation zero for local override
    rotMat.setTranslation([0, 0, 0]);
    return rotMat;
  }

  onMouseMove = async (mouse) => {
    this.headFollowMouse(mouse.rel.x, mouse.rel.y);
  };

  onMouseClick = async (mouse) => {};
}
