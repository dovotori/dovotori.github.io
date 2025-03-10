import Animation from '../maths/Animation';
import Mat4 from '../maths/Mat4';
import Transform from '../maths/Transform';
import BufferGltf from './BufferGltf';
import BufferMaterial from './BufferMaterial';
import BufferTransform from './BufferTransform';
import { buildBindGroupLayouts, GltfBindGroups } from './GltfPipelineBindGroupLayout';
import { pixelToPickingColor } from './Picking';
import Pipeline from './Pipeline';
import PipelineTextures from './PipelineTextures';

export class GltfPipeline {
  constructor(context, config) {
    this.context = context;
    this.config = config;
    this.pipeline = new Pipeline();
    this.textures = new PipelineTextures();

    this.db = null;
  }

  async setupDb(db) {
    this.db = db;
    await this.db.setup();
  }

  async setup(gltf, program, canvasSize, depthMapBingGroupEntries, isDebug = false) {
    const device = this.context.getDevice();

    const nodes = gltf.get('nodes');
    this.nodes = nodes;

    this.matrixBuffersMaps = new Map();
    this.materialIndexes = new Map();

    const meshBuffersMaps = new Map();
    this.facesPerMeshPerColorPicking = new Map();

    const dataToSotore = [];

    for (const [key, mesh] of gltf.get('meshes')) {
      let meshBuffers = [];
      const facesPerColorPicking = new Map();

      let meshFaceIndex = 0; // use this index because mesh can have multiple primitives

      // a mesh can have multiple primitives because the material is different
      for (let primitive of mesh.primitives) {
        // attributes.length // 2 position/ normale // 3 position/normale/texture
        // a buffer store data of a mesh with the same material
        const buffer = new BufferGltf();
        buffer.setup(device, primitive);
        this.materialIndexes.set(buffer, primitive.material);
        meshBuffers.push(buffer);

        // FACE COLOR
        // map index vertices position

        const nbTrianglesFaces = primitive.bufferIndex.length / 3;
        const colorPerFace = [];

        const indexPositionsMap = this.db ? GltfPipeline.getIndiceVerticesMap(primitive) : null;

        for (let cFace = 0; cFace < nbTrianglesFaces; cFace++) {
          // don't compute if already exist
          if (indexPositionsMap) {
            // to retrieve face vertices when picking
            const indexPos = cFace * 3;
            const id0 = primitive.bufferIndex.at(indexPos);
            const id1 = primitive.bufferIndex.at(indexPos + 1);
            const id2 = primitive.bufferIndex.at(indexPos + 2);
            const pos0 = indexPositionsMap.get(id0);
            const pos1 = indexPositionsMap.get(id1);
            const pos2 = indexPositionsMap.get(id2);
            if (key === 12) {
              console.log([id0, id1, id2], [pos0, pos1, pos2]);
            }
            dataToSotore.push({
              // db
              meshIdIndex: `${key}-${meshFaceIndex}`,
              vertices: [pos0, pos1, pos2],
            });
          }

          // to retrieve face index when picking
          const colorValue = pixelToPickingColor(meshFaceIndex);
          facesPerColorPicking.set(colorValue, meshFaceIndex);
          meshFaceIndex++;

          // for buffer
          const floatingValue = Number.parseFloat(colorValue);
          colorPerFace.push(floatingValue, floatingValue, floatingValue); // x3 for all 3 positions of the face
        }

        buffer.setupForFaces(device, primitive, colorPerFace);

        if (mesh.name === 'billboard') {
          console.log('+++', nbTrianglesFaces, primitive);
        }

        if (key === 12) {
          // billboard poteau
          console.log({
            nbTrianglesFaces,
            colorPerFace,
          });
        }

        // the problem is that for a plane with 2 triangles (4 vertices),
        // i expected to pass 6 times into the vertex shader (one per index) but it pass only one per vertice so 4
        buffer.setupFaceColorPick(device, [0, 0, 0, 0]);
      }

      this.facesPerMeshPerColorPicking.set(key, facesPerColorPicking);
      meshBuffersMaps.set(key, meshBuffers);
    }

    if (this.db && dataToSotore.length) {
      await this.db.addFacesData(dataToSotore);
    }

    const firstBuffer = meshBuffersMaps.values().next().value[0]; // we used the first layout because its fit all the mesh
    this.firstBufferLayout = firstBuffer.getLayout();

    let buffersLayout = [this.firstBufferLayout];

    console.log({ firstBuffer: this.firstBufferLayout });

    if (isDebug) {
      // buffer faces
      buffersLayout = [
        {
          arrayStride: this.firstBufferLayout.arrayStride + Float32Array.BYTES_PER_ELEMENT,
          attributes: [
            ...this.firstBufferLayout.attributes,
            {
              format: 'float32',
              offset: 32,
              shaderLocation: 3,
            },
          ],
        },
      ];
    }

    this.bindGroupLayouts = buildBindGroupLayouts(device);

    await this.pipeline.setup(
      device,
      program,
      gltf.get('pipeline'),
      buffersLayout,
      this.context.getCanvasFormat(),
      [
        this.bindGroupLayouts[GltfBindGroups.CAMERA],
        this.bindGroupLayouts[GltfBindGroups.TRANSFORM],
        this.bindGroupLayouts[GltfBindGroups.MATERIAL],
        this.bindGroupLayouts[GltfBindGroups.LIGHT],
      ],
    );
    this.pipeline.setupRenderPassDescriptor();

    // animations
    // TODO should put this outside
    this.animations = new Animation(gltf.get('animations'), nodes);

    // for material
    this.materialBuffer = new BufferMaterial();
    await this.materialBuffer.setup(
      device,
      this.getBindGroupLayout(GltfBindGroups.MATERIAL),
      gltf.get('materials'),
      gltf.get('textures'),
      depthMapBingGroupEntries,
    );

    this.buildDrawNodes(nodes, meshBuffersMaps); // TODO should put node and drawNodes outside as animation to call renderModel on other pipeline
    this.transformBinGroups = this.buildTransformBindGroups(
      this.getBindGroupLayout(GltfBindGroups.TRANSFORM),
    );

    this.textures.setup(device, this.context.getCanvasFormat(), canvasSize);

    const matricesToSaved = this.db ? [] : null;
    if (matricesToSaved) {
      for (const [key, node] of this.nodesToDraw) {
        matricesToSaved.push({
          meshId: key,
          matrix: node.matrix.get(),
        });
      }
      console.log({ matricesToSaved });
      await this.db.addNodeMatricesData(matricesToSaved);
    }
  }

  static getIndiceVerticesMap(primitive) {
    const indexPositionsMap = new Map();
    const nbFloatStride = primitive.arrayStride / Float32Array.BYTES_PER_ELEMENT;
    const nbIndex = primitive.bufferVertex.length / nbFloatStride;

    for (let i = 0; i < nbIndex; i++) {
      const arrIndex = i * nbFloatStride;
      const p0 = primitive.bufferVertex.at(arrIndex);
      const p1 = primitive.bufferVertex.at(arrIndex + 1);
      const p2 = primitive.bufferVertex.at(arrIndex + 2);
      const position = [p0, p1, p2];
      indexPositionsMap.set(i, position);
    }
    return indexPositionsMap;
  }

  static getAbsoluteMatrix(key, nodes) {
    const node = nodes.get(key);
    if (!node) {
      throw Error('node not found in getAbsoluteMatrix');
    }
    if (node.parent) {
      const matrix = Transform.get(node);
      node.paths.forEach((nodeId) => {
        const refNode = nodes.get(nodeId);
        const refMatrix = Transform.get(refNode);
        matrix.multiply(refMatrix);
      });
      return matrix;
    }
    return Transform.get(node);
  }

  getAbsoluteAnimatedMatrix(key) {
    const node = this.nodes.get(key);
    if (!node) {
      throw Error('node not found in getAbsoluteMatrix');
    }
    if (node.parent) {
      const matrix = Transform.get(node);
      node.paths.forEach((nodeId) => {
        if (this.animations.isNodeHasAnimation(nodeId)) {
          const animMatrix = this.animations.handleLocalTransform(nodeId);
          matrix.multiply(animMatrix);
        } else {
          const refNode = this.nodes.get(nodeId);
          const refMatrix = Transform.get(refNode);
          matrix.multiply(refMatrix);
        }
      });
      return matrix;
    }
    if (this.animations.isNodeHasAnimation(key)) {
      return this.animations.handleLocalTransform(key);
    }
    return Transform.get(node);
  }

  static getMeshId(node, nodes) {
    if (node.isInstance) {
      const refNode = nodes.get(node.children[0]);
      return refNode.mesh;
    }
    return node.mesh;
  }

  buildDrawNodes(nodes, meshBuffersMaps) {
    this.nodesToDraw = new Map();
    this.nodesPerColorPicking = new Map();

    let index = 0;
    for (const [key, node] of nodes) {
      const meshId = GltfPipeline.getMeshId(node, nodes);

      if (
        meshId === undefined ||
        node.isInstanceRef ||
        (!node.isInstance && node.children) // remove parent, we used children to draw with pats to apply ancestor matrix
      ) {
        continue; // isInstanceRef problem with color picking ?
      }

      const matrix = GltfPipeline.getAbsoluteMatrix(key, nodes);
      const buffers = meshBuffersMaps.get(meshId);

      const hasAnimation =
        this.animations.isNodeHasAnimation(key) ||
        node.paths?.some(this.animations.isNodeHasAnimation);

      // MESH COLOR
      const pickingColor = pixelToPickingColor(index);

      this.nodesToDraw.set(key, {
        name: node.name,
        buffers,
        matrix,
        pickingColor: [Number.parseFloat(pickingColor), 0, 0, 1], // TODO can be only a float
        hasAnimation,
      });

      this.nodesPerColorPicking.set(pickingColor, key);
      index++;
    }
    console.log('drawNodes', this.nodesToDraw);
  }

  buildTransformBindGroups(layoutTransform) {
    const device = this.context.getDevice();
    const groups = new Map();
    for (const [key, node] of this.nodesToDraw) {
      const transformBindGroup = !node.hasAnimation
        ? BufferTransform.setup(device, layoutTransform, {
            transformMatrix: node.matrix,
            pickingColor: node.pickingColor, // TODO should only send this to picking pipeline
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
      this.textures.getDepthTextureView(),
    );
  }

  drawModel = (device, pass, isDebug = false) => {
    // should sort primitives by material
    for (const [key, node] of this.nodesToDraw) {
      // if (!["Hautvent.002", "billboard"].includes(node.name)) continue;

      node.buffers.forEach((buffer) => {
        let transformBindGroup = this.transformBinGroups.get(key);
        if (!transformBindGroup) {
          // animations
          const animMatrix = this.getAbsoluteAnimatedMatrix(key);
          transformBindGroup = BufferTransform.setup(
            device,
            this.getBindGroupLayout(GltfBindGroups.TRANSFORM),
            {
              transformMatrix: animMatrix,
              pickingColor: isDebug ? node.pickingColor : undefined,
            },
            node.name,
          );
        }

        pass.setBindGroup(GltfBindGroups.TRANSFORM, transformBindGroup);

        // MAT
        pass.setBindGroup(
          GltfBindGroups.MATERIAL,
          this.materialBuffer.getBindGroup(this.materialIndexes.get(buffer) || 0),
        );

        if (!isDebug) {
          pass.setVertexBuffer(0, buffer.getVertexBuffer());
          pass.setIndexBuffer(buffer.getIndexBuffer(), 'uint16');
          pass.drawIndexed(buffer.getIndexCount(), 1, 0);
        } else {
          pass.setVertexBuffer(0, buffer.getFaceBuffer());
          pass.draw(buffer.getFaceBufferCount());
        }
      });
    }
  };

  resize = (size) => {
    this.textures.resize(this.context.getDevice(), this.context.getCanvasFormat(), size);
  };

  getBindGroupLayout = (bindGroupType) => this.bindGroupLayouts[bindGroupType];

  getRenderPassDescriptor = () => this.pipeline.getRenderPassDescriptor();

  get = () => this.pipeline.get();

  getDrawNodes = () => this.nodesToDraw;
  getAnimations = () => this.animations;
  getFirstBufferLayout = () => this.firstBufferLayout;

  getByPickColor = async (color) => {
    const nodeId = this.nodesPerColorPicking.get(color[0]);
    const node = this.nodes.get(nodeId);
    const drawNode = this.nodesToDraw.get(nodeId);

    let positions = undefined;
    let matrix = undefined;

    if (node) {
      const matrixData = await this.db.getMeshMatrixData(node.mesh);
      if (matrixData) {
        const matrixD = matrixData.matrix;
        matrix = new Mat4();
        matrix.setRaw(matrixD);
      }

      console.log({ matrixData, drawNode });
      const faceColors = this.facesPerMeshPerColorPicking.get(node.mesh);
      if (faceColors) {
        const faceIndex = faceColors.get(color[1]);
        console.log({ faceIndex }, color, faceColors);
        const faceData = await this.db.getMeshFaceData(`${node.mesh}-${faceIndex}`);
        if (faceData) {
          positions = faceData.vertices;
        }
      }
    }
    return { positions, node, matrix };
  };
}
