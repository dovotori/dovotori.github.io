export class ComputeProcess {
  pipeline: GPUComputePipeline;
  passDescriptor: GPUComputePassDescriptor;
  workgroupCount: number;

  constructor(device: GPUDevice, shaderCode: string, workgroupCount: number = 100) {
    const computeShaderModule = device.createShaderModule({
      code: shaderCode,
      label: "Compute Shader",
    });

    this.pipeline = device.createComputePipeline({
      layout: "auto",
      label: "Compute Pipeline",
      compute: {
        module: computeShaderModule,
        entryPoint: "main",
      },
    });

    this.passDescriptor = {
      label: "Compute Pass description",
    };

    this.workgroupCount = workgroupCount;
  }

  render(commandEncoder: GPUCommandEncoder, bindGroups: GPUBindGroup[]) {
    const computePass = commandEncoder.beginComputePass(this.passDescriptor);
    computePass.setPipeline(this.pipeline);
    bindGroups.forEach((bg, index) => {
      computePass.setBindGroup(index, bg);
    });
    computePass.dispatchWorkgroups(this.workgroupCount);
    computePass.end();
  }

  getBindGroupLayout(index: number = 0): GPUBindGroupLayout {
    return this.pipeline.getBindGroupLayout(index);
  }
}
