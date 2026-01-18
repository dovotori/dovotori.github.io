import { mapFromRange } from "../lib/utils/numbers";
import { ComputeProcess, PipelineTextures, PostProcess } from "../lib/webgpu";
import WebgpuSceneCamera from "../lib/webgpu/WebgpuSceneCamera";
import { computeShader } from "./compute";

const MASS_FACTOR = 0.0001;
const RECOVER_RATE = 0.6; // lerp rate per frame (tune to taste) - closest to 0 faster to regroup
const REPULSE_FACTOR = 0.005;

export default class Scene extends WebgpuSceneCamera {
  constructor(context, config) {
    super(context, config);

    const { width, height } = config.canvas;
    this.canvasSize = { width, height };

    this.camera.perspective(width, height);

    this.sampleCount = 1; // because we use post process (4 if not)

    this.textures = new PipelineTextures(1);

    this.downTimestamp = 0;
    this.mousePressed = false;
  }

  async setupAssets(assets) {
    const { programs } = await super.setupAssets(assets);

    const device = this.context.getDevice();

    this.textures.setup(device, this.context.getCanvasFormat(), this.canvasSize, "depth24plus");

    this.postProcess = new PostProcess(this.context);
    this.postProcess.setup(programs.postprocess.get());

    Object.keys(this.config.postprocess).forEach((key) => {
      const effect = this.config.postprocess[key];
      this.postProcess.addEffect(key, programs[effect.programName].get(), effect.params);
    });

    this.particulesCount =
      this.config.particules.workgroupSize * this.config.particules.workgroupCount;

    const positionArrayStride = Float32Array.BYTES_PER_ELEMENT * 4;
    this.positionBuffer = device.createBuffer({
      size: positionArrayStride * this.particulesCount, // 16 * NUM_PARTICLES
      label: "particules position buffer",
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
    });
    const positionBufferData = new Float32Array(this.particulesCount * 4);
    for (let i = 0; i < positionBufferData.length; i += 4) {
      positionBufferData[i] = Math.random() * 2 - 1;
      positionBufferData[i + 1] = Math.random() * 2 - 1;
      positionBufferData[i + 2] = Math.random() * 2 - 1;
      positionBufferData[i + 3] = 1;
    }
    device.queue.writeBuffer(this.positionBuffer, 0, positionBufferData);

    const velocityArrayStride = Float32Array.BYTES_PER_ELEMENT * 4;
    this.velocityBuffer = device.createBuffer({
      size: velocityArrayStride * this.particulesCount, // 16 * NUM_PARTICLES
      label: "particules velocity buffer",
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
    });
    const velocityBufferData = new Float32Array(this.particulesCount * 4);
    for (let i = 0; i < velocityBufferData.length; i += 4) {
      velocityBufferData[i] = Math.random() * 0.002 - 0.001;
      velocityBufferData[i + 1] = Math.random() * 0.002 - 0.001;
      velocityBufferData[i + 2] = Math.random() * 0.002 - 0.001;
      velocityBufferData[i + 3] = 0;
    }
    device.queue.writeBuffer(this.velocityBuffer, 0, velocityBufferData);

    this.computeProcess = new ComputeProcess(
      device,
      computeShader(this.config.particules.workgroupSize),
      this.config.particules.workgroupCount,
    );

    // Attractors points + factors
    // -1 to 1 (0,0) center of the screen
    this.massData = new Float32Array([
      0,
      0,
      0, // Mass position
      MASS_FACTOR, // Mass factor
      0, // 0 attraction / 1 repel
    ]);

    this.computeUniformBuffer = device.createBuffer({
      // Ensure the uniform buffer meets minBindingSize (commonly 32 bytes).
      size: Math.max(this.massData.byteLength, 32),
      label: "attractors compute uniform buffer",
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(this.computeUniformBuffer, 0, this.massData);

    this.computeBindGroup = device.createBindGroup({
      layout: this.computeProcess.getBindGroupLayout(0),
      label: "Compute Bind Group",
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.positionBuffer,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: this.velocityBuffer,
          },
        },
        {
          binding: 2,
          resource: {
            buffer: this.computeUniformBuffer,
          },
        },
      ],
    });

    /////////////////////////////////////////////
    ////////////// RENDER PIPELINE //////////////
    /////////////////////////////////////////////

    this.screenPointCount = 4; // 4 points to draw a screen quad
    this.vertexBuffer = device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * this.screenPointCount * 2, // 2 floats per point (x, y)
      label: "screen quad vertex buffer",
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(
      this.vertexBuffer,
      0,
      // 4 2d points to draw a screen squad with triangle strip
      new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0]),
    );

    const colorArrayStride = Uint8Array.BYTES_PER_ELEMENT * 4; // 4 bytes per color component
    this.colorBuffer = device.createBuffer({
      size: colorArrayStride * this.particulesCount,
      label: "particules color buffer",
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    const colorBufferData = new Uint8Array(4 * this.particulesCount);
    for (let i = 0; i < colorBufferData.length; i += 4) {
      colorBufferData[i] = 0;
      colorBufferData[i + 1] = Math.floor(Math.random() * 256);
      colorBufferData[i + 2] = Math.floor(Math.random() * 256);
      colorBufferData[i + 3] = 128;
    }
    device.queue.writeBuffer(this.colorBuffer, 0, colorBufferData);

    const targetsFromPostProcess = Array.from({
      length: this.postProcess.getRenderTargetsCount(),
    }).map(() => ({
      format: this.postProcess.getRenderTargetFormat(),
      blend: {
        color: {
          srcFactor: "one",
          dstFactor: "one-minus-src-alpha",
        },
        alpha: {
          srcFactor: "one",
          dstFactor: "one-minus-src-alpha",
        },
      },
    }));

    const uniformBindGroupLayout = device.createBindGroupLayout({
      label: "Uniforms Bind Group Layout",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: "uniform",
            hasDynamicOffset: false,
          },
        },
      ],
    });

    const cameraUniformBindGroupLayout = device.createBindGroupLayout({
      label: "Camera Uniforms Bind Group Layout",
      entries: [
        {
          binding: 0,
          visibility: GPUShaderStage.VERTEX,
          buffer: {
            type: "uniform",
            hasDynamicOffset: false,
            // minBindingSize: 208,
          },
        },
      ],
    });

    const bindGroupLayouts = [uniformBindGroupLayout, cameraUniformBindGroupLayout];

    const pipelineLayout = device.createPipelineLayout({
      label: "Pipeline layout",
      bindGroupLayouts,
    });

    this.renderPipeline = await device.createRenderPipelineAsync({
      label: "Particule Render Pipeline",
      layout: pipelineLayout,
      vertex: {
        module: programs.v_particule.get(),
        entryPoint: "v_main",
        buffers: [
          {
            // vertexPosition
            arrayStride: 8,
            attributes: [
              {
                shaderLocation: 0,
                format: "float32x2",
                offset: 0,
              },
            ],
          },
          {
            // particules color
            arrayStride: colorArrayStride,
            stepMode: "instance",
            attributes: [
              {
                shaderLocation: 1,
                format: "unorm8x4",
                offset: 0,
              },
            ],
          },
          {
            // particules position
            arrayStride: positionArrayStride,
            stepMode: "instance",
            attributes: [
              {
                shaderLocation: 2,
                format: "float32x4",
                offset: 0,
              },
            ],
          },
        ],
      },
      fragment: {
        module: programs.f_particule.get(),
        entryPoint: "f_main",
        // targets: [
        //   {
        //     format: this.context.getCanvasFormat(),
        //     blend: {
        //       color: {
        //         srcFactor: "one",
        //         dstFactor: "one-minus-src-alpha",
        //       },
        //       alpha: {
        //         srcFactor: "one",
        //         dstFactor: "one-minus-src-alpha",
        //       },
        //     },
        //   },
        // ],
        targets: targetsFromPostProcess,
      },
      multisample: {
        count: this.sampleCount,
      },
      primitive: {
        topology: "triangle-strip",
        stripIndexFormat: "uint32",
      },
      // Enable depth testing since we have z-level positions
      // Fragment closest to the camera is rendered in front
      depthStencil: {
        format: this.textures.getDepthFormat(),
        depthWriteEnabled: true,
        depthCompare: "less",
      },
    });

    this.cameraBuffers = this.setupCamera(this.renderPipeline.getBindGroupLayout(0));

    // Rendering uniform buffer
    this.vertexUniformBuffer = device.createBuffer({
      size: 16, // Float32Array.BYTES_PER_ELEMENT * 3 but need to align to 16 bytes
      label: "vertex uniform buffer",
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.vertexUniformBindGroup = device.createBindGroup({
      layout: this.renderPipeline.getBindGroupLayout(1),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.vertexUniformBuffer,
          },
        },
      ],
    });

    this.resize(this.canvasSize);
  }

  resize(size) {
    this.canvasSize = size;
    const device = this.context.getDevice();

    this.textures.resize(device, this.context.getCanvasFormat(), size);

    device.queue.writeBuffer(
      this.vertexUniformBuffer,
      0,
      new Float32Array([
        this.canvasSize.width,
        this.canvasSize.height,
        this.config.particules.size,
      ]),
    );

    if (this.msaaTexture) {
      this.msaaTexture.destroy();
    }

    this.msaaTexture = device.createTexture({
      label: "msaa texture",
      size: [this.canvasSize.width, this.canvasSize.height],
      format: this.context.getCanvasFormat(),
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
      sampleCount: 1,
    });

    this.renderPassDescriptor = {
      // colorAttachments: [
      //   {
      //     view: this.msaaTexture.createView(),
      //     // resolveTarget: this.context.getCurrentTexture().createView(), // destination screen, when multisampling = 1, should not define
      //     loadOp: "clear",
      //     storeOp: "store",
      //     clearValue: [0, 0, 0, 0],
      //   },
      // ],

      colorAttachments: Array.from({
        length: this.postProcess.getRenderTargetsCount(),
      }).map(() => ({
        view: this.msaaTexture.createView(),
        clearValue: { r: 0, g: 0, b: 0, a: 0 },
        loadOp: "clear",
        storeOp: "store",
      })),
      depthStencilAttachment: {
        view: null,
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
      },
    };

    this.postProcess.resize(device, this.canvasSize);
  }

  update() {
    super.update();
    const device = this.context.getDevice();
    const target = this.mousePressed ? MASS_FACTOR * 2 : MASS_FACTOR;
    const rate = RECOVER_RATE;
    const prev = this.massData[3];
    this.massData[3] = prev + (target - prev) * rate;
    device.queue.writeBuffer(this.computeUniformBuffer, 0, this.massData);

    const depthTextureView = this.textures.getDepthTextureView();
    this.renderPassDescriptor.depthStencilAttachment.view = depthTextureView;

    // Get current canvas texture and set attachment depending on MSAA sample count
    // const currentView = this.context.getCurrentTexture().createView();
    // this.renderPassDescriptor.colorAttachments[0].view = currentView;

    Array.from({ length: this.postProcess.getRenderTargetsCount() }).forEach((_, i) => {
      this.renderPassDescriptor.colorAttachments[i].view = this.postProcess.getRenderTargetView(i);
    });

    const canvasCurrentView = this.context.getCurrentTexture().createView();
    const pingTargetView = this.postProcess.getPingPongTexture(true).createView();
    this.postProcess.setFirstPassDestination(pingTargetView);
    this.postProcess.updateEffectTextures(canvasCurrentView);

    this.model.identity();
    this.model.rotate(this.time * 0.1, 0, 1, 0);
    this.updateCameraUniforms(this.cameraBuffers);
  }

  render() {
    super.render();

    const device = this.context.getDevice();

    const commandEncoder = device.createCommandEncoder();

    this.computeProcess.render(commandEncoder, [this.computeBindGroup]);

    const renderPass = commandEncoder.beginRenderPass(this.renderPassDescriptor);
    renderPass.setPipeline(this.renderPipeline);

    // First argument here refers to array index
    // in renderPipeline vertexState.vertexBuffers
    renderPass.setVertexBuffer(0, this.vertexBuffer);
    renderPass.setVertexBuffer(1, this.colorBuffer);
    renderPass.setVertexBuffer(2, this.positionBuffer);
    renderPass.setBindGroup(0, this.vertexUniformBindGroup);
    renderPass.setBindGroup(1, this.cameraBuffers.bindGroup);

    renderPass.draw(this.screenPointCount, this.particulesCount);
    renderPass.end();

    const dynamicParams = new Map();
    dynamicParams.set("glitch", [["time", [this.time * 0.01]]]);

    this.postProcess.renderFirstPass(commandEncoder);
    this.postProcess.renderEffects(commandEncoder, dynamicParams);

    device.queue.submit([commandEncoder.finish()]);
  }

  onMouseMove = (mouse) => {
    this.massData[0] = mouse.rel.x;
    this.massData[1] = mouse.rel.y;
  };

  onMouseDown = () => {
    this.downTimestamp = Date.now();
    this.mousePressed = true;
  };

  onMouseUp = () => {
    const duration = Date.now() - this.downTimestamp;
    if (this.massData[4] === 0) {
      // attraction mode
      const strength = mapFromRange(duration, 0, 3000, 0, REPULSE_FACTOR);
      this.massData[3] = -strength;
    } else {
      // repulse mode
      const strength = mapFromRange(duration, 0, 3000, 0, 0.2);
      this.massData[3] = -strength;
    }
    this.mousePressed = false;
  };

  setupControls = ({ checkboxes }) => {
    checkboxes.mode.dom.addEventListener("change", (e) => {
      this.massData[4] = e.target.checked ? 0 : 1;
    });
  };

  destroy() {
    super.destroy();
  }
}
