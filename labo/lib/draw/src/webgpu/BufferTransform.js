import Transform from "../maths/Transform";

class BufferTransform {
  static setup(device, layout, bufferData) {
    const buffer = BufferTransform.setupOne(device, bufferData);
    return device.createBindGroup({
      label: "NodeTransformBindGroup",
      layout,
      entries: [
        {
          binding: 0,
          resource: { buffer },
        },
      ],
    });
  }

  // https://webgpufundamentals.org/webgpu/lessons/webgpu-memory-layout.html
  static setupOne(device, bufferData) {
    const { transformMatrix, pickingColor } = bufferData;
    // copy paste wgsl struct here to get the mapping
    // https://webgpufundamentals.org/webgpu/lessons/resources/wgsl-offset-computer.html
    const buffer = device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * 16 * 2, // 1 4x4 mat + 1 3x3 mat + 1 vec4
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    const bufferArray = new Float32Array(buffer.getMappedRange());
    const normalMatrix = Transform.getNormalMatrix(transformMatrix);
    bufferArray.set([
      ...pickingColor,
      ...transformMatrix.get(),
      ...normalMatrix.get(),
    ]);
    buffer.unmap();
    return buffer;
  }

  static getNodeMatrix(node) {
    return Transform.get(node);
  }
}

export default BufferTransform;
