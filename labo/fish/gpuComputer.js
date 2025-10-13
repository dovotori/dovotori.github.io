export class WebGPUComputer {
  constructor(computerShader) {
    this._computeShader = computerShader;
  }

  static async init(computeShader) {
    const webGPUComputer = new WebGPUComputer(computeShader);
    await webGPUComputer._initWebGPU();
    await webGPUComputer._initComputePipeline();

    return webGPUComputer;
  }

  run(bindGroups, sourceBuffer, destinationBuffer, workerGroups) {
    if (!this._device || !this._computePipeline) {
      return;
    }

    this._commandEncoder = this._device.createCommandEncoder();
    const computePass = this._commandEncoder.beginComputePass();
    computePass.setPipeline(this._computePipeline);
    for (let i = 0; i < bindGroups.length; i++) {
      computePass.setBindGroup(i, bindGroups[i]);
    }
    computePass.dispatchWorkgroups(workerGroups); // threads
    computePass.end();

    this._commandEncoder.copyBufferToBuffer(
      sourceBuffer,
      0,
      destinationBuffer,
      0,
      destinationBuffer.size,
    );
    this._device.queue.submit([this._commandEncoder.finish()]);
  }

  createBuffer(size, usage) {
    if (!this._device) {
      return;
    }

    return this._device.createBuffer({
      size: size,
      usage: usage,
    });
  }

  writeToBuffer(buffer, data) {
    if (!this._device) {
      return;
    }

    this._device.queue.writeBuffer(buffer, 0, data);
  }

  createBindGroup(buffers) {
    if (!this._device || !this._computePipeline) {
      return;
    }

    return this._device.createBindGroup({
      entries: buffers.map((buffer, index) => {
        return {
          binding: index,
          resource: {
            buffer: buffer,
          },
        };
      }),
      layout: this._computePipeline.getBindGroupLayout(0),
    });
  }

  async _initWebGPU() {
    if (!navigator.gpu) {
      throw new Error("WebGPU Not Supported");
    }

    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: "high-performance",
    });
    if (!adapter) {
      throw new Error("Could not get adapter");
    }

    this._device = await adapter.requestDevice({
      requiredLimits: {
        maxStorageBufferBindingSize: adapter.limits.maxStorageBufferBindingSize,
      },
    });
  }

  async _initComputePipeline() {
    if (!this._device) {
      return;
    }
    const descriptor = {
      layout: "auto",
      compute: {
        module: this._device.createShaderModule({
          code: this._computeShader,
        }),
        entryPoint: "main",
      },
    };

    this._computePipeline =
      await this._device.createComputePipelineAsync(descriptor);
  }
}
