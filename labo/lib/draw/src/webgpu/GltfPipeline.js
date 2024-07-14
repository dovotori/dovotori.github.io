import Animation from "../maths/Animation";
import BufferGltf from "./BufferGltf";
import BufferMaterial from "./BufferMaterial";
import BufferTransform from "./BufferTransform";
import Pipeline from "./Pipeline";

export const GltfBindGroups = {
  CAMERA: 0,
  TRANSFORM: 1,
  MATERIAL: 2,
  LIGHT: 3,
};

export class GltfPipeline {
  constructor(context, config) {
    this.context = context;
    this.config = config;
    this.pipeline = new Pipeline();
  }

  async setup(gltf, program) {
    const device = this.context.getDevice();

    const meshes = gltf.get("meshes");
    const pipeLineData = gltf.get("pipeline");
    const materials = gltf.get("materials");
    const nodes = gltf.get("nodes");

    this.buffers = new Set();
    this.matrixBuffersMaps = new Map();
    this.materialIndexes = new Map();

    const meshBuffersMaps = new Map();
    for (const [key, mesh] of meshes) {
      let meshBuffers = [];
      for (let primitive of mesh.primitives) {
        // attributes.length // 2 position/ normale // 3 position/normale/texture
        const buffer = new BufferGltf();
        buffer.setup(device, primitive);
        this.buffers.add(buffer);
        this.materialIndexes.set(buffer, primitive.material);
        meshBuffers.push(buffer);
      }
      meshBuffersMaps.set(key, meshBuffers);
    }

    const [firstBuffer] = this.buffers;

    await this.pipeline.setup(
      device,
      program.vertex,
      program.fragment,
      pipeLineData,
      [firstBuffer.getLayout()], // we used the first layout because its fit all the mesh
      this.context.getCanvasFormat()
    );
    this.pipeline.setupRenderPassDescriptor();

    // animations
    this.animations = new Animation(gltf.get("animations"), nodes);

    // for material
    this.materialBuffer = new BufferMaterial();
    const matLayout = this.getBindGroupLayout(GltfBindGroups.MATERIAL);
    this.materialBuffer.setup(device, materials, matLayout);

    this.buildNodes(nodes, meshBuffersMaps);
  }

  buildNodes(nodes, meshBuffersMaps) {
    const device = this.context.getDevice();
    const layoutTransform = this.getBindGroupLayout(GltfBindGroups.TRANSFORM);

    this.nodes = new Map();
    let colorIndex = 1;
    for (const [key, node] of nodes) {
      const meshId = node.mesh;
      if (meshId === undefined) continue;
      const buffers = meshBuffersMaps.get(meshId);
      const matrix = BufferTransform.getNodeMatrix(node);

      const pickingColor = [
        ((colorIndex >> 0) & 0xff) / 0xff,
        ((colorIndex >> 8) & 0xff) / 0xff,
        ((colorIndex >> 16) & 0xff) / 0xff,
        ((colorIndex >> 24) & 0xff) / 0xff,
      ];

      this.nodes.set(key, {
        name: node.name,
        buffers,
        matrix,
        pickingColor,
        transformBindGroup: !this.animations.isNodeHasAnimation(key)
          ? BufferTransform.setup(device, layoutTransform, {
              transformMatrix: matrix,
              pickingColor,
            })
          : undefined,
      });
      colorIndex++;
    }
  }

  updateAnimations(time) {
    if (this.animations) {
      this.animations.update(time);
    }
  }

  update(renderView, resolveView, depthView) {
    this.pipeline.update(renderView, resolveView, depthView);
  }

  drawModel = (device, pass) => {
    const layoutTransform = this.getBindGroupLayout(GltfBindGroups.TRANSFORM);

    // should sort primitives by material
    for (const [key, node] of this.nodes) {
      node.buffers.forEach((buffer) => {
        let transformBindGroup = node.transformBindGroup;
        if (!transformBindGroup) {
          // animations
          const finalMatrix = this.animations.handleLocalTransform(key);
          transformBindGroup = BufferTransform.setup(device, layoutTransform, {
            transformMatrix: finalMatrix,
            pickingColor: node.pickingColor,
          });
        }

        pass.setBindGroup(GltfBindGroups.TRANSFORM, transformBindGroup);
        pass.setBindGroup(
          GltfBindGroups.MATERIAL,
          this.materialBuffer.getBindGroup(
            this.materialIndexes.get(buffer) || 0
          )
        );
        pass.setVertexBuffer(0, buffer.getVertexBuffer());
        pass.setIndexBuffer(buffer.getIndexBuffer(), "uint16");
        pass.drawIndexed(buffer.getIndexCount());
      });
    }
  };

  getBindGroupLayout = (bindGroupType) =>
    this.pipeline.getBindGroupLayout(bindGroupType);

  getRenderPassDescriptor = () => this.pipeline.getRenderPassDescriptor();

  get = () => this.pipeline.get();
}
