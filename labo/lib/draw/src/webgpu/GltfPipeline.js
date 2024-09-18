import Animation from "../maths/Animation";
import Mat4 from "../maths/Mat4";
import BufferGltf from "./BufferGltf";
import BufferMaterial from "./BufferMaterial";
import BufferTransform from "./BufferTransform";
import Pipeline from "./Pipeline";
import PipelineTextures from "./PipelineTextures";

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
    this.textures = new PipelineTextures();
  }

  async setup(gltf, program, canvasSize) {
    const device = this.context.getDevice();

    const nodes = gltf.get("nodes");

    this.matrixBuffersMaps = new Map();
    this.materialIndexes = new Map();

    const meshBuffersMaps = new Map();
    for (const [key, mesh] of gltf.get("meshes")) {
      let meshBuffers = [];
      for (let primitive of mesh.primitives) {
        // attributes.length // 2 position/ normale // 3 position/normale/texture
        // a buffer store data of a mesh with the same material
        const buffer = new BufferGltf();
        buffer.setup(device, primitive);
        this.materialIndexes.set(buffer, primitive.material);
        meshBuffers.push(buffer);
      }
      meshBuffersMaps.set(key, meshBuffers);
    }

    const [firstBuffer] = Array.from(meshBuffersMaps.values())[0];
    this.firstBufferLayout = firstBuffer.getLayout();

    await this.pipeline.setup(
      device,
      program,
      gltf.get("pipeline"),
      [this.firstBufferLayout], // we used the first layout because its fit all the mesh
      this.context.getCanvasFormat()
    );
    this.pipeline.setupRenderPassDescriptor();

    // animations
    this.animations = new Animation(gltf.get("animations"), nodes);

    // for material
    this.materialBuffer = new BufferMaterial();
    this.materialBuffer.setup(
      device,
      gltf.get("materials"),
      this.getBindGroupLayout(GltfBindGroups.MATERIAL)
    );

    this.buildNodes(nodes, meshBuffersMaps);
    this.transformBinGroups = this.buildTransformBindGroups(
      this.getBindGroupLayout(GltfBindGroups.TRANSFORM)
    );

    this.textures.setup(device, this.context.getCanvasFormat(), canvasSize);
  }

  // INSTANCING if node have one children and don't have a mesh and have a transform
  static isInstanceNode(node) {
    const {
      rotation: nodeRotation,
      translation: nodeTranslation,
      scale: nodeScale,
    } = node;
    return (
      node.children?.length === 1 &&
      node.mesh === undefined &&
      (!!nodeTranslation || !!nodeRotation || !!nodeScale)
    );
  }

  static handleInstancing(node, nodes) {
    if (GltfPipeline.isInstanceNode(node)) {
      const refNode = nodes.get(node.children[0]);
      const newNode = {
        ...node,
        mesh: refNode.mesh,
        translation: refNode.translation,
        scale: refNode.scale,
        rotation: refNode.rotation,
        matrix: refNode.matrix,
        instanceTransform: {
          translation: node.translation,
          scale: node.scale,
          rotation: node.rotation,
        },
      };
      return newNode;
    }
    return node;
  }

  buildNodes(nodes, meshBuffersMaps) {
    this.nodes = new Map();
    let colorIndex = 1;
    for (const [key, _node] of nodes) {
      const node = GltfPipeline.handleInstancing(_node, nodes);
      const meshId = node.mesh;
      if (meshId === undefined) continue;
      const buffers = meshBuffersMaps.get(meshId);
      const matrix = BufferTransform.getNodeMatrix(node);

      if (node.instanceTransform) {
        matrix.multiply(BufferTransform.getNodeMatrix(node.instanceTransform));
      }

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
      });
      colorIndex++;
    }
  }

  buildTransformBindGroups(layoutTransform) {
    const device = this.context.getDevice();
    const groups = new Map();
    for (const [key, node] of this.nodes) {
      const transformBindGroup = !this.animations.isNodeHasAnimation(key)
        ? BufferTransform.setup(device, layoutTransform, {
            transformMatrix: node.matrix,
            pickingColor: node.pickingColor,
          })
        : undefined;
      groups.set(key, transformBindGroup);
    }
    return groups;
  }

  updateAnimations(time) {
    if (this.animations) {
      this.animations.update(time);
    }
  }

  update() {
    this.pipeline.update(
      this.context.getCurrentTexture().createView(),
      this.textures.getRenderTargetView(),
      this.textures.getDepthTextureView()
    );
  }

  drawModel = (device, pass) => {
    // should sort primitives by material
    for (const [key, node] of this.nodes) {
      node.buffers.forEach((buffer) => {
        let transformBindGroup = this.transformBinGroups.get(key);
        if (!transformBindGroup) {
          // animations
          const finalMatrix = this.animations.handleLocalTransform(key);
          transformBindGroup = BufferTransform.setup(
            device,
            this.getBindGroupLayout(GltfBindGroups.TRANSFORM),
            {
              transformMatrix: finalMatrix,
              pickingColor: node.pickingColor,
            }
          );
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

  resize = (size) => {
    this.textures.resize(
      this.context.getDevice(),
      this.context.getCanvasFormat(),
      size
    );
  };

  getBindGroupLayout = (bindGroupType) =>
    this.pipeline.getBindGroupLayout(bindGroupType);

  getRenderPassDescriptor = () => this.pipeline.getRenderPassDescriptor();

  get = () => this.pipeline.get();

  getNodes = () => this.nodes;
  getAnimations = () => this.animations;
  getFirstBufferLayout = () => this.firstBufferLayout;
}
