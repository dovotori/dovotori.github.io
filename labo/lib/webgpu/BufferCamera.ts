export type CameraBuffers = {
  buffer: GPUBuffer;
  bindGroup: GPUBindGroup;
  bufferLightProj?: GPUBuffer;
};

export class BufferCamera {
  setup(device: GPUDevice, layout: GPUBindGroupLayout, withLight = false): CameraBuffers {
    // allocate extra space for near/far floats and padding
    const buffer = device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * (16 * 3 + 8), // projection + view + model + vec4(pad/pos) + near/far + padding
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
    });

    const entries = [
      {
        binding: 0,
        resource: {
          buffer,
        },
      },
    ];

    let bufferLightProj: GPUBuffer;
    if (withLight) {
      bufferLightProj = device.createBuffer({
        label: "LightProjBuffer",
        size: Float32Array.BYTES_PER_ELEMENT * 16,
        usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
      });

      entries.push({
        binding: 1,
        resource: {
          buffer: bufferLightProj,
        },
      });
    }

    const bindGroup = device.createBindGroup({
      label: "CameraUniforms",
      layout,
      entries,
    });

    return {
      buffer,
      bindGroup,
      bufferLightProj,
    };
  }
}
