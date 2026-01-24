import Mat4 from "../lib/utils/maths/Mat4";
import Camera from "../lib/utils-3d/cameras/Camera";
import { ComputeProcess } from "../lib/webgpu";
import { CubeTexture } from "../lib/webgpu/CubeTexture";
import { defaultColorAttachment, defaultDepthAttachment } from "../lib/webgpu/constants";
import PipelineTextures from "../lib/webgpu/PipelineTextures";
import { PostProcess } from "../lib/webgpu/PostProcess";
import { Skybox } from "../lib/webgpu/Skybox";
import WebgpuScene from "../lib/webgpu/WebgpuScene";
import { computeShader } from "./compute";

export default class Scene extends WebgpuScene {
  constructor(context, config) {
    super(context, config);

    const { width, height } = config.canvas;

    this.camera = new Camera(config.camera);
    this.camera.perspective(width, height);

    this.postProcess = new PostProcess(this.context);

    this.model = new Mat4();

    this.numParticules =
      this.config.particules.workgroupSize * this.config.particules.workgroupCount;

    this.textures = new PipelineTextures(1);
  }

  async setupAssets(assets) {
    const { programs } = await super.setupAssets(assets);

    const device = this.context.getDevice();

    this.textures.setup(device, this.context.getCanvasFormat(), this.canvasSize, "depth24plus");

    // POST PROCESS

    this.postProcess.setup(programs.postprocess.get());

    Object.keys(this.config.postprocess).forEach((key) => {
      const effect = this.config.postprocess[key];
      this.postProcess.addEffect(key, programs[effect.programName].get(), effect.params);
    });

    this.computeProcess = new ComputeProcess(
      device,
      computeShader(this.config.particules.workgroupSize),
      this.config.particules.workgroupCount,
    );

    /////////////////////////////////////////////

    const gltfPrimitive = Array.from(assets.gltfs.smoothSphere.get("meshes").get(0).primitives)[0];
    this.indexCount = gltfPrimitive.indexCount;

    // create vertex buffer
    this.vertexBuffer = device.createBuffer({
      label: "GPUBuffer store vertex",
      size: gltfPrimitive.bufferVertex.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.vertexBuffer, 0, gltfPrimitive.bufferVertex);
    this.indexBuffer = device.createBuffer({
      label: "GPUBuffer store index",
      size: gltfPrimitive.bufferIndex.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.indexBuffer, 0, gltfPrimitive.bufferIndex);

    const modelBuffer = device.createBuffer({
      label: "GPUBuffer store MAX model matrix",
      size: Float32Array.BYTES_PER_ELEMENT * 4 * 4 * this.numParticules, // mat4x4 x float32 x MAX
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const velocityBuffer = device.createBuffer({
      label: "GPUBuffer store MAX velocity",
      size: Float32Array.BYTES_PER_ELEMENT * 4 * this.numParticules, // 4 position x float32 x MAX
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const inputBuffer = device.createBuffer({
      label: "GPUBuffer store input vars",
      size: Float32Array.BYTES_PER_ELEMENT * 7, // float32 * 7
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    const uniformBufferSize = (4 + 4 * 4) * Float32Array.BYTES_PER_ELEMENT; // mat4 + vec4
    this.uniformBuffer = device.createBuffer({
      label: "uniforms",
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    this.uniformValues = new Float32Array(uniformBufferSize / 4);

    this.model.identity();

    /////////////////////////////////////////////
    //////////// CUBE TEXTURES //////////////////
    /////////////////////////////////////////////

    // const faceSize = 128;
    // const faceCanvases = [
    //   { faceColor: '#F00', textColor: '#0FF', text: '+X' },
    //   { faceColor: '#FF0', textColor: '#00F', text: '-X' },
    //   { faceColor: '#0F0', textColor: '#F0F', text: '+Y' },
    //   { faceColor: '#0FF', textColor: '#F00', text: '-Y' },
    //   { faceColor: '#00F', textColor: '#FF0', text: '+Z' },
    //   { faceColor: '#F0F', textColor: '#0F0', text: '-Z' },
    // ].map((faceInfo) => generateFace(faceSize, faceInfo));
    const faceCanvases = [
      assets.textures["pos-x"],
      assets.textures["neg-x"],
      assets.textures["pos-y"],
      assets.textures["neg-y"],
      assets.textures["pos-z"],
      assets.textures["neg-z"],
    ];

    const cubeTexture = new CubeTexture(this.context);
    cubeTexture.createTextureFromSources(device, faceCanvases, {
      // mips: true,
      flipY: false,
    });
    // cubeTexture.createOne(device, faceCanvases);

    /////////////////////////////////////////////
    //////////////// DATA ///////////////////////
    /////////////////////////////////////////////

    const inputArray = new Float32Array([this.numParticules, -500, 500, -500, 500, -500, 500]); // count, xmin/max, ymin/max, zmin/max
    const modelArray = new Float32Array(this.numParticules * 4 * Float32Array.BYTES_PER_ELEMENT);
    const velocityArray = new Float32Array(this.numParticules * Float32Array.BYTES_PER_ELEMENT);
    for (let i = 0; i < this.numParticules; i++) {
      const x = Math.random() * 1000 - 500;
      const y = Math.random() * 500 - 250;
      const z = Math.random() * 1000 - 500;

      const modelMatrix = new Mat4();
      modelMatrix.identity();
      modelMatrix.scale((this.config.particules.size / 2) * Math.random() + 10);
      modelMatrix.translate(x, y, z);
      modelArray.set(modelMatrix.get(), i * 4 * 4);

      velocityArray[i * 4 + 0] = (Math.random() - 0.5) * this.config.particules.speed; // x
      velocityArray[i * 4 + 1] = (Math.random() - 0.5) * this.config.particules.speed; // y
      velocityArray[i * 4 + 2] = (Math.random() - 0.5) * this.config.particules.speed; // z
      velocityArray[i * 4 + 3] = 1; // w
    }
    device.queue.writeBuffer(velocityBuffer, 0, velocityArray);
    device.queue.writeBuffer(modelBuffer, 0, modelArray);
    device.queue.writeBuffer(inputBuffer, 0, inputArray);

    /////////////////////////////////////////////
    ////////////// RENDER PIPELINE //////////////
    /////////////////////////////////////////////

    this.renderPipeline = await device.createRenderPipelineAsync({
      label: "Render Pipeline",
      layout: "auto",
      vertex: {
        module: programs.v_particule_3d.get(),
        entryPoint: "v_main",
        buffers: [
          {
            arrayStride: 8 * 4, // 3 position 2 uv,
            attributes: [
              {
                // position
                shaderLocation: 0,
                offset: 0,
                format: "float32x3",
              },
              {
                // normal
                shaderLocation: 1,
                offset: 3 * 4,
                format: "float32x3",
              },
              {
                // uv
                shaderLocation: 2,
                offset: 6 * 4,
                format: "float32x2",
              },
            ],
          },
        ],
      },
      fragment: {
        module: programs.f_particule_3d.get(),
        entryPoint: "f_main",
        // can define multiple targets textures, to get color / depth or normal texture of your scene
        targets: Array.from({
          length: this.postProcess.getRenderTargetsCount(),
        }).map(() => ({
          format: this.postProcess.getRenderTargetFormat(),
        })),
        // [{
        //   // format: this.context.getCanvasFormat(), // use when directly rendering to canvas context
        // }],
      },
      multisample: {
        count: this.textures.getSampleCount(),
      },
      primitive: {
        topology: "triangle-list",
        // Culling backfaces pointing away from the camera
        cullMode: "back",
      },
      // Enable depth testing since we have z-level positions
      // Fragment closest to the camera is rendered in front
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: this.textures.getDepthFormat(),
      },
    });

    // create a bindGroup for renderPass
    this.renderGroup = device.createBindGroup({
      label: "Group for renderPass",
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: modelBuffer,
          },
        },
        { binding: 1, resource: { buffer: this.uniformBuffer } },
        { binding: 2, resource: cubeTexture.getSampler(device) },
        { binding: 3, resource: cubeTexture.getView() },
      ],
    });

    // create bindGroup for computePass
    this.computeGroup = device.createBindGroup({
      label: "Group for computePass",
      layout: this.computeProcess.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: inputBuffer,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: velocityBuffer,
          },
        },
        {
          binding: 2,
          resource: {
            buffer: modelBuffer,
          },
        },
      ],
    });

    this.renderPassDescriptor = {
      // can define multiple targets textures, should match pipeline targets
      // clone `defaultColorAttachment` per-slot to avoid sharing the same object
      colorAttachments: Array.from({
        length: this.postProcess.getRenderTargetsCount(),
      }).map(() => ({ ...defaultColorAttachment })),
      // [
      //   {
      //     view: null,
      //     // resolveTarget: this.context.getCurrentTexture().createView(), // use for multisampling
      //     clearValue: { r: 0, g: 0, b: 0, a: 0 },
      //     loadOp: 'clear',
      //     storeOp: 'store',
      //   },
      // ],
      depthStencilAttachment: defaultDepthAttachment,
    };

    // SKYBOX
    this.skybox = new Skybox(this.context, this.textures.getSampleCount());
    this.skybox.setup(
      programs.skybox.get(),
      cubeTexture,
      Array.from({ length: this.postProcess.getRenderTargetsCount() }).map(() => ({
        format: this.postProcess.getRenderTargetFormat(),
      })),
      this.textures.getDepthFormat(),
    );
    this.resize(this.canvasSize);
  }

  resize(size) {
    this.canvasSize = size;
    const device = this.context.getDevice();

    this.textures.resize(device, this.context.getCanvasFormat(), size);
    this.postProcess.resize(device, this.canvasSize);
    this.postProcess.resizeEffects();
  }

  update() {
    super.update();
    const device = this.context.getDevice();

    this.model.identity();
    this.model.rotate(this.time, 0, 1, 0);
    this.model.multiply(this.camera.getViewProjection());

    const array = [...this.camera.getPosition(), 0, ...this.camera.getViewProjection().get()];
    this.uniformValues.set(array);
    device.queue.writeBuffer(this.uniformBuffer, 0, this.uniformValues);

    // update render pass descriptor texture views
    const canvasCurrentView = this.context.getCurrentTexture().createView();
    // const renderTargetView = this.textures.getRenderTargetView();
    // this.renderPassDescriptor.colorAttachments[0].resolveTarget = canvasCurrentView; // use for multisampling
    // this.renderPassDescriptor.colorAttachments[0].view = renderTargetView;

    Array.from({ length: this.postProcess.getRenderTargetsCount() }).forEach((_, i) => {
      this.renderPassDescriptor.colorAttachments[i].view = this.postProcess.getRenderTargetView(i);
    });

    const depthTextureView = this.textures.getDepthTextureView();
    this.renderPassDescriptor.depthStencilAttachment.view = depthTextureView;

    this.camera.moveAroundCenter(this.time * 0.01, this.config.camera.position.z);
    this.skybox.updateCamera(this.camera);

    this.postProcess.setFirstPassDestination();
    this.postProcess.updateEffectTextures(canvasCurrentView);
  }

  render() {
    super.render();

    const device = this.context.getDevice();

    const commandEncoder = device.createCommandEncoder({
      label: "Command Encoder for render and compute passes",
    });

    this.computeProcess.render(commandEncoder, [this.computeGroup]);

    // same render pass for skybox and model
    const renderPass = commandEncoder.beginRenderPass(this.renderPassDescriptor);

    renderPass.setPipeline(this.renderPipeline);
    renderPass.setVertexBuffer(0, this.vertexBuffer);
    renderPass.setIndexBuffer(this.indexBuffer, "uint16");
    renderPass.setBindGroup(0, this.renderGroup);
    renderPass.drawIndexed(this.indexCount, this.numParticules);

    renderPass.setPipeline(this.skybox.getPipeline());
    renderPass.setBindGroup(0, this.skybox.getBindGroup());
    renderPass.draw(3); // full screen triangle

    renderPass.end();

    this.postProcess.renderFirstPass(commandEncoder);
    this.postProcess.renderEffects(commandEncoder);

    device.queue.submit([commandEncoder.finish()]);
  }

  destroy() {
    super.destroy();
  }
}
