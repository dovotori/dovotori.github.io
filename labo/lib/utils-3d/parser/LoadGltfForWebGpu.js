import { chunkArray, isEqualArray } from '../../utils';
import { base64ToArrayBuffer } from '../../utils/base64';
import {
  getArrayType,
  getBufferDataFromLayout,
  getBufferDataFromTexture,
  getGlslProgramLocationsMappedName,
  getHierarchyJoints,
  getMixedInterleavedBufferData,
  getNumComponentPerType,
} from './GltfCommon';

class LoadGltfForWebGpu {
  constructor() {
    console.warn('LoadGltfForWebGpu should not be instanciated');
  }

  static gpuFormatForAccessor(accessor) {
    const norm = accessor.normalized ? 'norm' : 'int';
    const count = getNumComponentPerType(accessor.type);
    const x = count > 1 ? `x${count}` : '';
    switch (accessor.componentType) {
      case WebGLRenderingContext.BYTE:
        return `s${norm}8${x}`;
      case WebGLRenderingContext.UNSIGNED_BYTE:
        return `u${norm}8${x}`;
      case WebGLRenderingContext.SHORT:
        return `s${norm}16${x}`;
      case WebGLRenderingContext.UNSIGNED_SHORT:
        return `u${norm}16${x}`;
      case WebGLRenderingContext.UNSIGNED_INT:
        return `u${norm}32${x}`;
      case WebGLRenderingContext.FLOAT:
        return `float32${x}`;
    }
  }

  static gpuPrimitiveTopologyForMode(mode) {
    switch (mode) {
      case WebGLRenderingContext.TRIANGLE_STRIP:
        return 'triangle-strip';
      case WebGLRenderingContext.LINES:
        return 'line-list';
      case WebGLRenderingContext.LINE_STRIP:
        return 'line-strip';
      case WebGLRenderingContext.POINTS:
        return 'point-list';
      default:
      case WebGLRenderingContext.TRIANGLES:
        return 'triangle-list';
    }
  }

  static getShaderLocationFromName(name) {
    // should match @location(...) on vertex shader
    switch (name) {
      case 'position':
        return 0;
      case 'normale':
        return 1;
      case 'texture':
        return 2;
      case 'tangent':
        return 3;
      case 'joint':
        return 4;
      case 'weight':
        return 5;
      default:
        return undefined;
    }
  }

  static setInterleavedBuffer(toInterleaved) {
    const { count, arrayType, primitives } = toInterleaved;
    const sortLocations = Object.keys(primitives).sort((a, b) => a - b);
    const array = [];
    const arrayStride =
      sortLocations.reduce((acc, cur) => {
        return acc + primitives[cur].numElement;
      }, 0) * arrayType.BYTES_PER_ELEMENT;
    for (let i = 0; i < count; i++) {
      sortLocations.forEach((loc) => {
        const primitive = primitives[loc];
        for (let j = 0; j < primitive.numElement; j++) {
          const index = i * primitive.numElement + j;
          array.push(primitive.buffer[index]);
        }
      });
    }
    return { buffer: new arrayType(array), arrayStride };
  }

  // interleaves means share bufferView position/texture/normale/position/texture/normale/...
  // non interleaves position/position/.../normale/normale/..

  // if non-interleave 1 accessor = 1 bufferview
  // if interleave multiple accessors = 1 bufferview (called layout)
  // if interleave should have same componentType and count on accessors

  static getBuffersDataWebGpu = async (gltf, matTextures) => {
    const { buffers, accessors, bufferViews } = gltf;
    const newBuffers = buffers?.map((buffer) => {
      if (buffer.uri?.startsWith('data:')) {
        return base64ToArrayBuffer(buffer.uri);
      }
      if (buffer.data) {
        return buffer.data;
      }
      return buffer; // direct buffer from .bin files
    });

    const textureBuffers = new Map();

    matTextures.forEach(async (texData, texIndex) => {
      const bufferViewIndex = texData.image.bufferView;
      const bufferView = bufferViews[bufferViewIndex];

      const buffer = getBufferDataFromTexture(newBuffers, bufferView);

      const blob = new Blob([buffer], { type: texData.image.mimeType });
      const imageData = await createImageBitmap(blob);

      textureBuffers.set(texIndex, {
        buffer,
        ...texData,
        imageData,
      });
    });

    const layoutBuffers = new Map();

    accessors?.forEach((accessor, index) => {
      const layoutIndex = accessor.bufferView;
      const { count, componentType, type } = accessor;
      const bufferView = bufferViews[layoutIndex];
      const numElement = getNumComponentPerType(type);
      const length = numElement * count;

      if (layoutBuffers.has(layoutIndex)) {
        const layout = layoutBuffers.get(layoutIndex);
        if (layout.count !== count) {
          throw new Error('Really weird gltf interleaved with different count on accessors');
        }
        if (layout.componentType !== componentType) {
          console.warn('strange gltf interleaved of diffrent type or count');
          // in this case, i think we should split the buffer between vertex and index
          layout.mixTypes = true;
        }
        layout.numElement += numElement;
        layout.length += length;
        layout.accessorsIndexes.push(index);
      } else {
        const layout = {
          count,
          componentType,
          numElement,
          length,
          accessorsIndexes: [index],
          ...bufferView,
        };
        layoutBuffers.set(layoutIndex, layout);
      }
    });

    layoutBuffers.forEach((layout) => {
      if (layout.mixTypes) {
        const layoutAccessors = layout.accessorsIndexes.map((id) => accessors[id]);
        layout.buffer = getMixedInterleavedBufferData(newBuffers, bufferViews, layoutAccessors);
      } else {
        layout.buffer = getBufferDataFromLayout(newBuffers, layout);
      }
    });

    return { layoutBuffers, textureBuffers };
  };

  static getMeshes = (gltf, layoutBuffers) => {
    const { meshes, accessors } = gltf;
    const newMeshes = new Map();
    meshes.forEach((mesh, id) => {
      const newPrimitives = new Set();
      mesh.primitives.forEach((primitive) => {
        const { attributes, indices, material } = primitive;

        const firstAttribute = attributes[Object.keys(attributes)[0]];
        const firstAccessor = accessors[firstAttribute];
        const vertexLayoutBuffer = layoutBuffers.get(firstAccessor.bufferView);

        const isNotInterleaved = vertexLayoutBuffer.accessorsIndexes.length === 1;

        const indicesAccessor = accessors[indices];
        const indicesLayoutBuffer = layoutBuffers.get(indicesAccessor.bufferView);

        // LAYOUT ATTRIBUTES
        let previousOffset = 0;
        let offset = 0;
        let bufferVertex = vertexLayoutBuffer.buffer;
        let bufferIndex = indicesLayoutBuffer.buffer;
        let arrayStride = vertexLayoutBuffer.byteStride;
        const arrayType = getArrayType(vertexLayoutBuffer.componentType);
        const toInterleaved = {
          count: vertexLayoutBuffer.count,
          primitives: {},
          arrayType,
        };

        const sortLocations = Object.keys(attributes)
          .map((attribName) => {
            const shaderLocationName = getGlslProgramLocationsMappedName(attribName.toLowerCase());
            const shaderLocation = LoadGltfForWebGpu.getShaderLocationFromName(shaderLocationName);
            return { shaderLocationName, shaderLocation, attribName };
          })
          .filter((a) => a.shaderLocation !== undefined) // remove undefined
          .sort((a, b) => a.shaderLocation - b.shaderLocation);

        const newAttributes = sortLocations.map(
          ({ attribName, shaderLocationName, shaderLocation }) => {
            const accessorIndex = attributes[attribName];
            const accessor = accessors[accessorIndex];
            let format = LoadGltfForWebGpu.gpuFormatForAccessor(accessor);

            // force format for joint
            // because it is interleaved as a big float32 buffer
            if (
              shaderLocationName === 'joint' &&
              attribName === 'JOINTS_0' &&
              shaderLocation === 4
            ) {
              format = 'float32x4';
            }

            if (isNotInterleaved) {
              const layoutBuffer = layoutBuffers.get(accessor.bufferView);
              offset += previousOffset;
              previousOffset = layoutBuffer.numElement * arrayType.BYTES_PER_ELEMENT;

              toInterleaved.primitives[shaderLocation] = {
                shaderLocationName,
                buffer: layoutBuffer.buffer,
                numElement: layoutBuffer.numElement,
              };
            } else {
              offset = accessor.byteOffset || 0;
            }

            return {
              shaderLocation,
              format,
              offset: offset || 0,
            };
          },
        );

        if (isNotInterleaved) {
          const interleaved = LoadGltfForWebGpu.setInterleavedBuffer(toInterleaved);
          arrayStride = interleaved.arrayStride;
          bufferVertex = interleaved.buffer;
        } else if (vertexLayoutBuffer.mixTypes) {
          bufferIndex = vertexLayoutBuffer.buffer.index;
          bufferVertex = vertexLayoutBuffer.buffer.vertex;
        }

        newPrimitives.add({
          arrayStride,
          bufferVertex,
          attributes: newAttributes,
          bufferIndex,
          indexCount: indicesAccessor.count,
          material,
        });
      });

      newMeshes.set(id, {
        primitives: newPrimitives,
        name: mesh.name,
      });
    });
    return newMeshes;
  };

  static getPipelines = (meshes) => {
    const topology = LoadGltfForWebGpu.gpuPrimitiveTopologyForMode(meshes[0].primitives[0].mode);
    return {
      topology,
      cullMode: 'back', // 'none'
    };
  };

  static getNodes = (nodes, jointsIndexes) => {
    const newNodes = new Map();
    nodes.forEach((node, i) => {
      // mark joints nodes
      newNodes.set(i, { ...node, isJoint: jointsIndexes.has(i) });
    });
    for (const [nodeId, node] of newNodes) {
      // set parenting
      node.children?.forEach((childId) => {
        const newChild = newNodes.get(childId);
        newNodes.set(childId, { ...newChild, parent: nodeId });
      });
    }
    for (const [nodeId, node] of newNodes) {
      // set path
      let path = node.parent;
      // const paths = [nodeId]; // first is self
      const paths = []; // only parent / no self (as instance)
      while (path !== undefined) {
        paths.push(path);
        const parent = newNodes.get(path);
        path = parent.parent;
      }
      newNodes.set(nodeId, { ...node, paths });
    }

    return newNodes;
  };

  static getAnimationsPerNodes = (gltf, layoutBuffers) => {
    const { animations, accessors } = gltf;
    const animationsPerNodes = new Map();
    if (animations) {
      animations.forEach(({ channels, samplers }) => {
        channels.forEach(({ target, sampler: samplerIndex }) => {
          const {
            input: inputAccessorIndex,
            output: outputAccessorIndex,
            interpolation,
          } = samplers[samplerIndex];

          const inAccessor = accessors[inputAccessorIndex];
          const outAccessor = accessors[outputAccessorIndex];

          const input = layoutBuffers.get(inAccessor.bufferView);
          const output = layoutBuffers.get(outAccessor.bufferView);
          const { node: nodeIndex, path } = target;

          if (nodeIndex === undefined) {
            return;
          }

          const outputData = chunkArray(output.buffer, output.numElement);
          const inputData = input.buffer;
          const newAnimItem = {
            path,
            times: inputData,
            output: outputData,
            interpolation,
          };

          if (
            interpolation === 'STEP' &&
            outputData.length === 2 &&
            isEqualArray(outputData[0], outputData[1])
          ) {
            return; // remove useless animation with 2 same values for step
          }

          animationsPerNodes.has(nodeIndex)
            ? animationsPerNodes.get(nodeIndex).push(newAnimItem)
            : animationsPerNodes.set(nodeIndex, [newAnimItem]);
        });
      });
    }
    return animationsPerNodes;
  };

  static getMaterials(materials, textures, samplers, images) {
    const matTextures = new Map();
    const newMaterials = new Map();

    materials?.forEach((material, matIndex) => {
      if (material.pbrMetallicRoughness?.baseColorTexture) {
        const texIndex = material.pbrMetallicRoughness.baseColorTexture.index;
        // has embedded texture
        const texture = textures[texIndex];
        const imageIndex = texture?.source;
        const samplerIndex = texture?.sampler;
        const image = images[imageIndex];
        const sampler = samplers[samplerIndex];
        matTextures.set(texIndex, {
          image,
          sampler,
        });
      }
      newMaterials.set(matIndex, material);
    });

    return {
      newMaterials,
      matTextures,
    };
  }

  static getSkins(gltf, layoutBuffers) {
    const skins = new Map();
    const jointsIndexes = new Set();
    gltf.skins?.forEach((skin, skinIndex) => {
      const { joints, inverseBindMatrices: matriceAccessorIndex } = skin;
      const inverseMatrixesAccessor = layoutBuffers.get(matriceAccessorIndex);
      const inverseMatrixesBuffer = inverseMatrixesAccessor.buffer;
      const invMatrices = chunkArray(inverseMatrixesBuffer, 16);

      const jointNodes = joints.map((nodeIndex, i) => {
        return { ...gltf.nodes[nodeIndex], invMatrix: invMatrices[i], id: nodeIndex };
      });

      skins.set(skinIndex, {
        hierarchy: joints,
        joints: getHierarchyJoints(jointNodes),
        inverseMatrixesAccessor,
      });
      joints.forEach((jointNodeIndex) => {
        jointsIndexes.add(jointNodeIndex);
      });
    });
    return { skins, jointsIndexes };
  }

  static async load(gltf, folderPath) {
    const buffers = await LoadGltfForWebGpu.fetchBuffers(gltf.buffers, folderPath);
    return await LoadGltfForWebGpu.parse({ ...gltf, buffers });
  }

  static async fetchBuffers(buffers, folderPath) {
    return await Promise.all(
      buffers.map((b) => {
        if (b.uri?.endsWith('.bin')) {
          return fetch(folderPath + b.uri).then((res) => res.arrayBuffer());
        }
        return b;
      }),
    );
  }

  // attribute -> accesor -> bufferView -> buffer
  static async parse(gltf) {
    console.log({ gltf });
    const { meshes, nodes, materials, textures, samplers, images } = gltf;
    const { newMaterials, matTextures } = LoadGltfForWebGpu.getMaterials(
      materials,
      textures,
      samplers,
      images,
    );
    const { layoutBuffers, textureBuffers } = await LoadGltfForWebGpu.getBuffersDataWebGpu(
      gltf,
      matTextures,
    );
    const newMeshes = LoadGltfForWebGpu.getMeshes(gltf, layoutBuffers);
    const { skins: newSkins, jointsIndexes } = LoadGltfForWebGpu.getSkins(gltf, layoutBuffers);
    const newNodes = LoadGltfForWebGpu.getNodes(nodes, jointsIndexes);

    const animationsPerNodes = LoadGltfForWebGpu.getAnimationsPerNodes(gltf, layoutBuffers);
    const data = new Map();
    if (newMeshes) data.set('meshes', newMeshes);
    data.set('nodes', newNodes);
    data.set('materials', newMaterials);
    data.set('pipeline', LoadGltfForWebGpu.getPipelines(meshes));
    data.set('animations', animationsPerNodes);
    data.set('textures', textureBuffers);
    if (newSkins.size > 0) {
      data.set('skins', newSkins);
    }
    return data;
  }
}

export default LoadGltfForWebGpu;
