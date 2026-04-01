export class DashedLinePipeline {
  constructor(context) {
    this.context = context;
    this.pipeline = null;
    this.bindGroup = null;
    this.vertexBuffer = null;
    this.uniformBuffer = null;
    this.vertexCount = 0;

    this.uniforms = {
      color: [1, 1, 1, 1],
      dashSize: 0.06,
      gapSize: 0.04,
      offset: 0,
    };
  }

  async setup(program, points, options = {}) {
    const device = this.context.getDevice();
    const canvasFormat = options.canvasFormat || navigator.gpu.getPreferredCanvasFormat();
    const fragmentTargets = options.fragmentTargets || [
      {
        format: canvasFormat,
      },
    ];
    const pipelineTargets = fragmentTargets.map((target, index) => ({
      ...target,
      // This pipeline only writes @location(0).
      writeMask: index === 0 ? target.writeMask : 0,
    }));

    this.uniforms = {
      ...this.uniforms,
      ...options,
    };

    const vertexData = this.buildVertexData(points);
    this.vertexCount = vertexData.length / 3;

    this.vertexBuffer = device.createBuffer({
      label: "Dashed line vertex buffer",
      size: vertexData.byteLength,
      usage: window.GPUBufferUsage.VERTEX | window.GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.vertexBuffer, 0, vertexData);

    this.uniformBuffer = device.createBuffer({
      label: "Dashed line uniform buffer",
      size: Float32Array.BYTES_PER_ELEMENT * 8,
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
    });
    this.writeUniforms();

    this.pipeline = await device.createRenderPipelineAsync({
      label: "Dashed line pipeline",
      layout: "auto",
      vertex: {
        module: program.vertex,
        entryPoint: "v_main",
        buffers: [
          {
            arrayStride: Float32Array.BYTES_PER_ELEMENT * 3,
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: "float32x2",
              },
              {
                shaderLocation: 1,
                offset: Float32Array.BYTES_PER_ELEMENT * 2,
                format: "float32",
              },
            ],
          },
        ],
      },
      fragment: {
        module: program.fragment,
        entryPoint: "f_main",
        targets: pipelineTargets,
      },
      primitive: {
        topology: "line-strip",
      },
      depthStencil: options.depthStencilFormat
        ? {
            depthWriteEnabled: false,
            depthCompare: "less-equal",
            format: options.depthStencilFormat,
          }
        : undefined,
    });

    this.bindGroup = device.createBindGroup({
      label: "Dashed line bind group",
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: { buffer: this.uniformBuffer },
        },
      ],
    });
  }

  setOffset(offset) {
    this.uniforms.offset = offset;
    this.writeUniforms();
  }

  updateStyle({ color, dashSize, gapSize, offset } = {}) {
    if (color) this.uniforms.color = color;
    if (dashSize !== undefined) this.uniforms.dashSize = dashSize;
    if (gapSize !== undefined) this.uniforms.gapSize = gapSize;
    if (offset !== undefined) this.uniforms.offset = offset;
    this.writeUniforms();
  }

  setPoints(points) {
    if (!this.vertexBuffer) return;
    const device = this.context.getDevice();
    const vertexData = this.buildVertexData(points);
    this.vertexCount = vertexData.length / 3;
    device.queue.writeBuffer(this.vertexBuffer, 0, vertexData);
  }

  render(pass) {
    if (!this.pipeline || !this.bindGroup || !this.vertexBuffer || this.vertexCount < 2) {
      return;
    }
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.setVertexBuffer(0, this.vertexBuffer);
    pass.draw(this.vertexCount);
  }

  writeUniforms() {
    if (!this.uniformBuffer) return;
    const device = this.context.getDevice();
    const { color, dashSize, gapSize, offset } = this.uniforms;
    const data = new Float32Array([
      color[0],
      color[1],
      color[2],
      color[3],
      dashSize,
      gapSize,
      offset,
      0,
    ]);

    device.queue.writeBuffer(this.uniformBuffer, 0, data.buffer, data.byteOffset, data.byteLength);
  }

  buildVertexData(points) {
    if (!Array.isArray(points) || points.length < 2) {
      return new Float32Array([]);
    }

    const out = new Float32Array(points.length * 3);
    let cumulativeDistance = 0;

    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const x = Array.isArray(current) ? current[0] : current.x;
      const y = Array.isArray(current) ? current[1] : current.y;

      if (i > 0) {
        const previous = points[i - 1];
        const px = Array.isArray(previous) ? previous[0] : previous.x;
        const py = Array.isArray(previous) ? previous[1] : previous.y;
        const dx = x - px;
        const dy = y - py;
        cumulativeDistance += Math.hypot(dx, dy);
      }

      const offset = i * 3;
      out[offset + 0] = x;
      out[offset + 1] = y;
      out[offset + 2] = cumulativeDistance;
    }

    return out;
  }
}
