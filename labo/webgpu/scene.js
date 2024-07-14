import {
  Program,
  BufferTransform,
  PipelineTextures,
  GltfPipeline,
  GltfBindGroups,
} from "../lib/draw/src/webgpu";
import Camera from "../lib/draw/src/cameras/Camera";
import Mat4 from "../lib/draw/src/maths/Mat4";
import DualQuaternion from "../lib/draw/src/maths/DualQuaternion";

class Scene {
  constructor(context, config) {
    this.context = context;
    this.config = config;
    this.time = 0;
    const { width, height } = this.config.canvas;
    this.camera = new Camera(config.camera);
    this.camera.perspective(width, height);
    this.textures = new PipelineTextures();
    this.canvasSize = { width, height };

    this.model = new Mat4();
    this.model.identity();

    this.gltfPipeline = new GltfPipeline(context, config);
  }

  setup() {}

  // should create one for each pipeline
  setupCamera(layout) {
    const device = this.context.getDevice();
    // for camera
    const size = Float32Array.BYTES_PER_ELEMENT * (16 * 3 + 4); // 4x4 matrix view + projection + model + vec3

    const buffer = device.createBuffer({
      size,
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
    });

    const bindGroup = device.createBindGroup({
      label: "CameraUniforms",
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

  setupLights(layout) {
    const device = this.context.getDevice();

    const size = Float32Array.BYTES_PER_ELEMENT * 8 * this.config.lampes.length; // vec3 * 2 + 1

    const buffer = device.createBuffer({
      size,
      usage: window.GPUBufferUsage.STORAGE | window.GPUBufferUsage.COPY_DST,
    });

    // because it didnt update, we set it directly here
    const array = [];
    this.config.lampes.forEach((lampe) => {
      array.push(lampe.position.x, lampe.position.x, lampe.position.z);
      array.push(...lampe.ambiant);
      array.push(lampe.strength);
    });

    const uniforms = new Float32Array(array);
    // direct setup
    device.queue.writeBuffer(
      buffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength
    );

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

  async setupAssets(assets) {
    const device = this.context.getDevice();

    const programs = Object.keys(assets.shaders).reduce((acc, cur) => {
      const shader = new Program();
      shader.setup(device, cur, assets.shaders[cur]);
      acc[cur] = shader;
      return acc;
    }, {});

    const firstGltfName = Object.keys(assets.gltfs)[0];
    const gltf = assets.gltfs[firstGltfName];

    console.log({
      assets,
      config: this.config,
      gltf,
    });

    await this.gltfPipeline.setup(gltf, {
      vertex: programs.v_gltf.get(),
      fragment: programs.f_gltf.get(),
    });

    this.uniformCamera = this.setupCamera(
      this.gltfPipeline.getBindGroupLayout(GltfBindGroups.CAMERA)
    );

    this.uniformLights = this.setupLights(
      this.gltfPipeline.getBindGroupLayout(GltfBindGroups.LIGHT)
    );

    this.textures.setup(
      device,
      this.context.getCanvasFormat(),
      this.canvasSize
    );

    // this.picking = new Picking(
    //   this.context,
    //   this.drawModelForPicking,
    //   this.uniformCameraBindGroup,
    //   this.uniformCameraBuffer
    // );
    // await this.picking.setup(programs, this.canvasSize, [
    //   firstBuffer.getLayout(),
    // ]);
  }

  update(time) {
    // const view = this.camera.getView()
    // view.push()
    // view.rotate(time * 0.01, 0, 1, 0)
    // view.pop()

    this.model.identity();
    const quat = new DualQuaternion();
    quat.rotateY(time * 0.0005);
    // quat.rotateX(time * 0.001)
    this.model.multiply(quat.toMatrix4());

    this.gltfPipeline.updateAnimations(time);
  }

  // renderPicking() {
  //   this.picking.pick(this.camera, this.model, 0, 0);
  // }

  updateCameraUniforms(cameraBindBuffer) {
    const device = this.context.getDevice();

    const projection = this.camera.getProjection().get();
    const view = this.camera.getView().get();
    const uniforms = new Float32Array(
      projection.concat(view, this.model.get(), this.camera.getPosition())
    );
    device.queue.writeBuffer(
      cameraBindBuffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength
    );
  }

  render() {
    const device = this.context.getDevice();

    this.updateCameraUniforms(this.uniformCamera.buffer);

    this.gltfPipeline.update(
      this.context.getCurrentTexture().createView(),
      this.textures.getRenderTargetView(),
      this.textures.getDepthTextureView()
    );
    // this.pipeline.update(this.context.getCurrentTexture().createView())
    const encoder = device.createCommandEncoder();
    const pass = encoder.beginRenderPass(
      this.gltfPipeline.getRenderPassDescriptor()
    );

    // After devide.getEncodeur().beginRenderPass()

    pass.setPipeline(this.gltfPipeline.get());
    pass.setBindGroup(GltfBindGroups.CAMERA, this.uniformCamera.bindGroup);
    pass.setBindGroup(GltfBindGroups.LIGHT, this.uniformLights.bindGroup);

    this.gltfPipeline.drawModel(device, pass);

    // before pass.end()
    pass.end();

    // const commandBuffer = this.devide.getEncodeur().finish()
    // device.queue.submit([commandBuffer])
    // Finish the command buffer and immediately submit it.
    device.queue.submit([encoder.finish()]);
  }

  resize(size) {
    this.canvasSize = size;
    this.textures.setup(
      this.context.getDevice(),
      this.context.getCanvasFormat(),
      size
    );
  }

  onMouseClick = async (e) => {
    await this.picking.pick(e.pos.x, e.pos.y);
  };
}

export default Scene;
