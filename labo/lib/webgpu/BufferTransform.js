import Transform from "../utils/maths/Transform";

class BufferTransform {
  constructor() {
    this.name = "BufferTransform";
    this.buffer = null;
    this.bindGroup = null;
  }

  // https://webgpufundamentals.org/webgpu/lessons/webgpu-memory-layout.html
  setup(device, layout, bufferSkin) {
    // copy paste wgsl struct here to get the mapping
    // https://webgpufundamentals.org/webgpu/lessons/resources/wgsl-offset-computer.html
    this.buffer = device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * 16 * 2, // 1 4x4 mat + 1 3x3 mat + 1 vec4  (use the space of 2 mat4, but may not use all space)
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
      // mappedAtCreation: true,
    });

    const entries = [
      {
        binding: 0,
        resource: { buffer: this.buffer },
      },
    ];

    if (bufferSkin) {
      entries.push({
        binding: 1,
        resource: { buffer: bufferSkin.get() },
      });
    }

    this.bindGroup = device.createBindGroup({
      label: "NodeTransformBindGroup",
      layout,
      entries,
    });
  }

  update(device, bufferData) {
    const { transformMatrix, pickingColor } = bufferData;

    const normalMatrix = Transform.getNormalMatrix(transformMatrix).get();

    const nm = [
      normalMatrix[0],
      normalMatrix[1],
      normalMatrix[2],
      0,
      normalMatrix[3],
      normalMatrix[4],
      normalMatrix[5],
      0,
      normalMatrix[6],
      normalMatrix[7],
      normalMatrix[8],
      0,
    ];

    // order is important , should be the same than vertex uniform structure
    const data = [
      ...transformMatrix.get(),
      ...nm,
      ...(pickingColor ?? []), // use in picking shader
    ];

    device.queue.writeBuffer(this.buffer, 0, new Float32Array(data));
  }

  getBuffer() {
    return this.buffer;
  }

  getBindGroup() {
    return this.bindGroup;
  }
}

export default BufferTransform;
