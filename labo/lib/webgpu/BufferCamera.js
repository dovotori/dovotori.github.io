export class BufferCamera {
  constructor() {
    this.buffer = null;
  }

  setup(device, layout, withLight = false) {
    const buffer = device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * (16 * 3 + 4), // 4x4 matrix view + projection + model + vec3,
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

    let bufferLightProj;
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
