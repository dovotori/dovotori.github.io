// utils to generate pipeline bind group layout
// maybe this should be written directly near the shader because it is very link to the shader code

export const GltfBindGroups = {
  CAMERA: 0,
  TRANSFORM: 1,
  MATERIAL: 2,
  LIGHT: 3,
};

// generate from https://webgpufundamentals.org/webgpu/lessons/resources/wgsl-offset-computer.html
export const buildBindGroupLayouts = (device, withShadow = false) => {
  const cameraUniformBindGroupLayout = device.createBindGroupLayout({
    label: "Camera Uniform Bind Group Layout",
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: "uniform",
          hasDynamicOffset: false,
          minBindingSize: 208,
        },
      },
      {
        binding: 1,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: "uniform",
          hasDynamicOffset: false,
        },
      },
    ],
  });

  const transformUniformBindGroupLayout = device.createBindGroupLayout({
    label: "Transform Uniform Bind Group Layout",
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: "uniform",
          hasDynamicOffset: false,
          // minBindingSize: 112,
        },
      },
    ],
  });

  const materialUniformBindGroupEntries = [
    {
      binding: 0,
      visibility: GPUShaderStage.FRAGMENT,
      buffer: {
        type: "uniform",
        hasDynamicOffset: false,
        minBindingSize: 48,
      },
    },
    {
      binding: 1,
      visibility: GPUShaderStage.FRAGMENT,
      sampler: {},
    },
    {
      binding: 2,
      visibility: GPUShaderStage.FRAGMENT,
      texture: {},
    },
  ];
  if (withShadow) {
    materialUniformBindGroupEntries.push(
      ...[
        {
          binding: 3,
          visibility: GPUShaderStage.FRAGMENT,
          buffer: {
            type: "uniform", // posLight
          },
        },
        {
          binding: 4,
          visibility: GPUShaderStage.FRAGMENT,
          sampler: { type: "comparison" }, // Comparison sampler
        },
        {
          binding: 5,
          visibility: GPUShaderStage.FRAGMENT,
          texture: { sampleType: "depth", viewDimension: "2d" }, // Depth texture
        },
      ],
    );
  }

  const materialUniformBindGroupLayout = device.createBindGroupLayout({
    label: "Material Uniform Bind Group Layout",
    entries: materialUniformBindGroupEntries,
  });

  const lightsStorageBindGroupLayout = device.createBindGroupLayout({
    label: "Lights Storage Bind Group Layout",
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.FRAGMENT,
        buffer: {
          type: "read-only-storage",
          hasDynamicOffset: false,
          minBindingSize: 0,
        },
      },
    ],
  });

  return {
    [GltfBindGroups.CAMERA]: cameraUniformBindGroupLayout,
    [GltfBindGroups.TRANSFORM]: transformUniformBindGroupLayout,
    [GltfBindGroups.MATERIAL]: materialUniformBindGroupLayout,
    [GltfBindGroups.LIGHT]: lightsStorageBindGroupLayout,
  };
};

export const buildShadowBindGroupLayouts = (device) => {
  const cameraUniformBindGroupLayout = device.createBindGroupLayout({
    label: "Shadow Camera Uniform Bind Group Layout",
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: {
          type: "uniform",
          hasDynamicOffset: false,
          minBindingSize: 208,
        },
      },
    ],
  });

  const transformUniformBindGroupLayout = device.createBindGroupLayout({
    label: "Shadow Transform Uniform Bind Group Layout",
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: "uniform",
          hasDynamicOffset: false,
          minBindingSize: 112,
        },
      },
    ],
  });
  return [cameraUniformBindGroupLayout, transformUniformBindGroupLayout];
};

export const buildPickingBindGroupLayouts = (device) => {
  const cameraUniformBindGroupLayout = device.createBindGroupLayout({
    label: "Picking Camera Uniform Bind Group Layout",
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX | GPUShaderStage.FRAGMENT,
        buffer: {
          type: "uniform",
          hasDynamicOffset: false,
          minBindingSize: 208,
        },
      },
    ],
  });

  const transformUniformBindGroupLayout = device.createBindGroupLayout({
    label: "Picking Transform Uniform Bind Group Layout",
    entries: [
      {
        binding: 0,
        visibility: GPUShaderStage.VERTEX,
        buffer: {
          type: "uniform",
          hasDynamicOffset: false,
          minBindingSize: 128,
        },
      },
    ],
  });
  return [cameraUniformBindGroupLayout, transformUniformBindGroupLayout];
};
