class BufferGltf {
  constructor() {
    this.vertex = null;
    this.indexes = null;
    this.layout = null;

    this.faceColor = null;
  }

  setup(device, primitive) {
    const { arrayStride, attributes, bufferVertex, bufferIndex, indexCount } =
      primitive;

    this.indexCount = indexCount;

    /*
      Soit on utilise writeBuffer to put data on Gpu (mémoire du tampon), device.queue.writeBuffer(this.vertex, 0, bufferVertex)
      soit mappedAtCreation to set data and after we unmapped. 
      Cette derniere methode permet de creer un buffer avec une size multiple de 4 plus facilement
    */

    this.vertex = device.createBuffer({
      label: "vertex buffer",
      // size: bufferVertex.byteLength,
      size: Math.ceil(bufferVertex.byteLength / 4) * 4,
      mappedAtCreation: true,
      usage: window.GPUBufferUsage.VERTEX | window.GPUBufferUsage.COPY_DST,
    });

    const mappedBufferArray = new Float32Array(this.vertex.getMappedRange()); // position vec3 / normal vec3 / tex v2
    mappedBufferArray.set(
      new Float32Array(bufferVertex, 0, this.vertex.byteLength)
    );
    this.vertex.unmap();

    this.indexes = device.createBuffer({
      label: "index buffer",
      // size: bufferIndex.byteLength,
      size: Math.ceil(bufferIndex.byteLength / 4) * 4,
      mappedAtCreation: true,
      usage: window.GPUBufferUsage.INDEX | window.GPUBufferUsage.COPY_DST,
    });

    const mappedBufferArray2 = new Uint16Array(this.indexes.getMappedRange());
    mappedBufferArray2.set(
      new Uint16Array(bufferIndex, 0, this.indexes.byteLength)
    );
    this.indexes.unmap();

    this.layout = {
      arrayStride,
      attributes,
    };
  }

  setupFaceColorPick = (device, data) => {
    this.faceColor = device.createBuffer({
      label: "face color buffer",
      size: Float32Array.BYTES_PER_ELEMENT * data.length,
      mappedAtCreation: true,
      usage: window.GPUBufferUsage.VERTEX | window.GPUBufferUsage.COPY_DST,
    });
    const mappedBufferArray3 = new Float32Array(
      this.faceColor.getMappedRange()
    ); // color float
    mappedBufferArray3.set(data);
    this.faceColor.unmap();
  };

  setupForFaces(device, primitive, colorPerFace) {
    const { arrayStride, bufferVertex, bufferIndex, indexCount } = primitive;

    const nbFloatPerVertex = arrayStride / Float32Array.BYTES_PER_ELEMENT;
    const dataPerVertex = new Map();

    let index = 0;
    for (let i = 0; i < bufferVertex.length; i += nbFloatPerVertex, index++) {
      dataPerVertex.set(index, bufferVertex.slice(i, i + nbFloatPerVertex));
    }

    const bufferData = [];
    bufferIndex.forEach((index, i) => {
      const color = colorPerFace[i];
      const vertexData = [...dataPerVertex.get(index), color];
      bufferData.push(...vertexData);
    });

    const buff = new Float32Array(bufferData);

    this.faceBuffer = device.createBuffer({
      label: "vertex buffer per face",
      // size: bufferVertex.byteLength,
      size: Math.ceil(buff.byteLength / 4) * 4,
      mappedAtCreation: true,
      usage: window.GPUBufferUsage.VERTEX | window.GPUBufferUsage.COPY_DST,
    });

    const mappedBufferArray = new Float32Array(
      this.faceBuffer.getMappedRange()
    ); // position vec3 / normal vec3 / tex v2 / face color f
    mappedBufferArray.set(
      new Float32Array(buff, 0, this.faceBuffer.byteLength)
    );
    this.faceBuffer.unmap();

    this.faceDrawCount = indexCount;
  }

  getFaceBuffer = () => this.faceBuffer;
  getFaceBufferCount = () => this.faceDrawCount;

  getVertexBuffer = () => this.vertex;

  getIndexBuffer = () => this.indexes;

  getFaceColorBuffer = () => this.faceColor;

  getLayout = () => this.layout;

  getIndexCount = () => this.indexCount;
}

export default BufferGltf;
