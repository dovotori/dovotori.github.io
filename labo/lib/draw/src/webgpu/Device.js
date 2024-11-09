class Device {
  constructor() {
    this.device = null;
    this.encoder = null;
  }

  async setup(adapter) {
    this.device = await adapter.requestDevice();
    this.encoder = this.device.createCommandEncoder();
  }

  get = () => this.device;

  getEncodeur = () => this.encoder;
}

export default Device;
