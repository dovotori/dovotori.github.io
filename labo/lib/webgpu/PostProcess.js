export class PostProcess {
  constructor(context) {
    this.context = context;
    this.pipeline = undefined;
    this.renderTargetFormat = navigator.gpu.getPreferredCanvasFormat(); //'rgba8unorm';
    this.presentationFormat = navigator.gpu.getPreferredCanvasFormat();
    this.sampleCount = 1; // should be 1 for a render target used as texture, multisample is allow only for canvas context texture
    this.renderTargetsCount = 3;
    this.effectRenderGroups = new Map();
    this.canvasSize = { width: 1, height: 1 };
    this.effects = new Map(); // name, { pipeline, renderGroup }
  }

  setup(program) {
    const device = this.context.getDevice();

    this.pipeline = device.createRenderPipeline({
      label: "post process no attributes",
      layout: "auto",
      vertex: { module: program },
      fragment: {
        module: program,
        targets: [{ format: this.renderTargetFormat }],
      },
      multisample: {
        count: this.sampleCount,
      },
    });

    this.sampler = device.createSampler({
      minFilter: "linear",
      magFilter: "linear",
    });

    this.renderPassDescriptor = {
      label: "post process render pass",
      colorAttachments: [{ loadOp: "clear", storeOp: "store" }],
    };
  }

  setupRenderTextures(device, canvasSize) {
    this.renderTargets = Array.from({ length: this.renderTargetsCount }).map(
      (_, i) =>
        device.createTexture({
          label: `post process render target ${i}`,
          size: canvasSize,
          format: this.renderTargetFormat,
          sampleCount: this.sampleCount,
          usage:
            GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
        }),
    );
    this.renderTargetViews = this.renderTargets.map((rT) => rT.createView());

    this.bindGroup = device.createBindGroup({
      label: "post process bind group",
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: this.sampler },
        ...this.renderTargets.map((_, i) => ({
          binding: i + 1,
          resource: this.renderTargetViews[i],
        })),
      ],
    });
  }

  setupPingPongTargets(device, canvasSize) {
    this.pingTarget = device.createTexture({
      label: "ping render target",
      size: canvasSize,
      format: this.renderTargetFormat,
      sampleCount: this.sampleCount,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    this.pongTarget = device.createTexture({
      label: "pong render target",
      size: canvasSize,
      format: this.renderTargetFormat,
      sampleCount: this.sampleCount,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
  }

  addEffect(name, program, params = {}) {
    const device = this.context.getDevice();
    this.effects.set(name, {
      pipeline: device.createRenderPipeline({
        label: `post process ${name} no attributes`,
        layout: "auto",
        vertex: { module: program },
        fragment: {
          module: program,
          targets: [{ format: this.presentationFormat }],
        },
        multisample: {
          count: this.sampleCount,
        },
      }),
      passDescriptor: {
        label: `post process ${name}`,
        colorAttachments: [{ loadOp: "clear", storeOp: "store" }],
      },
      params,
    });
  }

  setupEffectSource(name, sourceTextureView) {
    const device = this.context.getDevice();

    let buffers = {};
    const entries = [
      { binding: 0, resource: this.sampler },
      { binding: 1, resource: sourceTextureView },
    ];

    switch (name) {
      case "guassianBlurVertical":
      case "guassianBlurHorizontal": {
        const texelSize = [
          1 / this.canvasSize.width,
          1 / this.canvasSize.height,
        ];

        const radiusBuffer = device.createBuffer({
          label: "radius buffer",
          size: 8,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const directionBuffer = device.createBuffer({
          label: "direction buffer",
          size: 8,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const texelSizeBuffer = device.createBuffer({
          label: "texel size buffer",
          size: 8,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        device.queue.writeBuffer(
          texelSizeBuffer,
          0,
          new Float32Array(texelSize),
        );

        entries.push(
          ...[
            { binding: 2, resource: { buffer: directionBuffer } },
            { binding: 3, resource: { buffer: texelSizeBuffer } },
            { binding: 4, resource: { buffer: radiusBuffer } },
          ],
        );
        buffers = { radius: radiusBuffer, direction: directionBuffer };
        break;
      }
      case "bright": {
        const thresholdBuffer = device.createBuffer({
          label: "threshold buffer",
          size: 8,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        const glowThresholdKneeBuffer = device.createBuffer({
          label: "glow threshold knee buffer",
          size: 8,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });
        entries.push(
          ...[
            { binding: 2, resource: { buffer: thresholdBuffer } },
            { binding: 3, resource: { buffer: glowThresholdKneeBuffer } },
          ],
        );
        buffers = {
          threshold: thresholdBuffer,
          glowThresholdKnee: glowThresholdKneeBuffer,
        };
        break;
      }
      default:
        break;
    }

    this.effects.set(name, {
      ...this.effects.get(name),
      bindGroup: device.createBindGroup({
        label: `Group for ${name}`,
        layout: this.effects.get(name).pipeline.getBindGroupLayout(0),
        entries,
      }),
      buffers,
    });
  }

  resize = (device, canvasSize) => {
    this.canvasSize = canvasSize;
    this.renderTargets?.forEach((t) => {
      t.destroy();
    });
    this.setupRenderTextures(device, canvasSize);

    this.pingTarget?.destroy();
    this.pongTarget?.destroy();
    this.setupPingPongTargets(device, canvasSize);

    let i = 0;
    for (const [name, _] of this.effects) {
      this.setupEffectSource(
        name,
        this.getPingPongTexture(i % 2 === 0).createView(),
      );
      i++;
    }
  };

  updateTexture(dstTextureView) {
    // set the canvas context texture as the render target (result of the process, output of the shader)
    this.renderPassDescriptor.colorAttachments[0].view = dstTextureView;
  }

  render(encoder) {
    const pass = encoder.beginRenderPass(this.renderPassDescriptor);
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.draw(3);
    pass.end();
  }

  updateEffectTextures(canvasTextureView) {
    let i = 0;
    for (const [name, _] of this.effects) {
      const isLast = i === this.effects.size - 1;
      const destinationView = isLast
        ? canvasTextureView
        : this.getPingPongTexture(i % 2 !== 0).createView();
      this.updateEffectTexture(name, destinationView);
      i++;
    }
  }

  updateEffectTexture(name, dstTextureView) {
    const effect = this.effects.get(name);
    if (!effect) return;
    effect.passDescriptor.colorAttachments[0].view = dstTextureView;
  }

  renderEffects(encoder) {
    for (const [name, _] of this.effects) {
      this.applyEffect(name);
      this.renderEffect(name, encoder);
    }
  }

  applyEffect(name) {
    const effect = this.effects.get(name);
    if (!effect) return;
    const device = this.context.getDevice();
    for (const key of Object.keys(effect.params)) {
      device.queue.writeBuffer(
        effect.buffers[key],
        0,
        new Float32Array(effect.params[key]),
      );
    }
  }

  renderEffect(name, encoder) {
    const effect = this.effects.get(name);
    if (!effect) return;
    const pass = encoder.beginRenderPass(effect.passDescriptor);
    pass.setPipeline(effect.pipeline);
    pass.setBindGroup(0, effect.bindGroup);
    pass.draw(3);
    pass.end();
  }

  getPipeline() {
    return this.pipeline;
  }

  getRenderTargetView(index) {
    return this.renderTargetViews[index];
  }

  getRenderTargetFormat() {
    return this.renderTargetFormat;
  }

  getRenderTargetsCount() {
    return this.renderTargetsCount;
  }

  getPingPongTexture(isPing) {
    return isPing ? this.pingTarget : this.pongTarget;
  }
}
