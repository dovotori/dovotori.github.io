import {
  Program,
  Pipeline,
  BufferGltf,
  BufferMaterial,
  BufferTransform,
  Textures,
} from "../lib/draw/src/webgpu";
import Camera from "../lib/draw/src/cameras/Camera";
import Mat4 from "../lib/draw/src/maths/Mat4";
import DualQuaternion from "../lib/draw/src/maths/DualQuaternion";
import Animation from "../lib/draw/src/maths/Animation";

class Scene {
  constructor(context, config) {
    this.context = context;
    this.config = config;
    this.time = 0;
    const { width, height } = this.config.canvas;
    this.camera = new Camera(config.camera);
    this.camera.perspective(width, height);
    this.textures = new Textures();

    this.model = new Mat4();
    this.model.identity();
  }

  setup() {}

  async setupAssets(assets) {
    const device = this.context.getDevice();

    const programs = Object.keys(assets.shaders).reduce((acc, cur) => {
      const shader = new Program();
      shader.setup(device, cur, assets.shaders[cur]);
      acc[cur] = shader;
      return acc;
    }, {});

    const { width, height } = this.config.canvas;
    const format = this.context.getCanvasFormat();

    const firstGltfName = Object.keys(assets.gltfs)[0];
    const gltf = assets.gltfs[firstGltfName];

    const meshes = gltf.get("meshes");
    const pipeLineData = gltf.get("pipeline");
    const materials = gltf.get("materials");
    const nodes = gltf.get("nodes");

    console.log({
      assets,
      config: this.config,
      gltf,
    });

    this.buffers = new Set();
    this.matrixBuffersMaps = new Map();
    this.materialIndexes = new Map();

    const meshBuffersMaps = new Map();
    for (const [key, mesh] of meshes) {
      let meshBuffers = [];
      for (let primitive of mesh.primitives) {
        // attributes.length // 2 position/ normale // 3 position/normale/texture
        const buffer = new BufferGltf();
        buffer.setup(device, primitive);
        this.buffers.add(buffer);
        this.materialIndexes.set(buffer, primitive.material);
        meshBuffers.push(buffer);
      }
      meshBuffersMaps.set(key, meshBuffers);
    }

    const [firstBuffer] = this.buffers;

    this.pipeline = new Pipeline();
    await this.pipeline.setup(
      device,
      programs.v_gltf.get(),
      programs.f_gltf.get(),
      pipeLineData,
      [firstBuffer.getLayout()], // we used the first layout because its fit all the mesh
      format
    );
    this.textures.setup(device, format, this.pipeline.getDepthTextureFormat(), {
      width,
      height,
    });
    this.pipeline.setupRenderPassDescriptor();

    const layoutCamera = this.pipeline.get().getBindGroupLayout(0);
    const layoutTransform = this.pipeline.get().getBindGroupLayout(1);
    const layoutMaterial = this.pipeline.get().getBindGroupLayout(2);
    const layoutLights = this.pipeline.get().getBindGroupLayout(3);

    // for camera
    const uniformCameraBufferSize =
      Float32Array.BYTES_PER_ELEMENT * (16 * 3 + 4); // 4x4 matrix view + projection + model + vec3
    this.uniformCameraBuffer = device.createBuffer({
      size: uniformCameraBufferSize,
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
    });

    this.uniformCameraBindGroup = device.createBindGroup({
      label: "bind group uniforms",
      layout: layoutCamera,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.uniformCameraBuffer,
          },
        },
      ],
    });

    // for lights
    const uniformLightsBufferSize =
      Float32Array.BYTES_PER_ELEMENT * 8 * this.config.lampes.length; // vec3 * 2 + 1
    const uniformLightsBuffer = device.createBuffer({
      size: uniformLightsBufferSize,
      usage: window.GPUBufferUsage.STORAGE | window.GPUBufferUsage.COPY_DST,
    });

    const array = [];
    this.config.lampes.forEach((lampe) => {
      array.push(lampe.position.x, lampe.position.x, lampe.position.z);
      array.push(...lampe.ambiant);
      array.push(lampe.strength);
    });

    const uniforms = new Float32Array(array);

    this.uniformLightsBindGroup = device.createBindGroup({
      label: "bind group uniforms",
      layout: layoutLights,
      entries: [
        {
          binding: 0,
          resource: {
            buffer: uniformLightsBuffer,
          },
        },
      ],
    });
    device.queue.writeBuffer(
      uniformLightsBuffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength
    );

    // animations
    this.animations = new Animation(gltf.get("animations"), nodes);

    // for material
    this.materialBuffer = new BufferMaterial();
    this.materialBuffer.setup(device, materials, layoutMaterial);

    this.nodes = new Map();
    for (const [key, node] of nodes) {
      const meshId = node.mesh;
      if (meshId === undefined) continue;
      const buffers = meshBuffersMaps.get(meshId);
      const matrix = BufferTransform.getNodeMatrix(node);
      this.nodes.set(key, {
        name: node.name,
        buffers,
        matrix,
        transformBindGroup: !this.animations.isNodeHasAnimation(key)
          ? BufferTransform.setup(device, matrix, layoutTransform)
          : undefined,
      });
    }
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

    if (this.animations) {
      this.animations.update(time);
    }
  }

  render() {
    const device = this.context.getDevice();
    const encoder = device.createCommandEncoder();
    const layoutTransform = this.pipeline.get().getBindGroupLayout(1);

    // camera update
    const projection = this.camera.getProjection().get();
    const view = this.camera.getView().get();
    const uniforms = new Float32Array(
      projection.concat(view, this.model.get(), this.camera.getPosition())
    );
    device.queue.writeBuffer(
      this.uniformCameraBuffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength
    );

    this.pipeline.update(
      this.context.getCurrentTexture().createView(),
      this.textures.getRenderTargetView(),
      this.textures.getDepthTextureView()
    );
    // this.pipeline.update(this.context.getCurrentTexture().createView())
    const pass = encoder.beginRenderPass(
      this.pipeline.getRenderPassDescriptor()
    );

    // After devide.getEncodeur().beginRenderPass()

    pass.setPipeline(this.pipeline.get());
    pass.setBindGroup(0, this.uniformCameraBindGroup);
    pass.setBindGroup(3, this.uniformLightsBindGroup);

    // should sort primitives by material
    for (const [key, node] of this.nodes) {
      node.buffers.forEach((buffer) => {
        let transformBindGroup = node.transformBindGroup;
        if (!transformBindGroup) {
          // animations
          const finalMatrix = this.animations.handleLocalTransform(key);
          // const matrix = node.matrix;
          // const finalMatrix = new Mat4();
          // finalMatrix.setRaw(matrix.get());
          // finalMatrix.translate(2, 0, 0);
          transformBindGroup = BufferTransform.setup(
            device,
            finalMatrix,
            layoutTransform
          );
        }

        pass.setBindGroup(1, transformBindGroup);
        pass.setBindGroup(
          2,
          this.materialBuffer.getBindGroup(
            this.materialIndexes.get(buffer) || 0
          )
        );
        pass.setVertexBuffer(0, buffer.getVertexBuffer());
        pass.setIndexBuffer(buffer.getIndexBuffer(), "uint16");
        pass.drawIndexed(buffer.getIndexCount());
      });
    }

    // before pass.end()
    pass.end();

    // const commandBuffer = this.devide.getEncodeur().finish()
    // device.queue.submit([commandBuffer])
    // Finish the command buffer and immediately submit it.
    device.queue.submit([encoder.finish()]);
  }

  resize(size) {
    this.textures.setup(
      this.context.getDevice(),
      this.context.getCanvasFormat(),
      this.pipeline.getDepthTextureFormat(),
      size
    );
  }
}

export default Scene;
