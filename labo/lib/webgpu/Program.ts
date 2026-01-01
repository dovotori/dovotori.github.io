class Program {
  program: GPUShaderModule | null = null;

  setup(device: GPUDevice, label: string, code: string) {
    this.program = device.createShaderModule({ label, code });
  }

  get(): GPUShaderModule | null {
    return this.program;
  }
}

export default Program;
