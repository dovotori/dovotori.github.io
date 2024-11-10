import Animation from "../maths/Animation";
import BufferGltf from "./BufferGltf";
import BufferMaterial from "./BufferMaterial";
import BufferTransform from "./BufferTransform";
import { pixelToPickingColor } from "./Picking";
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

  async setup(gltf, program, canvasSize, isDebug = false) {
    const device = this.context.getDevice();

    const nodes = gltf.get("nodes");
    this.nodes = nodes;

    this.matrixBuffersMaps = new Map();
    this.materialIndexes = new Map();

    console.log(gltf.get("meshes"));

    const meshBuffersMaps = new Map();
    this.facesPerMeshPerColorPicking = new Map();
    for (const [key, mesh] of gltf.get("meshes")) {
      let meshBuffers = [];
      const facesPerColorPicking = new Map();
      for (let primitive of mesh.primitives) {
        // attributes.length // 2 position/ normale // 3 position/normale/texture
        // a buffer store data of a mesh with the same material
        const buffer = new BufferGltf();
        buffer.setup(device, primitive);
        this.materialIndexes.set(buffer, primitive.material);
        meshBuffers.push(buffer);

        // face color pick
        const nbTrianglesFaces = primitive.bufferIndex.length / 3;
        const colorPerIndex = new Array();
        const pickingColorFacesIndexValues = Array.from({
          length: nbTrianglesFaces,
        })
          .fill(0)
          .map((_, i) => {
            const colorValue = pixelToPickingColor(i);
            facesPerColorPicking.set(i, colorValue);
            const floatValue = Number.parseFloat(colorValue);
            colorPerIndex.push([floatValue, floatValue, floatValue]); // x3 for each triangle vertex
            return floatValue;
          });

        if (key === 12) {
          // billboard poteau

          console.log({
            pickingColorFacesIndexValues,
            nbTrianglesFaces,
            colorPerIndex,
          });
        }

        buffer.setupFaceColorPick(device, colorPerIndex);
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
    if (!isDebug) {
      this.materialBuffer = new BufferMaterial();
      this.materialBuffer.setup(
        device,
        gltf.get("materials"),
        this.getBindGroupLayout(GltfBindGroups.MATERIAL)
      );
    }

    this.buildNodes(nodes, meshBuffersMaps);
    this.transformBinGroups = this.buildTransformBindGroups(
      this.getBindGroupLayout(GltfBindGroups.TRANSFORM)
    );

    this.textures.setup(device, this.context.getCanvasFormat(), canvasSize);
  }

  static getMatrix(node, nodes) {
    if (node.isInstance) {
      const refNode = nodes.get(node.children[0]);
      const matrix = BufferTransform.getNodeMatrix(refNode);
      const matrixInstance = BufferTransform.getNodeMatrix(node);
      return matrix.multiply(matrixInstance);
    }
    return BufferTransform.getNodeMatrix(node);
  }

  static getMeshId(node, nodes) {
    if (node.isInstance) {
      const refNode = nodes.get(node.children[0]);
      return refNode.mesh;
    }
    return node.mesh;
  }

  buildNodes(nodes, meshBuffersMaps) {
    this.nodesToDraw = new Map();
    this.nodesPerColorPicking = new Map();

    let index = 0;
    for (const [key, node] of nodes) {
      const meshId = GltfPipeline.getMeshId(node, nodes);

      if (meshId === undefined || node.isInstanceRef) continue;

      const matrix = GltfPipeline.getMatrix(node, nodes);
      const buffers = meshBuffersMaps.get(meshId);

      // const pickingColor = [
      //   ((colorIndex >> 0) & 0xff) / 0xff,
      //   ((colorIndex >> 8) & 0xff) / 0xff,
      //   ((colorIndex >> 16) & 0xff) / 0xff,
      //   ((colorIndex >> 24) & 0xff) / 0xff,
      // ];

      const pickingColor = pixelToPickingColor(index);

      this.nodesToDraw.set(key, {
        name: node.name,
        buffers,
        matrix,
        pickingColor: [Number.parseFloat(pickingColor), 0, 0, 1], // TODO can be only a float
      });

      this.nodesPerColorPicking.set(pickingColor, key);
      index++;
    }
    console.log(this.nodesToDraw);
  }

  buildTransformBindGroups(layoutTransform) {
    const device = this.context.getDevice();
    const groups = new Map();
    for (const [key, node] of this.nodesToDraw) {
      const transformBindGroup = !this.animations.isNodeHasAnimation(key)
        ? BufferTransform.setup(device, layoutTransform, {
            transformMatrix: node.matrix,
            // pickingColor: node.pickingColor, // TODO should only send this to picking pipeline
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

  drawModel = (device, pass, isDebug = false) => {
    // should sort primitives by material
    for (const [key, node] of this.nodesToDraw) {
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

        // MAT
        if (!isDebug) {
          pass.setBindGroup(
            GltfBindGroups.MATERIAL,
            this.materialBuffer.getBindGroup(
              this.materialIndexes.get(buffer) || 0
            )
          );
        }

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

  getDrawNodes = () => this.nodesToDraw;
  getAnimations = () => this.animations;
  getFirstBufferLayout = () => this.firstBufferLayout;

  getByPickColor = (color) => {
    console.log({ color });
    const nodeId = this.nodesPerColorPicking.get(color[0]);
    const node = this.nodes.get(nodeId);
    const drawNode = this.nodesToDraw.get(nodeId);
    console.log({ node, drawNode });
    return node;
  };
}
