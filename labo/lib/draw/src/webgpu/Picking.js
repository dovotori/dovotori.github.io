import BufferTransform from "./BufferTransform";
import { blend } from "./constants";
import { GltfBindGroups } from "./GltfPipeline";
import PipelineTextures from "./PipelineTextures";

export class Picking {
  constructor(context) {
    this.context = context;
    this.bufferSize = 16; // 1 pixel color value 4 * 4
    this.pipeline = undefined;
    this.colorTexture = undefined;
    this.textures = new PipelineTextures();
  }

  createTexture(size) {
    const device = this.context.getDevice();
    this.colorTexture = device.createTexture({
      // format: "rgba32float",
      // usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
      size,
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });

    this.depthTexture = device.createTexture({
      format: "rgba32float",
      size,
      usage:
        GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });
    this.size = size;
  }

  async setup(program, canvasSize, buffersLayout) {
    const device = this.context.getDevice();

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
            format: this.context.getCanvasFormat(),
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
      // multisample: {
      //   count: 4,
      // },
    });

    this.createTexture(canvasSize);

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
          resolveTarget: null, // context.getCurrentTexture().createView(),
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

    this.renderPassDescriptor.colorAttachments[0].resolveTarget = this.context
      .getCurrentTexture()
      .createView();
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

    this.renderPassDescriptor.colorAttachments[0].resolveTarget = this.context
      .getCurrentTexture()
      .createView();
    this.renderPassDescriptor.colorAttachments[0].view =
      this.colorTexture.createView();
    this.renderPassDescriptor.depthStencilAttachment.view =
      this.depthTexture.createView();

    const pass = encoder.beginRenderPass(this.renderPassDescriptor);

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(GltfBindGroups.CAMERA, uniformCameraBindGroup);

    this.drawModel(device, pass, nodes, animations);

    encoder.copyTextureToBuffer(
      {
        texture: this.colorTexture,
        origin: {
          x: origin.x,
          y: origin.y,
        },
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
    const copyArrayBuffer = this.destinationBuffer.getMappedRange(
      0,
      this.bufferSize
    );
    const data = copyArrayBuffer.slice(0);
    this.destinationBuffer.unmap();

    console.log(new Float32Array(data), origin);

    pass.end();

    device.queue.submit([encoder.finish()]);
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
  };

  setTransformBindGroups(groups) {
    this.transformBinGroups = groups;
  }

  getBindGroupLayout = (index) => this.pipeline.getBindGroupLayout(index);

  getColorTexture = () => this.colorTexture;
}
