class Program {
  constructor() {
    this.program = null;
  }

  setup(device, label, code) {
    this.program = device.createShaderModule({
      label,
      code,
    });
  }

  get = () => this.program;
}

export default Program;
