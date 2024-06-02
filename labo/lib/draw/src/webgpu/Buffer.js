class Buffer {
  constructor() {
    this.buffers = {
      vertex: null,
      index: null,
    };
    this.layout = null;
  }

  setup(device, primitives) {
    const { indices, position } = primitives;

    this.indexCount = indices.count;

    this.buffers.vertex = device.createBuffer({
      label: "vertex buffer",
      size: position.values.byteLength,
      usage: window.GPUBufferUsage.VERTEX | window.GPUBufferUsage.COPY_DST,
    });

    this.buffers.index = device.createBuffer({
      label: "index buffer",
      size: indices.values.byteLength,
      usage: window.GPUBufferUsage.INDEX | window.GPUBufferUsage.COPY_DST,
    });

    //  copier les données de sommet dans la mémoire du tampon
    device.queue.writeBuffer(this.buffers.vertex, 0, position.values);
    device.queue.writeBuffer(this.buffers.index, 0, indices.values);

    this.layout = {
      arrayStride: 12, // 4 * 2 (X,Y) ? // 4 * 3 (X,Y,Z)
      attributes: [
        {
          format: "float32x3",
          offset: 0,
          shaderLocation: 0, // Position, see vertex shader
        },
      ],
    };
  }

  get = () => this.buffers;

  getLayout = () => this.layout;

  getIndexCount = () => this.indexCount;
}

export default Buffer;
