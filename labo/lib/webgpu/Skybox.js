import Mat4 from '../utils/maths/Mat4';

export class Skybox {
  constructor(context, sampleCount = 4) {
    this.context = context;
    this.pipeline = undefined;
    this.sampleCount = sampleCount;
  }

  setup(program, cubeTexture, targets, depthFormat) {
    const device = this.context.getDevice();

    this.pipeline = device.createRenderPipeline({
      label: 'skybox no attributes',
      layout: 'auto',
      vertex: {
        module: program,
        entryPoint: 'v_main',
      },
      fragment: {
        module: program,
        entryPoint: 'f_main',
        targets,
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less-equal', // we clear the depth texture to 1.0, and render the sybox at z 1.0
        format: depthFormat,
      },
      multisample: {
        count: this.sampleCount,
      },
    });

    const uniformBufferSize = 16 * Float32Array.BYTES_PER_ELEMENT; // 4x4 matrix
    this.uniformBuffer = device.createBuffer({
      label: 'uniforms',
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.uniformValues = new Float32Array(uniformBufferSize / 4);

    this.viewDirectionProjectionInverseValue = this.uniformValues.subarray(
      0,
      16, // mat4x4
    );

    this.bindGroup = device.createBindGroup({
      label: 'bind group for skybox triangle',
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: this.uniformBuffer } },
        { binding: 1, resource: cubeTexture.getSampler(device) },
        { binding: 2, resource: cubeTexture.getView() },
      ],
    });
  }

  // we can use the same render passs descriptor than the scene
  // createRenderPassDescriptor() {
  //   this.renderPassDescriptor = {
  //     label: 'our basic skybox canvas renderPass',
  //     colorAttachments: [
  //       {
  //         resolveTarget: this.context.getCurrentTexture().createView(),
  //         clearValue: { r: 0, g: 0, b: 0, a: 0 },
  //         // view: <- to be filled out when we render
  //         loadOp: 'clear',
  //         storeOp: 'store',
  //       },
  //     ],
  //     depthStencilAttachment: {
  //       // view: <- to be filled out when we render
  //       depthClearValue: 1.0,
  //       depthLoadOp: 'clear',
  //       depthStoreOp: 'store',
  //     },
  //   };
  // }

  updateCamera(camera) {
    const device = this.context.getDevice();
    const viewProj = camera.getViewProjection();
    const viewProjInverse = new Mat4();
    viewProjInverse.setRaw(viewProj.get()).inverse();

    this.viewDirectionProjectionInverseValue.set(viewProjInverse.get());

    device.queue.writeBuffer(this.uniformBuffer, 0, this.uniformValues);
  }

  getPipeline() {
    return this.pipeline;
  }

  getBindGroup() {
    return this.bindGroup;
  }
}
