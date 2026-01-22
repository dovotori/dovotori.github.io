import { shadowCompareSample } from "./constants";
import { buildShadowBindGroupLayouts, GltfBindGroups } from "./GltfPipelineBindGroupLayout";

export class Shadow {
  constructor(context) {
    this.context = context;
    this.pipeline = undefined;
    this.texSize = {
      width: 2048,
      height: 2048,
    };
    this.textureDepthView;
  }

  async setup(program) {
    const device = this.context.getDevice();

    const tmpLayout = [
      {
        arrayStride: 32,
        attributes: [
          {
            shaderLocation: 0,
            format: "float32x3",
            offset: 0,
          },
          {
            shaderLocation: 1,
            format: "float32x3",
            offset: 12,
          },
          {
            shaderLocation: 2,
            format: "float32x2",
            offset: 24,
          },
        ],
      },
    ];

    const bindGroupLayouts = buildShadowBindGroupLayouts(device);

    this.pipeline = await device.createRenderPipelineAsync({
      label: "ShadowPipeline",
      layout: device.createPipelineLayout({
        label: "Shadow Pipeline layout",
        bindGroupLayouts,
      }),
      vertex: {
        module: program.vertex,
        entryPoint: "v_main",
        buffers: tmpLayout,
      },
      primitive: {
        topology: "triangle-list",
        cullMode: "back",
      },
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: "less",
        format: "depth32float",
      },
    });

    this.depthTexture = device.createTexture({
      label: "shadow depth texture",
      size: { width: 2048, height: 2048, depthOrArrayLayers: 1 },
      format: "depth32float", // Depth texture format
      usage: GPUTextureUsage.RENDER_ATTACHMENT | GPUTextureUsage.TEXTURE_BINDING,
    });

    this.textureDepthView = this.depthTexture.createView({
      dimension: "2d", // Specifies the texture dimension (2D texture)
      format: "depth32float", // Depth format
      aspect: "depth-only", // Correct aspect for depth textures
    });

    this.renderPassDescriptor = {
      label: "Shadow render pass",
      colorAttachments: [], // no fragment shader, we just want depth map
      depthStencilAttachment: {
        view: this.textureDepthView,
        depthClearValue: 1.0,
        depthLoadOp: "clear",
        depthStoreOp: "store",
        stencilClearValue: 0,
      },
    };
  }

  render = (uniformCameraBindGroup, nodes, animations) => {
    const device = this.context.getDevice();
    const encoder = device.createCommandEncoder({
      label: "ShadowCommandEncoder",
    });

    const pass = encoder.beginRenderPass(this.renderPassDescriptor);

    pass.setPipeline(this.pipeline);
    pass.setBindGroup(GltfBindGroups.CAMERA, uniformCameraBindGroup);

    this.drawModel(device, pass, nodes, animations);

    pass.end();

    device.queue.submit([encoder.finish()]);
  };

  drawModel = (_device, pass, nodes, _animations) => {
    // should sort primitives by material
    for (const [key, node] of nodes) {
      node.buffers.forEach((buffer) => {
        const { hasAnimation, transform } = this.transformBinGroups.get(key);
        if (hasAnimation) {
          return;
          // animations
          // const finalMatrix = animations.handleLocalTransform(key); // TODO need to update or pass
          // transformBindGroup = BufferTransform.setup(
          //   device,
          //   this.getBindGroupLayout(GltfBindGroups.TRANSFORM),
          //   {
          //     transformMatrix: finalMatrix,
          //     pickingColor: node.pickingColor,
          //   }
          // );
        }

        pass.setBindGroup(GltfBindGroups.TRANSFORM, transform.getBindGroup());
        pass.setVertexBuffer(0, buffer.getVertexBuffer());
        pass.setVertexBuffer(1, buffer.getFaceColorBuffer());
        pass.setIndexBuffer(buffer.getIndexBuffer(), "uint16");
        pass.drawIndexed(buffer.getIndexCount());
      });
    }
  };

  setTransformBindGroups(groups) {
    this.transformBinGroups = groups;
  }

  getBindGroupLayout = (index) => this.pipeline.getBindGroupLayout(index);

  getDepthTexture = () => this.depthTexture;
  getDepthTextureView = () => this.textureDepthView;
  getSize = () => this.texSize;

  getShadowMapBindGroupEntries(device, lightPosition) {
    const buffer = device.createBuffer({
      label: "LightPositionBuffer",
      size: 3 * Float32Array.BYTES_PER_ELEMENT,
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
      mappedAtCreation: true,
    });

    const bufferArray = new Float32Array(buffer.getMappedRange());
    bufferArray.set(lightPosition);
    buffer.unmap();

    return [
      {
        binding: 3,
        resource: { buffer },
      },
      {
        binding: 4,
        resource: device.createSampler(shadowCompareSample),
      },
      {
        binding: 5,
        resource: this.textureDepthView,
      },
    ];
  }
}
