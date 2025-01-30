// const MinifyMagnifyFilter = {
//   NEAREST: 9728,
//   LINEAR: 9729,
//   NEAREST_MIPMAP_NEAREST: 9984,
//   LINEAR_MIPMAP_NEAREST: 9985,
//   NEAREST_MIPMAP_LINEAR: 9986,
//   LINEAR_MIPMAP_LINEAR: 9987,
// };

class BufferMaterial {
  constructor() {
    this.bindGroups = new Map();
  }

  async setup(device, layout, materials, textures, depthMapBingGroupEntries) {
    console.log({ layout, materials, textures });

    const empty = await this.setupEmptyTexture(device);

    let i = 0;
    for (let [matIndex, material] of materials) {
      const buffer = this.setupUniformsBuffer(device, material);
      const entries = [
        {
          binding: 0, // Material uniforms
          resource: { buffer },
        },
      ];

      // has embedded texture
      if (material.pbrMetallicRoughness.baseColorTexture) {
        const texture = textures.get(
          material.pbrMetallicRoughness.baseColorTexture.index
        );
        const { sampler, textureView } = this.setupTexture(device, texture);
        entries.push(
          { binding: 1, resource: sampler },
          { binding: 2, resource: textureView }
        );
      } else {
        entries.push(
          { binding: 1, resource: empty.sampler },
          { binding: 2, resource: empty.textureView }
        );
      }

      entries.push(...depthMapBingGroupEntries);

      this.bindGroups.set(
        i,
        device.createBindGroup({
          label: "bind group material",
          layout,
          entries,
        })
      );
      i++;
    }
  }

  setupUniformsBuffer(device, material) {
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

    return buffer;
  }

  setupTexture(device, tex) {
    const size = [tex.imageData.width, tex.imageData.height];
    const texture = device.createTexture({
      label: "Material base color texture",
      size,
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });

    device.queue.copyExternalImageToTexture(
      { source: tex.imageData },
      { texture },
      size
    );

    // const img = new Image();
    // img.src = window.URL.createObjectURL(tex.blob);
    // document.body.appendChild(img);

    return {
      sampler: device.createSampler({
        addressModeU: "repeat",
        addressModeV: "repeat",
        magFilter: "linear", // tex.sampler.mafFilter
        minFilter: "nearest", // tex.sampler.minFilter
        mipmapFilter: "nearest",
        maxAnisotropy: 1,
      }),
      textureView: texture.createView({
        format: "rgba8unorm",
        dimension: "2d",
        aspect: "all",
      }),
    };
  }

  async setupEmptyTexture(device) {
    const width = 1;
    const height = 1;
    const imageData = new ImageData(width, height);
    imageData.data[0] = 255; // R (red)
    imageData.data[1] = 0; // G (green)
    imageData.data[2] = 0; // B (blue)
    imageData.data[3] = 255; // A (alpha)
    const imageBitmap = await createImageBitmap(imageData);
    const size = [imageData.width, imageData.height];

    const texture = device.createTexture({
      label: "Material empty texture",
      size,
      format: "rgba8unorm",
      usage:
        GPUTextureUsage.TEXTURE_BINDING |
        GPUTextureUsage.COPY_DST |
        GPUTextureUsage.RENDER_ATTACHMENT,
    });

    device.queue.copyExternalImageToTexture(
      { source: imageBitmap },
      { texture },
      size
    );

    return {
      sampler: device.createSampler(),
      textureView: texture.createView(),
    };
  }

  getBindGroups = () => this.bindGroups;
  getBindGroup = (key) => this.bindGroups.get(key);
}

export default BufferMaterial;
