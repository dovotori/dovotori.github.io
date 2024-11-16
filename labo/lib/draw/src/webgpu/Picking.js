import BufferTransform from "./BufferTransform";
import { GltfBindGroups } from "./GltfPipeline";
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

    console.log(buffersLayout);
    // TODO should insert face picking color info space in layout
    // shoulkd match vertex attribute structures
    const addColorLayout = [
      buffersLayout[0],
      {
        format: "float32",
        offset: 0,
        shaderLocation: 0,
      },
    ];

    this.pipeline = await device.createRenderPipelineAsync({
      label: "PickingPipeline",
      layout: "auto",
      vertex: {
        module: program.vertex,
        entryPoint: "v_main",
        buffers: buffersLayout,
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
      label: "MousePick",
      colorAttachments: [
        {
          view: null,
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: "clear", // 'load' -> draw hover / 'clear'
          storeOp: "store", // 'store' -> save // 'discard' maybe for save in tex
        },
      ],
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

  render = (uniformCameraBindGroup, nodes, animations) => {
    const device = this.context.getDevice();
    const encoder = device.createCommandEncoder({
      label: "PickingCommandEncoder",
    });

    this.renderPassDescriptor.colorAttachments[0].view =
      this.colorTexture.createView();
    this.renderPassDescriptor.depthStencilAttachment.view =
      this.depthTexture.createView();

    const pass = encoder.beginRenderPass(this.renderPassDescriptor);

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(GltfBindGroups.CAMERA, uniformCameraBindGroup);

    this.drawModel(device, pass, nodes, animations);

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

    this.renderPassDescriptor.colorAttachments[0].view =
      this.colorTexture.createView();
    this.renderPassDescriptor.depthStencilAttachment.view =
      this.depthTexture.createView();

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
      }
    );

    await this.destinationBuffer.mapAsync(
      GPUMapMode.READ,
      0, // Offset
      this.bufferSize // Length
    );

    const mappedData = new Float32Array(
      this.destinationBuffer.getMappedRange(0, this.bufferSize)
    );

    // need to copy data before the unmap (delete)
    const data = [...mappedData];

    this.destinationBuffer.unmap();

    // it seems to have async problem, the 2nd click is accurate
    console.log(data, origin);
    return [getNodePickingColor(data[0]), 0, 0, 1];
  };

  drawModel = (device, pass, nodes, animations) => {
    // should sort primitives by material
    for (const [key, node] of nodes) {
      node.buffers.forEach((buffer) => {
        let transformBindGroup = this.transformBinGroups.get(key);
        if (!transformBindGroup) {
          // animations
          const finalMatrix = animations.handleLocalTransform(key);
          transformBindGroup = BufferTransform.setup(
            device,
            this.getBindGroupLayout(GltfBindGroups.TRANSFORM),
            {
              transformMatrix: finalMatrix,
              pickingColor: node.pickingColor,
            }
          );
        }

        pass.setBindGroup(GltfBindGroups.TRANSFORM, transformBindGroup);
        pass.setVertexBuffer(0, buffer.getVertexBuffer());
        pass.setIndexBuffer(buffer.getIndexBuffer(), "uint16");
        pass.drawIndexed(buffer.getIndexCount());
      });
    }
  };

  resize = (size) => {
    this.textures.resize(
      this.context.getDevice(),
      this.context.getCanvasFormat(),
      size
    );
    this.createTexture(size);
    this.texSize = size;
  };

  setTransformBindGroups(groups) {
    this.transformBinGroups = groups;
  }

  getBindGroupLayout = (index) => this.pipeline.getBindGroupLayout(index);

  getColorTexture = () => this.colorTexture;
}

const PICKING_FLOAT = 0.001;

export const pixelToPickingColor = (index) => {
  const colorIndex = PICKING_FLOAT + index * PICKING_FLOAT;
  return getNodePickingColor(colorIndex);
};

export const getNodePickingColor = (pixelValue) => {
  return Number.parseFloat(pixelValue).toFixed(3);
};
