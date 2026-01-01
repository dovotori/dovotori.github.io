import WebgpuScene from "../lib/webgpu/WebgpuScene";

const WORKGROUP_SIZE = 64;
const NUM_WORKGROUPS = 1000;
const NUM_PARTICLES = WORKGROUP_SIZE * NUM_WORKGROUPS;
const PARTICLE_SIZE = 2;

const computeShader = `struct Mass {
    position1: vec4f,
    position2: vec4f,
    position3: vec4f,
    factor1: f32,
    factor2: f32,
    factor3: f32
};

@group(0) @binding(0) var<storage, read_write> positions: array<vec4f>;
@group(0) @binding(1) var<storage, read_write> velocities: array<vec4f>; 
@group(0) @binding(2) var<uniform> mass: Mass;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) global_id: vec3u) {
    let index = global_id.x;
    let position = positions[index].xyz;
    var velocity = velocities[index].xyz;

    var massVec = mass.position1.xyz - position;
    var massDist2 = max(0.01, dot(massVec, massVec));
    var acceleration = mass.factor1 * normalize(massVec) / massDist2;

    massVec = mass.position2.xyz - position;
    massDist2 = max(0.01, dot(massVec, massVec));
    acceleration += mass.factor2 * normalize(massVec) / massDist2;

    massVec = mass.position3.xyz - position;
    massDist2 = max(0.01, dot(massVec, massVec));
    acceleration += mass.factor3 * normalize(massVec) / massDist2;

    velocity += acceleration;
    velocity *= 0.9999;

    positions[index] = vec4f(position + velocity, 1);
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

    const positionArrayStride = Float32Array.BYTES_PER_ELEMENT * 4;
    this.positionBuffer = device.createBuffer({
      size: positionArrayStride * NUM_PARTICLES, // 16 * NUM_PARTICLES
      label: "particules position buffer",
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
    });
    const positionBufferData = new Float32Array(NUM_PARTICLES * 4);
    for (let i = 0; i < positionBufferData.length; i += 4) {
      positionBufferData[i] = Math.random() * 2 - 1;
      positionBufferData[i + 1] = Math.random() * 2 - 1;
      positionBufferData[i + 2] = Math.random() * 2 - 1;
      positionBufferData[i + 3] = 1;
    }
    device.queue.writeBuffer(this.positionBuffer, 0, positionBufferData);

    const velocityArrayStride = Float32Array.BYTES_PER_ELEMENT * 4;
    this.velocityBuffer = device.createBuffer({
      size: velocityArrayStride * NUM_PARTICLES, // 16 * NUM_PARTICLES
      label: "particules velocity buffer",
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
    });
    const velocityBufferData = new Float32Array(NUM_PARTICLES * 4);
    for (let i = 0; i < velocityBufferData.length; i += 4) {
      velocityBufferData[i] = Math.random() * 0.002 - 0.001;
      velocityBufferData[i + 1] = Math.random() * 0.002 - 0.001;
      velocityBufferData[i + 2] = Math.random() * 0.002 - 0.001;
      velocityBufferData[i + 3] = 0;
    }
    device.queue.writeBuffer(this.velocityBuffer, 0, velocityBufferData);

    const computeShaderModule = device.createShaderModule({
      code: computeShader,
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
    const computeUniformData = new Float32Array([
      Math.random() * 2.0 - 1.0,
      Math.random() * 2.0 - 1.0,
      0,
      1.0, // Mass 1 position
      Math.random() * 2.0 - 1.0,
      Math.random() * 2.0 - 1.0,
      0,
      1.0, // Mass 2 position
      Math.random() * 2.0 - 1.0,
      Math.random() * 2.0 - 1.0,
      0,
      1.0, // Mass 3 position
      Math.random() / 30000,
      Math.random() / 30000,
      Math.random() / 30000,
      0, // Mass factors
    ]);

    const computeUniformBuffer = device.createBuffer({
      size: computeUniformData.byteLength,
      label: "attractors compute uniform buffer",
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(computeUniformBuffer, 0, computeUniformData);

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
            buffer: computeUniformBuffer,
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
      size: colorArrayStride * NUM_PARTICLES,
      label: "particules color buffer",
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    const colorBufferData = new Uint8Array(4 * NUM_PARTICLES);
    for (let i = 0; i < colorBufferData.length; i += 4) {
      colorBufferData[i] = Math.floor(Math.random() * 256);
      colorBufferData[i + 1] = Math.floor(Math.random() * 256);
      colorBufferData[i + 2] = Math.floor(Math.random() * 256);
      colorBufferData[i + 3] = 128;
    }
    device.queue.writeBuffer(this.colorBuffer, 0, colorBufferData);

    this.renderPipeline = await device.createRenderPipelineAsync({
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
        targets: [
          {
            format: this.context.getCanvasFormat(),
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
          },
        ],
      },
      multisample: {
        count: 4,
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
      new Float32Array([this.canvasSize.width, this.canvasSize.height, PARTICLE_SIZE]),
    );

    if (this.msaaTexture) {
      this.msaaTexture.destroy();
    }

    this.msaaTexture = device.createTexture({
      label: "msaa texture",
      size: [this.canvasSize.width, this.canvasSize.height],
      format: this.context.getCanvasFormat(),
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
      sampleCount: 4,
    });

    this.renderPassDescription = {
      colorAttachments: [
        {
          view: this.msaaTexture.createView(),
          resolveTarget: this.context.getCurrentTexture().createView(),
          loadOp: "clear",
          storeOp: "store",
          clearValue: [0, 0, 0, 0],
        },
      ],
    };
  }

  update() {
    super.update();
  }

  render() {
    super.render();

    const device = this.context.getDevice();

    const commandEncoder = device.createCommandEncoder();

    const computePass = commandEncoder.beginComputePass(this.computePassDescription);
    computePass.setPipeline(this.computePipeline);
    computePass.setBindGroup(0, this.computeBindGroup);
    computePass.dispatchWorkgroups(NUM_WORKGROUPS);
    computePass.end();

    // Get current canvas texture
    this.renderPassDescription.colorAttachments[0].resolveTarget = this.context
      .getCurrentTexture()
      .createView();

    const renderPass = commandEncoder.beginRenderPass(this.renderPassDescription);
    renderPass.setPipeline(this.renderPipeline);

    // First argument here refers to array index
    // in renderPipeline vertexState.vertexBuffers
    renderPass.setVertexBuffer(0, this.vertexBuffer);
    renderPass.setVertexBuffer(1, this.colorBuffer);
    renderPass.setVertexBuffer(2, this.positionBuffer);
    renderPass.setBindGroup(0, this.vertexUniformBindGroup);

    renderPass.draw(this.screenPointCount, NUM_PARTICLES);
    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
  }

  destroy() {
    super.destroy();
  }
}
