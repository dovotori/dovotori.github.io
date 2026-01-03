import { chunkArray } from "../utils";
import { getBufferMinSize } from "./utils";

class BufferGltf {
  vertex = null;
  indexes = null;
  layout = null;
  faceColor = null;
  faceBuffer: GPUBuffer = null;
  faceDrawCount = 0;
  indexCount = 0;

  setup(device: GPUDevice, primitive, meshName: string) {
    const { arrayStride, attributes, bufferVertex, bufferIndex, indexCount } = primitive;

    this.indexCount = indexCount;

    // debug
    if (meshName === "Pull") {
      // 3 position, 3 normale, 2 texture, 4 joint, 4 weight
      const stride = arrayStride / Float32Array.BYTES_PER_ELEMENT;
      console.log({ bufferVertex, stride });
      const parts = chunkArray(bufferVertex, arrayStride / Float32Array.BYTES_PER_ELEMENT);

      const pos = [];
      const norm = [];
      const tex = [];
      const joint = [];
      const weight = [];

      for (const part of parts) {
        pos.push(part.slice(0, 3));
        norm.push(part.slice(3, 6));
        tex.push(part.slice(6, 8));
        joint.push(part.slice(8, 12));
        weight.push(part.slice(12, 16));
      }
      console.log({ pos, norm, tex, joint, weight });
    }

    /*
      Soit on utilise writeBuffer to put data on Gpu (mémoire du tampon), device.queue.writeBuffer(this.vertex, 0, bufferVertex)
      soit mappedAtCreation to set data and after we unmapped. 
      Cette derniere methode permet de creer un buffer avec une size multiple de 4 plus facilement
    */

    this.vertex = device.createBuffer({
      label: "vertex buffer",
      // size: bufferVertex.byteLength,
      size: getBufferMinSize(bufferVertex.byteLength),
      mappedAtCreation: true,
      usage: window.GPUBufferUsage.VERTEX | window.GPUBufferUsage.COPY_DST,
    });

    const mappedBufferArray = new Float32Array(this.vertex.getMappedRange()); // position vec3 / normal vec3 / tex v2
    mappedBufferArray.set(new Float32Array(bufferVertex, 0, this.vertex.byteLength));
    this.vertex.unmap();

    this.indexes = device.createBuffer({
      label: "index buffer",
      size: getBufferMinSize(bufferIndex.byteLength),
      mappedAtCreation: true,
      usage: window.GPUBufferUsage.INDEX | window.GPUBufferUsage.COPY_DST,
    });

    const mappedBufferIndexes = new Uint16Array(this.indexes.getMappedRange());
    mappedBufferIndexes.set(new Uint16Array(bufferIndex, 0, this.indexes.byteLength));
    this.indexes.unmap();

    this.layout = {
      arrayStride,
      attributes,
    };
  }

  setupFaceColorPick = (device: GPUDevice, data: Float32Array) => {
    this.faceColor = device.createBuffer({
      label: "face color buffer",
      size: Float32Array.BYTES_PER_ELEMENT * data.length,
      mappedAtCreation: true,
      usage: window.GPUBufferUsage.VERTEX | window.GPUBufferUsage.COPY_DST,
    });
    const mappedBufferArray3 = new Float32Array(this.faceColor.getMappedRange()); // color float
    mappedBufferArray3.set(data);
    this.faceColor.unmap();
  };

  setupForFaces(device: GPUDevice, primitive, colorPerFace: Float32Array) {
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
    const buffSize = getBufferMinSize(buff.byteLength);
    this.faceBuffer = device.createBuffer({
      label: "vertex buffer per face",
      size: buffSize,
      mappedAtCreation: true,
      usage: window.GPUBufferUsage.VERTEX | window.GPUBufferUsage.COPY_DST,
    });

    const mapped = new Float32Array(this.faceBuffer.getMappedRange(0, buffSize));
    mapped.set(buff);

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
