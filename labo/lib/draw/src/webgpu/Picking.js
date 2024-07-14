import { GltfBindGroups } from "./GltfPipeline";

export class Picking {
  constructor(context, drawModel, uniformCameraBindGroup, uniformCameraBuffer) {
    this.context = context;
    this.drawModel = drawModel;
    this.pickBufferSize = 16;
    this.pickingPipeline = undefined;
    this.pickingColorTexture = undefined;
    this.uniformCameraBindGroup = uniformCameraBindGroup;
    this.uniformCameraBuffer = uniformCameraBuffer;
  }

  async setup(programs, canvasSize, buffersLayout) {
    const device = this.context.getDevice();

    console.log(programs);

    this.pickingPipeline = await device.createRenderPipelineAsync({
      label: "PickingPipeline",
      layout: "auto",
      vertex: {
        module: programs.v_picking.get(),
        entryPoint: "v_main",
        buffers: buffersLayout,
      },
      fragment: {
        module: programs.f_picking.get(),
        entryPoint: "f_main",
        targets: [
          {
            format: this.context.getCanvasFormat(),
          },
        ],
      },
      // depthStencil: this.depthTexture.depthState(),
      primitive: {
        topology: "triangle-list",
      },
    });

    this.pickingColorTexture = device.createTexture({
      format: "rgba32float",
      size: canvasSize,
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.COPY_SRC,
    });

    this.pickDestinationBuffer = device.createBuffer({
      label: "PickDestination",
      size: this.pickBufferSize,
      usage: GPUBufferUsage.COPY_DST | GPUBufferUsage.MAP_READ,
    });

    this.renderPassDescriptor = {
      label: "MousePick",
      colorAttachments: [
        {
          view: null,
          // resolveTarget: null, // context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: "clear", // 'load' -> draw hover / 'clear'
          storeOp: "store", // 'store' -> save // 'discard' maybe for save in tex
        },
      ],
    };
  }

  pick = async (x, y) => {
    if (!this.pickingPipeline) return;

    // https://webglfundamentals.org/webgl/lessons/webgl-picking.html
    // https://github.com/ghadeeras/ghadeeras.github.io/blob/master/src/scalar-field/picker.gpu.ts
    const device = this.context.getDevice();
    const encoder = device.createCommandEncoder();

    this.renderPassDescriptor.colorAttachments[0].view = this.context
      .getCurrentTexture()
      .createView();
    // this.pickingColorTexture.createView();

    const pass = encoder.beginRenderPass(this.renderPassDescriptor);

    pass.setPipeline(this.pickingPipeline);
    pass.setBindGroup(GltfBindGroups.CAMERA, this.uniformCameraBindGroup);

    this.drawModel(device, pass, this.pickingPipeline);

    // const origin = {
    //   x,
    //   y,
    // };

    // encoder.copyTextureToBuffer(
    //   {
    //     texture: this.pickingColorTexture,
    //     origin,
    //   },
    //   {
    //     buffer: this.pickDestinationBuffer,
    //     bytesPerRow: 256,
    //   },
    //   {
    //     width: 1,
    //     height: 1,
    //   }
    // );

    pass.end();

    device.queue.submit([encoder.finish()]);

    // await this.pickDestinationBuffer.mapAsync(
    //   GPUMapMode.READ,
    //   0, // Offset
    //   this.pickBufferSize // Length
    // );
    // const copyArrayBuffer = this.pickDestinationBuffer.getMappedRange(
    //   0,
    //   this.pickBufferSize
    // );
    // const data = copyArrayBuffer.slice(0);
    // this.pickDestinationBuffer.unmap();

    // console.log(new Float32Array(data), { origin });
  };
}
