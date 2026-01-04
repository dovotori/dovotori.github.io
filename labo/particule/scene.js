import { PostProcess } from "../lib/webgpu";
import WebgpuScene from "../lib/webgpu/WebgpuScene";

const MASS_FACTOR = 0.0001;
const RECOVER_RATE = 0.6; // lerp rate per frame (tune to taste) - closest to 0 faster to regroup
const REPULSE_FACTOR = 0.005;

const computeShader = (WORKGROUP_SIZE) => `struct Mass {
    position: vec3f,
    factor: f32,
};

@group(0) @binding(0) var<storage, read_write> positions: array<vec4f>;
@group(0) @binding(1) var<storage, read_write> velocities: array<vec4f>; 
@group(0) @binding(2) var<uniform> mass: Mass;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) global_id: vec3u) {
    let index = global_id.x;
    let position = positions[index].xyz;
    var velocity = velocities[index].xyz;

    var massVec = mass.position.xyz - position;
    var massDist = max(0.01, dot(massVec, massVec));
    var acceleration = mass.factor * normalize(massVec) / massDist;

    velocity += acceleration;
    velocity *= 0.8;

    var newPosition = position + velocity;

    if (newPosition.x < -1.0) {
      // reflect across -1 boundary
      newPosition.x = -2.0 - newPosition.x;
      velocity.x = -velocity.x;
    } else if (newPosition.x > 1.0) {
      // reflect across +1 boundary
      newPosition.x = 2.0 - newPosition.x;
      velocity.x = -velocity.x;
    }
    if (newPosition.y < -1.0) {
      newPosition.y = -2.0 - newPosition.y;
      velocity.y = -velocity.y;
    } else if (newPosition.y > 1.0) {
      newPosition.y = 2.0 - newPosition.y;
      velocity.y = -velocity.y;
    }

    newPosition.z = 0.0;
        
    positions[index] = vec4f(newPosition, 1);
    velocities[index] = vec4f(velocity, 0);
}`;

export default class Scene extends WebgpuScene {
  constructor(context, config) {
    super(context, config);

    const { width, height } = config.canvas;
    this.canvasSize = { width, height };
  }

  async setupAssets(assets) {
    const { programs } = await super.setupAssets(assets);

    const device = this.context.getDevice();

    this.postProcess = new PostProcess(this.context);
    this.postProcess.setup(programs.postprocess.get());

    Object.keys(this.config.postprocess).forEach((key) => {
      const effect = this.config.postprocess[key];
      this.postProcess.addEffect(key, programs[effect.programName].get(), effect.params);
    });

    this.postProcess.debug();

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

    const computeShaderModule = device.createShaderModule({
      code: computeShader(this.config.particules.workgroupSize),
      label: "Compute Shader",
    });

    this.computePipeline = device.createComputePipeline({
      layout: "auto",
      label: "Compute Pipeline",
      compute: {
        module: computeShaderModule,
        entryPoint: "main",
      },
    });

    // Attractors points + factors
    // -1 to 1 (0,0) center of the screen
    this.massData = new Float32Array([
      0,
      0,
      0, // Mass position
      MASS_FACTOR, // Mass factor
    ]);

    this.computeUniformBuffer = device.createBuffer({
      size: this.massData.byteLength,
      label: "attractors compute uniform buffer",
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(this.computeUniformBuffer, 0, this.massData);

    this.computeBindGroup = device.createBindGroup({
      layout: this.computePipeline.getBindGroupLayout(0),
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

    this.computePassDescription = {
      label: "Compute Pass description",
    };

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

    this.sampleCount = 1;

    this.renderPipeline = await device.createRenderPipelineAsync({
      label: "Particule Render Pipeline",
      layout: "auto",
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
        targets: Array.from({
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
        })),
      },
      multisample: {
        count: this.sampleCount,
      },
      primitive: {
        topology: "triangle-strip",
        stripIndexFormat: "uint32",
      },
    });

    // Rendering uniform buffer
    this.vertexUniformBuffer = device.createBuffer({
      size: 16, // Float32Array.BYTES_PER_ELEMENT * 3 but need to align to 16 bytes
      label: "vertex uniform buffer",
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.vertexUniformBindGroup = device.createBindGroup({
      layout: this.renderPipeline.getBindGroupLayout(0),
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
    };

    this.postProcess.resize(device, this.canvasSize);
  }

  update() {
    super.update();
    const device = this.context.getDevice();
    const target = MASS_FACTOR;
    const rate = RECOVER_RATE;
    const prev = this.massData[3];
    this.massData[3] = prev + (target - prev) * rate;
    device.queue.writeBuffer(this.computeUniformBuffer, 0, this.massData);

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
  }

  render() {
    super.render();

    const device = this.context.getDevice();

    const commandEncoder = device.createCommandEncoder();

    const computePass = commandEncoder.beginComputePass(this.computePassDescription);
    computePass.setPipeline(this.computePipeline);
    computePass.setBindGroup(0, this.computeBindGroup);
    computePass.dispatchWorkgroups(this.config.particules.workgroupCount);
    computePass.end();

    const renderPass = commandEncoder.beginRenderPass(this.renderPassDescriptor);
    renderPass.setPipeline(this.renderPipeline);

    // First argument here refers to array index
    // in renderPipeline vertexState.vertexBuffers
    renderPass.setVertexBuffer(0, this.vertexBuffer);
    renderPass.setVertexBuffer(1, this.colorBuffer);
    renderPass.setVertexBuffer(2, this.positionBuffer);
    renderPass.setBindGroup(0, this.vertexUniformBindGroup);

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

  onMouseClick = () => {
    this.massData[3] = -REPULSE_FACTOR;
  };

  destroy() {
    super.destroy();
  }
}
