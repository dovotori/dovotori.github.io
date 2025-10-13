import Transform from '../utils/maths/Transform';

class BufferTransform {
  static setup(device, layout, bufferData, debugName) {
    const buffer = BufferTransform.setupOne(device, bufferData, debugName);
    return device.createBindGroup({
      label: 'NodeTransformBindGroup',
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
  static setupOne(device, bufferData, debugName) {
    const { transformMatrix, pickingColor } = bufferData;

    // copy paste wgsl struct here to get the mapping
    // https://webgpufundamentals.org/webgpu/lessons/resources/wgsl-offset-computer.html
    const buffer = device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * 16 * 2, // 1 4x4 mat + 1 3x3 mat + 1 vec4  (use the space of 2 mat4, but may not use all space)
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });
    const bufferArray = new Float32Array(buffer.getMappedRange());
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

    bufferArray.set(data);
    buffer.unmap();
    return buffer;
  }
}

export default BufferTransform;
