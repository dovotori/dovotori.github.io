import { blend } from "./constants";

export class DebugTexture {
  constructor(context) {
    this.context = context;
    this.depthTextureFormat = "depth32float";
    this.size = {
      width: 5,
      height: 7,
    };
  }

  setup(program, size) {
    this.size = size;
    const device = this.context.getDevice();
    this.pipeline = device.createRenderPipeline({
      label: "DebugTexturePipeline",
      layout: "auto",
      vertex: {
        module: program.vertex,
        entryPoint: "v_main",
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
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: this.depthTextureFormat,
      },
      multisample: {
        count: 4,
      },
    });

    this.texture = device.createTexture({
      label: "DebugTextureTexture",
      size: this.size,
      format: "rgba8unorm",
      usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
    });

    this.updateTexture();

    this.bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: device.createSampler() },
        { binding: 1, resource: this.texture.createView() },
      ],
    });
  }

  setData() {
    const _ = [255, 0, 0, 255]; // red
    const y = [255, 255, 0, 255]; // yellow
    const b = [0, 0, 255, 255]; // blue

    const getRandonCase = () => {
      return [_, y, b][Math.floor(Math.random() * 3)];
    };

    const textureData = new Uint8Array(
      Array.from({ length: this.size.height })
        .map(() => Array.from({ length: this.size.width }).map(getRandonCase))
        .flat(2)
    );
    return textureData;
  }

  setTexture(texture) {
    const device = this.context.getDevice();
    this.bindGroup = device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: device.createSampler() },
        { binding: 1, resource: texture.createView() },
      ],
    });
  }

  updateTexture() {
    const device = this.context.getDevice();
    device.queue.writeTexture(
      { texture: this.texture },
      this.setData(),
      { bytesPerRow: this.size.width * 4 },
      this.size
    );
  }

  render(pass) {
    pass.setPipeline(this.pipeline);
    pass.setBindGroup(0, this.bindGroup);
    pass.draw(6); // call our vertex shader 6 times
  }
}
