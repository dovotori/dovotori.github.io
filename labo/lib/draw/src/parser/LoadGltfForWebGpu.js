import {
  getNumComponentPerType,
  getGlslProgramLocationsMappedName,
  getArrayType,
  getBufferDataFromLayout,
  getMixedInterleavedBufferData,
} from "./GltfCommon";
import { chunkArray } from "../../../utils";
import { base64ToArrayBuffer } from "../../../utils/base64";

class LoadGltfForWebGpu {
  static gpuFormatForAccessor(accessor) {
    const norm = accessor.normalized ? "norm" : "int";
    const count = getNumComponentPerType(accessor.type);
    const x = count > 1 ? `x${count}` : "";
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
        return "triangle-strip";
      case WebGLRenderingContext.LINES:
        return "line-list";
      case WebGLRenderingContext.LINE_STRIP:
        return "line-strip";
      case WebGLRenderingContext.POINTS:
        return "point-list";
      default:
      case WebGLRenderingContext.TRIANGLES:
        return "triangle-list";
    }
  }

  static getShaderLocationFromName(name) {
    // should match @location(...) on vertex shader
    switch (name) {
      case "position":
        return 0;
      case "normale":
        return 1;
      case "texture":
        return 2;
      case "tangent":
        return 3;
      default:
        return undefined;
    }
  }

  static setInterleavedBuffer(toInterleaved) {
    const { count, arrayType, primitives } = toInterleaved;
    const sortLocations = Object.keys(primitives).sort((a, b) => a - b);
    let array = [];
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

  static getBuffersDataWebGpu = (gltf) => {
    const { buffers, accessors, bufferViews } = gltf;
    const newBuffers = buffers?.map((buffer) =>
      base64ToArrayBuffer(buffer.uri),
    );

    const layoutBuffers = {};
    accessors?.forEach((accessor, index) => {
      const layoutIndex = accessor.bufferView;
      const { count, componentType, type } = accessor;
      const bufferView = bufferViews[layoutIndex];
      const numElement = getNumComponentPerType(type);
      const length = numElement * count;

      if (layoutBuffers[layoutIndex]) {
        if (layoutBuffers[layoutIndex].count !== count) {
          throw new Error(
            "Really weird gltf interleaved with different count on accessors",
          );
        }
        if (layoutBuffers[layoutIndex].componentType !== componentType) {
          console.warn("strange gltf interleaved of diffrent type or count");
          // in this case, i think we should split the buffer between vertex and index
          layoutBuffers[layoutIndex].mixTypes = true;
        }
        layoutBuffers[layoutIndex].numElement += numElement;
        layoutBuffers[layoutIndex].length += length;
        layoutBuffers[layoutIndex].accessorsIndexes.push(index);
      } else {
        layoutBuffers[layoutIndex] = {
          count,
          componentType,
          numElement,
          length,
          accessorsIndexes: [index],
          ...bufferView,
        };
      }
    });

    Object.keys(layoutBuffers).forEach((layoutKey) => {
      const layout = layoutBuffers[layoutKey];
      if (layout.mixTypes) {
        const layoutAccessors = layout.accessorsIndexes.map(
          (id) => accessors[id],
        );
        layout.buffer = getMixedInterleavedBufferData(
          newBuffers,
          bufferViews,
          layoutAccessors,
        );
      } else {
        layout.buffer = getBufferDataFromLayout(newBuffers, layout);
      }
    });

    return { layoutBuffers };
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
        const vertexLayoutBuffer = layoutBuffers[firstAccessor.bufferView];

        const isNotInterleaved =
          vertexLayoutBuffer.accessorsIndexes.length === 1;

        const indicesAccessor = accessors[indices];
        const indicesLayoutBuffer = layoutBuffers[indicesAccessor.bufferView];

        // LAYOUT ATTRIBUTES
        let previousOffset = 0;
        let offset = 0;
        let bufferVertex = vertexLayoutBuffer.buffer;
        let bufferIndex = indicesLayoutBuffer.buffer;
        let arrayStride = vertexLayoutBuffer.byteStride;
        const arrayType = getArrayType(vertexLayoutBuffer.componentType);
        let toInterleaved = {
          count: vertexLayoutBuffer.count,
          primitives: {},
          arrayType,
        };

        const sortLocations = Object.keys(attributes)
          .map((attribName) => {
            const shaderLocationName = getGlslProgramLocationsMappedName(
              attribName.toLowerCase(),
            );
            const shaderLocation =
              LoadGltfForWebGpu.getShaderLocationFromName(shaderLocationName);
            return { shaderLocationName, shaderLocation, attribName };
          })
          .filter((a) => a.shaderLocation !== undefined) // remove undefined
          .sort((a, b) => a.shaderLocation - b.shaderLocation);

        const newAttributes = sortLocations.map(
          ({ attribName, shaderLocationName, shaderLocation }) => {
            const accessorIndex = attributes[attribName];
            const accessor = accessors[accessorIndex];
            const format = LoadGltfForWebGpu.gpuFormatForAccessor(accessor);

            if (isNotInterleaved) {
              const layoutBuffer = layoutBuffers[accessor.bufferView];
              offset += previousOffset;
              previousOffset =
                layoutBuffer.numElement * arrayType.BYTES_PER_ELEMENT;

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
          const interleaved =
            LoadGltfForWebGpu.setInterleavedBuffer(toInterleaved);
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
      });
    });
    return newMeshes;
  };

  static getPipelines = (meshes) => {
    const topology = LoadGltfForWebGpu.gpuPrimitiveTopologyForMode(
      meshes[0].primitives[0].mode,
    );
    return {
      topology,
      cullMode: "back", // 'none'
    };
  };

  static getNodes = (nodes) => {
    const newNodes = new Map();
    nodes.map((node, i) => newNodes.set(i, node));
    // set parenting
    for (const [nodeId, node] of newNodes) {
      node.children?.forEach((childId) => {
        const newChild = newNodes.get(childId);
        newNodes.set(childId, { ...newChild, parent: nodeId });
      });
    }
    // set path
    for (const [nodeId, node] of newNodes) {
      let path = node.parent;
      const paths = [nodeId]; // first is self
      while (path !== undefined) {
        paths.push(path);
        const parent = newNodes.get(path);
        path = parent.parent;
      }
      newNodes.set(nodeId, { ...node, paths });
    }
    return newNodes;
  };

  static getAnimationsPerNodes = (animations, accessors) => {
    const animationsPerNodes = new Map();
    if (animations) {
      animations.forEach(({ channels, samplers }) => {
        channels.forEach(({ target, sampler: samplerIndex }) => {
          const {
            input: inputAccessorIndex,
            output: outputAccessorIndex,
            interpolation,
          } = samplers[samplerIndex];

          const input = accessors[inputAccessorIndex];
          const output = accessors[outputAccessorIndex];
          const { node: nodeIndex, path } = target;

          const outputData = chunkArray(output.buffer, output.numElement);
          const inputData = input.buffer;
          const newAnimItem = {
            path,
            times: inputData,
            output: outputData,
            interpolation,
          };
          animationsPerNodes.set(
            nodeIndex,
            animationsPerNodes[nodeIndex]
              ? [...animationsPerNodes[nodeIndex], newAnimItem]
              : [newAnimItem],
          );
        });
      });
    }
    return animationsPerNodes;
  };

  constructor(rawText) {
    const gltf = JSON.parse(rawText);
    console.log({ gltf });
    this.setup(gltf);
  }

  // attribute -> accesor -> bufferView -> buffer
  setup(gltf) {
    const { meshes, materials, nodes, animations } = gltf;
    const { layoutBuffers } = LoadGltfForWebGpu.getBuffersDataWebGpu(gltf);
    const newMeshes = LoadGltfForWebGpu.getMeshes(gltf, layoutBuffers);
    const newMaterials = new Set(materials);
    const newNodes = LoadGltfForWebGpu.getNodes(nodes);

    const animationsPerNodes = LoadGltfForWebGpu.getAnimationsPerNodes(
      animations,
      layoutBuffers,
    );
    this.data = new Map();
    if (newMeshes) this.data.set("meshes", newMeshes);
    this.data.set("nodes", newNodes);
    this.data.set("materials", newMaterials);
    this.data.set("pipeline", LoadGltfForWebGpu.getPipelines(meshes));
    this.data.set("animations", animationsPerNodes);
  }

  get() {
    return this.data;
  }
}

export default LoadGltfForWebGpu;
