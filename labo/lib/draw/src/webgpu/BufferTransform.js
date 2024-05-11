import Transform from "../maths/Transform";

class BufferTransform {
  static setup(device, node, layout) {
    const buffer = BufferTransform.setupOne(device, node);
    return device.createBindGroup({
      label: "bind group transform",
      layout,
      entries: [
        {
          binding: 0,
          resource: { buffer },
        },
      ],
    });
  }

  static setupOne(device, node) {
    const buffer = device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * 16 * 2, // 1 4x4 mat + 1 3x3 mat
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    const bufferArray = new Float32Array(buffer.getMappedRange());
    const transform = Transform.get(node);
    const normalMatrix = Transform.getNormalMatrix(transform);
    bufferArray.set([...transform.get(), ...normalMatrix.get()]);
    buffer.unmap();
    return buffer;
  }
}

export default BufferTransform;
