class BufferMaterial {
  constructor() {
    this.bindGroups = new Map();
  }

  setup(device, materials, layout) {
    let i = 0;
    for (let material of materials) {
      const buffer = this.setupOne(device, material);
      this.bindGroups.set(
        i,
        device.createBindGroup({
          label: "bind group material",
          layout,
          entries: [
            {
              binding: 0, // Material uniforms
              resource: { buffer },
            },
          ],
        }),
      );
      i++;
    }
  }

  setupOne(device, material) {
    const buffer = device.createBuffer({
      size: 12 * Float32Array.BYTES_PER_ELEMENT, // 9 values but need 4 multiple
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    const bufferArray = new Float32Array(buffer.getMappedRange());

    const baseColorFactor = material.pbrMetallicRoughness?.baseColorFactor || [
      1, 1, 1, 1,
    ];
    const emissiveFactor = material.emissiveFactor || [1, 1, 1];
    const metallicFactor = material.pbrMetallicRoughness?.metallicFactor ?? 0.5;
    const roughnessFactor =
      material.pbrMetallicRoughness?.roughnessFactor ?? 0.5;
    const array = [
      ...baseColorFactor,
      ...emissiveFactor,
      metallicFactor,
      roughnessFactor,
    ];
    bufferArray.set(array);

    buffer.unmap();

    // const data = new Uint8Array([255, 255, 255, 255])
    // const texture = device.createTexture({
    //   size: { width: 1, height: 1 },
    //   format: 'rgba8unorm',
    //   usage: window.GPUTextureUsage.TEXTURE_BINDING | window.GPUTextureUsage.COPY_DST,
    // })
    // device.queue.writeTexture({ texture }, data, {}, { width: 1, height: 1 })

    return buffer;
  }

  getBindGroups = () => this.bindGroups;
  getBindGroup = (key) => this.bindGroups.get(key);
}

export default BufferMaterial;
