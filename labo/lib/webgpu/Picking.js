import { defaultColorAttachment } from "./constants";
import { buildPickingBindGroupLayouts, GltfBindGroups } from "./GltfPipelineBindGroupLayout";
import PipelineTextures from "./PipelineTextures";

export class Picking {
  constructor(context) {
    this.context = context;
    this.bufferSize = 16; // 1 pixel color value 4 * 4
    this.pipeline = undefined;
    this.colorTexture = undefined;
    this.textures = new PipelineTextures();
    this.texSize = {
      width: 1,
      height: 1,
    };
  }

  createTexture(size) {
    const device = this.context.getDevice();
    this.colorTexture = device.createTexture({
      label: "picking texture",
      format: "rgba32float",
      size,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    });

    this.depthTexture = device.createTexture({
      label: "picking depth texture",
      format: "depth32float",
      size,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
    });
  }

  async setup(program, canvasSize, buffersLayout) {
    const device = this.context.getDevice();

    // const buffers = buffersLayout;
    // // TODO should insert face picking color info space in layout
    // // should match vertex attribute structures
    // const addFaceColorLayout = {
    //   arrayStride: 8,
    //   attributes: [
    //     {
    //       format: "float32",
    //       offset: 0,
    //       shaderLocation: 3,
    //     },
    //   ],
    // };

    // buffers.push(addFaceColorLayout);

    // face color
    const buffers = [
      {
        arrayStride: buffersLayout[0].arrayStride + Float32Array.BYTES_PER_ELEMENT,
        attributes: [
          ...buffersLayout[0].attributes,
          {
            format: "float32",
            offset: 32,
            shaderLocation: 3,
          },
        ],
      },
    ];

    console.log({ buffers });

    const bindGroupLayouts = buildPickingBindGroupLayouts(device);

    this.pipeline = await device.createRenderPipelineAsync({
      label: "PickingPipeline",
      layout: device.createPipelineLayout({
        label: "Picking Pipeline layout",
        bindGroupLayouts: [
          bindGroupLayouts[GltfBindGroups.CAMERA],
          bindGroupLayouts[GltfBindGroups.TRANSFORM],
        ],
      }),
      vertex: {
        module: program.vertex,
        entryPoint: "v_main",
        buffers,
      },
      fragment: {
        module: program.fragment,
        entryPoint: "f_main",
        targets: [
          {
            format: "rgba32float",
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
    });

    this.createTexture(this.texSize);

    this.destinationBuffer = device.createBuffer({
      label: "PickDestination",
      size: this.bufferSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    this.renderPassDescriptor = {
      label: "MousePickRenderPass",
      colorAttachments: [defaultColorAttachment],
      depthStencilAttachment: {
        view: null,
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
        stencilClearValue: 0,
      },
    };

    this.textures.setup(device, this.context.getCanvasFormat(), canvasSize);
  }

  setDrawModel(drawModel) {
    this.drawModel = drawModel;
  }

  render = (uniformCameraBindGroup) => {
    const device = this.context.getDevice();
    const encoder = device.createCommandEncoder({
      label: "PickingCommandEncoder",
    });

    this.renderPassDescriptor.colorAttachments[0].view = this.colorTexture.createView();
    this.renderPassDescriptor.depthStencilAttachment.view = this.depthTexture.createView();

    const pass = encoder.beginRenderPass(this.renderPassDescriptor);

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(GltfBindGroups.CAMERA, uniformCameraBindGroup);

    if (this.drawModel) {
      this.drawModel(device, pass);
    } else {
      console.warn("drawModel not define for picking");
    }

    pass.end();

    device.queue.submit([encoder.finish()]);
  };

  // https://webglfundamentals.org/webgl/lessons/webgl-picking.html
  // https://github.com/ghadeeras/ghadeeras.github.io/blob/master/src/scalar-field/picker.gpu.ts
  pick = async (origin, uniformCameraBindGroup, nodes, animations) => {
    const device = this.context.getDevice();
    const encoder = device.createCommandEncoder({
      label: "PickingCommandEncoder",
    });

    this.renderPassDescriptor.colorAttachments[0].view = this.colorTexture.createView();
    this.renderPassDescriptor.depthStencilAttachment.view = this.depthTexture.createView();

    const pass = encoder.beginRenderPass(this.renderPassDescriptor);
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(GltfBindGroups.CAMERA, uniformCameraBindGroup);
    this.drawModel(device, pass, nodes, animations);
    pass.end();

    // should be between pass end and encoder finish
    const data = await this.capturePixel(origin, encoder);

    device.queue.submit([encoder.finish()]);

    return data;
  };

  // private
  capturePixel = async (origin, encoder) => {
    encoder.copyTextureToBuffer(
      {
        texture: this.colorTexture,
        origin,
      },
      {
        buffer: this.destinationBuffer,
        bytesPerRow: 256,
      },
      {
        width: 1,
        height: 1,
      },
    );

    await this.destinationBuffer.mapAsync(
      GPUMapMode.READ,
      0, // Offset
      this.bufferSize, // Length
    );

    const mappedData = new Float32Array(this.destinationBuffer.getMappedRange(0, this.bufferSize));

    // need to copy data before the unmap (delete)
    const data = [...mappedData];

    this.destinationBuffer.unmap();

    // it seems to have async problem, the 2nd click is accurate
    console.log(data, origin);
    return [getNodePickingColor(data[0]), getNodePickingColor(data[1]), 0, 1];
  };

  drawModel = (_device, pass, nodes, _animations) => {
    // should sort primitives by material
    for (const [key, node] of nodes) {
      node.buffers.forEach((buffer) => {
        const { hasAnimation, transform } = this.transformBinGroups.get(key);
        if (hasAnimation) {
          return;

          // animations TODO need a way to share info from GltfPipeline
          // const finalMatrix = animations.handleLocalTransform(key); // TODO need to update or pass
          // transformBindGroup = BufferTransform.setup(
          //   device,
          //   this.getBindGroupLayout(GltfBindGroups.TRANSFORM),
          //   {
          //     transformMatrix: finalMatrix,
          //     pickingColor: node.pickingColor,
          //   }
          // );
        }

        pass.setBindGroup(GltfBindGroups.TRANSFORM, transform.getBindGroup());
        // pass.setVertexBuffer(0, buffer.getVertexBuffer());
        // pass.setVertexBuffer(1, buffer.getFaceColorBuffer());
        // pass.setIndexBuffer(buffer.getIndexBuffer(), "uint16");
        // pass.drawIndexed(buffer.getIndexCount());
        pass.setVertexBuffer(0, buffer.getFaceBuffer());
        pass.draw(buffer.getFaceBufferCount());
      });
    }
  };

  resize = (size) => {
    this.textures.resize(this.context.getDevice(), this.context.getCanvasFormat(), size);
    this.createTexture(size);
    this.texSize = size;
  };

  setTransformBindGroups(groups) {
    this.transformBinGroups = groups;
  }

  getBindGroupLayout = (index) => this.pipeline.getBindGroupLayout(index);

  getColorTexture = () => this.colorTexture;
}

const PICKING_FLOAT = 0.000001;
// const PICKING_FLOAT = 0.001;

export const pixelToPickingColor = (index) => {
  // const pickingColor = [
  //   ((colorIndex >> 0) & 0xff) / 0xff,
  //   ((colorIndex >> 8) & 0xff) / 0xff,
  //   ((colorIndex >> 16) & 0xff) / 0xff,
  //   ((colorIndex >> 24) & 0xff) / 0xff,
  // ];
  const colorIndex = PICKING_FLOAT + index * PICKING_FLOAT;
  return getNodePickingColor(colorIndex);
};

export const getNodePickingColor = (pixelValue) => {
  return Number.parseFloat(pixelValue).toFixed(6);
};
