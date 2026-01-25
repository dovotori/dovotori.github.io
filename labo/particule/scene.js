import { mapFromRange } from "../lib/utils/numbers";
import { ComputeProcess, PipelineTextures, PostProcess } from "../lib/webgpu";
import { defaultDepthAttachment } from "../lib/webgpu/constants";
import WebgpuSceneCamera from "../lib/webgpu/WebgpuSceneCamera";
import { buildAttractorData, computeAttactor } from "./computeAttractor";
import { buildFlowData, computeFlow, wglsPerlinNoise } from "./computeFlow";

const MASS_FACTOR = 0.0001;
const RECOVER_RATE = 0.6; // lerp rate per frame (tune to taste) - closest to 0 faster to regroup
const REPULSE_FACTOR = 0.005;

const MODES = {
  0: "repulsor",
  1: "flow",
};

export const computeMainShader = (WORKGROUP_SIZE) => `
struct Mass {
  position: vec3f,
  factor: f32,
  mode: f32,
};

struct SettingsUniform {
  mode: f32,
  time: f32,
};

@group(0) @binding(0) var<storage, read_write> positions: array<vec4f>;
@group(0) @binding(1) var<storage, read_write> velocities: array<vec4f>; 
@group(0) @binding(2) var<uniform> mass: Mass;
@group(0) @binding(3) var<uniform> settings: SettingsUniform;

${wglsPerlinNoise}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) global_id: vec3u) {
  let index = global_id.x;
  let position = positions[index].xyz;
  var velocity = velocities[index].xyz;
  var time = settings.time;

  var newPosition: vec4f;
  var newVelocity: vec4f;

  if (settings.mode == 0.0) {
    ${computeAttactor}
  } else {
    ${computeFlow}
  }
  
  positions[index] = newPosition;
  velocities[index] = newVelocity;
}`;

export default class Scene extends WebgpuSceneCamera {
  constructor(context, config) {
    super(context, config);

    const { width, height } = config.canvas;

    this.camera.perspective(width, height);
    this.postProcess = new PostProcess(this.context);

    this.sampleCount = 1; // because we use post process (4 if not)

    this.textures = new PipelineTextures(1);

    this.downTimestamp = 0;
    this.mousePressed = false;

    this.mode = 0;
  }

  async setupAssets(assets) {
    const { programs } = await super.setupAssets(assets);
    const device = this.context.getDevice();

    this.textures.setup(device, this.context.getCanvasFormat(), this.canvasSize, "depth24plus");

    await this.postProcess.setup(programs, this.config.postprocess);

    this.particulesCount =
      this.config.particules.workgroupSize * this.config.particules.workgroupCount;

    let data;
    if (MODES[this.mode] === "repulsor") {
      data = buildAttractorData(this.particulesCount);
    } else {
      data = buildFlowData(this.particulesCount, this.canvasSize);
    }

    const {
      positionBufferData,
      positionArrayStride,
      velocityBufferData,
      velocityArrayStride,
      colorArrayStride,
      colorBufferData,
    } = data;

    this.positionBuffer = device.createBuffer({
      size: positionArrayStride * this.particulesCount, // 16 * NUM_PARTICLES
      label: "particules position buffer",
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
    });

    device.queue.writeBuffer(this.positionBuffer, 0, positionBufferData);

    this.velocityBuffer = device.createBuffer({
      size: velocityArrayStride * this.particulesCount, // 16 * NUM_PARTICLES
      label: "particules velocity buffer",
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST | GPUBufferUsage.STORAGE,
    });

    device.queue.writeBuffer(this.velocityBuffer, 0, velocityBufferData);

    this.computeProcess = new ComputeProcess(
      device,
      computeMainShader(this.config.particules.workgroupSize),
      this.config.particules.workgroupCount,
    );

    // time uniform for compute shader (single float)
    // Allocate at least 32 bytes to satisfy minBindingSize for uniform buffers
    this.computeSettingsBuffer = device.createBuffer({
      label: "compute time buffer",
      size: Math.max(Float32Array.BYTES_PER_ELEMENT, 32),
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

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
        {
          binding: 3,
          resource: {
            buffer: this.computeSettingsBuffer,
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

    this.colorBuffer = device.createBuffer({
      size: colorArrayStride * this.particulesCount,
      label: "particules color buffer",
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(this.colorBuffer, 0, colorBufferData);

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
          {
            // per-instance rotation stored in velocityBuffer (4th component)
            arrayStride: velocityArrayStride,
            stepMode: "instance",
            attributes: [
              {
                shaderLocation: 3,
                format: "float32",
                offset: 3 * Float32Array.BYTES_PER_ELEMENT,
              },
            ],
          },
        ],
      },
      fragment: {
        module: programs.f_particule.get(),
        entryPoint: "f_main",
        targets: this.postProcess.getPipelineFragmentTargets(),
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
      size: 24, // Float32Array.BYTES_PER_ELEMENT * 5, // vec2/f/f/f Float32Array.BYTES_PER_ELEMENT * 3 but need to align to 16 bytes
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

    // compute particle grid spacing (pixels) to pass to the vertex shader
    const count = this.particulesCount;
    const canvasW = this.canvasSize.width || 1;
    const canvasH = this.canvasSize.height || 1;
    const aspect = canvasW / canvasH;
    const cols = Math.ceil(Math.sqrt(count * aspect));
    const rows = Math.ceil(count / cols);
    const spacing = canvasH / rows; // pixel spacing between rows

    device.queue.writeBuffer(
      this.vertexUniformBuffer,
      0,
      new Float32Array([
        this.canvasSize.width,
        this.canvasSize.height,
        this.config.particules.size,
        spacing,
        this.mode,
      ]),
    );

    this.postProcess.resize(device, this.canvasSize);
    this.postProcess.resizeEffects();

    this.renderPassDescriptor = {
      label: "Render Pass Descriptor",
      colorAttachments: this.postProcess.getPassDescriptorColorAttachments(),
      depthStencilAttachment: defaultDepthAttachment,
    };
  }

  update() {
    super.update();
    const device = this.context.getDevice();
    const target = this.mousePressed ? MASS_FACTOR * 2 : MASS_FACTOR;
    const rate = RECOVER_RATE;
    const prev = this.massData[3];
    this.massData[3] = prev + (target - prev) * rate;
    device.queue.writeBuffer(this.computeUniformBuffer, 0, this.massData);
    device.queue.writeBuffer(
      this.computeSettingsBuffer,
      0,
      new Float32Array([this.mode, this.time]),
    );

    const depthTextureView = this.textures.getDepthTextureView();
    this.renderPassDescriptor.depthStencilAttachment.view = depthTextureView;

    // Get current canvas texture and set attachment depending on MSAA sample count
    // const currentView = this.context.getCurrentTexture().createView();
    // this.renderPassDescriptor.colorAttachments[0].view = currentView;

    this.postProcess.getColorAttachmentsTargetViews().forEach((view, i) => {
      this.renderPassDescriptor.colorAttachments[i].view = view;
    });

    const canvasCurrentView = this.context.getCurrentTexture().createView();
    this.postProcess.setFirstPassDestination();
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
    // bind velocityBuffer (4th component contains rotation) to slot 3
    renderPass.setVertexBuffer(3, this.velocityBuffer);
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
