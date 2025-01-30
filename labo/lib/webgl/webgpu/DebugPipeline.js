import Mat4 from "../maths/Mat4";
import cube from "../primitives/cube";
import { blend } from "./constants";
import { GltfBindGroups } from "./GltfPipelineBindGroupLayout";

/*
  to remember:
  - uniform should be create for every pipeline (ex: camera uniform) 
  - on render, can reuse the same pass
  - need to update camera uniform
*/

export class DebugPipeline {
  constructor(context) {
    this.context = context;
    this.pipeline = undefined;
    this.buffers = {
      vertex: undefined,
      index: undefined,
    };
    this.transformUniformBindGroup = undefined;
    this.renderPassDescriptor = undefined;
    this.sampleCount = 4;
  }

  setup = async (program) => {
    const bufferVertex = new Float32Array(cube.position);
    const device = this.context.getDevice();
    this.buffers.vertex = device.createBuffer({
      label: "debug vertex buffer",
      size: Math.ceil(bufferVertex.byteLength / 4) * 4,
      mappedAtCreation: true,
      usage: window.GPUBufferUsage.VERTEX | window.GPUBufferUsage.COPY_DST,
    });

    const mappedBufferArray = new Float32Array(
      this.buffers.vertex.getMappedRange()
    );
    mappedBufferArray.set(bufferVertex);
    this.buffers.vertex.unmap();

    const bufferIndex = new Uint16Array(cube.indices);
    this.buffers.index = device.createBuffer({
      label: "debug index buffer",
      size: Math.ceil(bufferIndex.byteLength / 4) * 4,
      mappedAtCreation: true,
      usage: window.GPUBufferUsage.INDEX | window.GPUBufferUsage.COPY_DST,
    });

    const mappedBufferArray2 = new Uint16Array(
      this.buffers.index.getMappedRange()
    );
    mappedBufferArray2.set(bufferIndex);
    this.buffers.index.unmap();

    this.pipeline = await device.createRenderPipelineAsync({
      label: "Debug pipeline",
      layout: "auto",
      vertex: {
        module: program.vertex,
        entryPoint: "v_main",
        buffers: [
          {
            arrayStride: Float32Array.BYTES_PER_ELEMENT * 3, // 4 * 3 = 12
            attributes: [
              {
                format: "float32x3",
                offset: 0,
                shaderLocation: 0,
              },
            ],
          },
        ],
      },
      fragment: {
        module: program.fragment,
        entryPoint: "f_main",
        targets: [
          {
            format: "bgra8unorm",
            blend,
          },
        ],
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "back",
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth32float",
      },
      multisample: {
        count: this.sampleCount,
      },
    });

    this.setTransform(4, 4, 4);
  };

  setTransform(x, y, z) {
    const device = this.context.getDevice();
    const bufferUniform = device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * 16,
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    const bufferArray = new Float32Array(bufferUniform.getMappedRange());
    const model = new Mat4();
    model.identity().scale(0.1).translate(x, y, z);
    bufferArray.set(model.get());
    bufferUniform.unmap();

    this.transformUniformBindGroup = device.createBindGroup({
      label: "debug bind group transform",
      layout: this.pipeline.getBindGroupLayout(GltfBindGroups.TRANSFORM),
      entries: [
        {
          binding: 0,
          resource: { buffer: bufferUniform },
        },
      ],
    });
  }

  render = (pass, uniformCameraBindGroup) => {
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(GltfBindGroups.CAMERA, uniformCameraBindGroup);

    pass.setBindGroup(GltfBindGroups.TRANSFORM, this.transformUniformBindGroup);
    pass.setVertexBuffer(0, this.buffers.vertex);
    pass.setIndexBuffer(this.buffers.index, "uint16");
    pass.drawIndexed(cube.indices.length);
  };

  getBindGroupLayout = (index) => this.pipeline.getBindGroupLayout(index);
}
