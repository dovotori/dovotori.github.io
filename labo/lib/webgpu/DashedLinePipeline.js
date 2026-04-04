export class DashedLinePipeline {
  constructor(context) {
    this.context = context;
    this.pipeline = null;
    this.bindGroup = null;
    this.vertexBuffer = null;
    this.uniformBuffer = null;
    this.matrixBuffer = null;
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
    this.vertexCount = vertexData.length / 4; // xyz + distance

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

    this.matrixBuffer = device.createBuffer({
      label: "Dashed line matrix buffer",
      size: Float32Array.BYTES_PER_ELEMENT * 16 * 3, // projection + view + model
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
    });
    this.updateMatrices(options.projectionMatrix, options.viewMatrix, options.modelMatrix);

    this.pipeline = await device.createRenderPipelineAsync({
      label: "Dashed line pipeline",
      layout: "auto",
      vertex: {
        module: program.vertex,
        entryPoint: "v_main",
        buffers: [
          {
            arrayStride: Float32Array.BYTES_PER_ELEMENT * 4,
            attributes: [
              {
                shaderLocation: 0,
                offset: 0,
                format: "float32x3",
              },
              {
                shaderLocation: 1,
                offset: Float32Array.BYTES_PER_ELEMENT * 3,
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
        {
          binding: 1,
          resource: { buffer: this.matrixBuffer },
        },
      ],
    });
  }

  updateMatrices(projection, view, model) {
    if (!this.matrixBuffer) return;
    const device = this.context.getDevice();

    const identity = DashedLinePipeline.identityMat4();
    const matrices = new Float32Array(16 * 3);
    matrices.set(projection || identity, 0);
    matrices.set(view || identity, 16);
    matrices.set(model || identity, 32);

    device.queue.writeBuffer(
      this.matrixBuffer,
      0,
      matrices.buffer,
      matrices.byteOffset,
      matrices.byteLength,
    );
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
    this.vertexCount = vertexData.length / 4;
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

    const out = new Float32Array(points.length * 4);
    let cumulativeDistance = 0;

    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      const x = Array.isArray(current) ? current[0] : current.x;
      const y = Array.isArray(current) ? current[1] : current.y;
      const z = Array.isArray(current) ? (current[2] ?? 0) : (current.z ?? 0);

      if (i > 0) {
        const previous = points[i - 1];
        const px = Array.isArray(previous) ? previous[0] : previous.x;
        const py = Array.isArray(previous) ? previous[1] : previous.y;
        const pz = Array.isArray(previous) ? (previous[2] ?? 0) : (previous.z ?? 0);
        const dx = x - px;
        const dy = y - py;
        const dz = z - pz;
        cumulativeDistance += Math.hypot(dx, dy, dz);
      }

      const offset = i * 4;
      out[offset + 0] = x;
      out[offset + 1] = y;
      out[offset + 2] = z;
      out[offset + 3] = cumulativeDistance;
    }

    return out;
  }

  static identityMat4() {
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }
}
