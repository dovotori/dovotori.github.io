import {
  base64ToArrayBuffer,
  dataViewToUint8,
  dataViewToUint16,
  dataViewToFloat32,
} from '../utils/base64';
import { chunkArray } from '../utils';

const acessorsTypes = {
  SCALAR: 'SCALAR',
  VEC2: 'VEC2',
  VEC3: 'VEC3',
  VEC4: 'VEC4',
  MAT2: 'MAT2',
  MAT3: 'MAT3',
  MAT4: 'MAT4',
};

export const getNumComponentPerType = (type) => {
  switch (type) {
    default:
    case acessorsTypes.SCALAR:
      return 1;
    case acessorsTypes.VEC2:
      return 2;
    case acessorsTypes.VEC3:
      return 3;
    case acessorsTypes.VEC4:
      return 4;
    case acessorsTypes.MAT2:
      return 4;
    case acessorsTypes.MAT3:
      return 9;
    case acessorsTypes.MAT4:
      return 16;
  }
};

const getLength = (type, count) => {
  const numElement = getNumComponentPerType(type);
  return numElement * count;
};

const getConvertMethod = (componentType) => {
  switch (componentType) {
    case 5123: // UNSIGNED_SHORT
      return dataViewToUint16;
    case 5126: // FLOAT
      return dataViewToFloat32;
    case 5120: // BYTE / Int8Array
    case 5121: // UNSIGNED_BYTE / Uint8Array
    case 5122: // SHORT / Int16Array
    case 5125: // UNSIGNED_INT / Uint32Array
    default:
      return null;
  }
};

const getBufferDataFromAccessor = (buffers, bufferViews, accessor) => {
  const {
    bufferView: bufferViewIndex,
    componentType,
    count,
    type,
    byteOffset: accessorByteOffset = 0,
  } = accessor;
  const {
    buffer: bufferIndex,
    byteLength: bufferViewByteLength,
    byteOffset: bufferViewByteOffset = 0,
    byteStride,
  } = bufferViews[bufferViewIndex];
  const dataView = new DataView(
    buffers[bufferIndex],
    bufferViewByteOffset + accessorByteOffset,
    bufferViewByteLength - accessorByteOffset
  );
  const numElement = getNumComponentPerType(type);
  const length = getLength(type, count);
  const converterMethod = getConvertMethod(componentType);
  return converterMethod ? converterMethod(dataView, length, count, numElement, byteStride) : null;
};

const getImageBufferData = (buffers, bufferView) => {
  const { buffer: bufferIndex, byteOffset, byteLength } = bufferView;
  const dataView = new DataView(buffers[bufferIndex], byteOffset, byteLength);
  return dataViewToUint8(dataView, byteLength);
};

const getGlslProgramMappedName = (gltfName) => {
  switch (gltfName) {
    case 'normal':
      return 'normale';
    case 'texcoord_0':
      return 'texture';
    case 'baseColorFactor':
      return 'color';
    case 'metallicFactor':
      return 'metal';
    case 'roughnessFactor':
      return 'rough';
    case 'joints_0':
      return 'joint';
    case 'weights_0':
      return 'weight';
    default:
      return gltfName;
  }
};

const formatMaterial = (gltfMaterial) =>
  Object.keys(gltfMaterial).reduce((acc, cur) => {
    const name = getGlslProgramMappedName(cur);
    return { ...acc, [name]: gltfMaterial[cur] };
  }, []);

const VBO_ATTRIBUTES = ['position', 'normale', 'texture', 'joint', 'weight', 'tangent'];

const getMaterial = (material, images) => {
  let finalMaterial = {};
  if (material) {
    finalMaterial = {
      ...formatMaterial(material.pbrMetallicRoughness),
      name: material.name,
    };

    if (material.normalTexture) {
      const normalMap = images[material.normalTexture.index];
      finalMaterial.normalMap = normalMap || undefined;
    }
  }

  return Object.keys(finalMaterial).length > 0 ? finalMaterial : undefined;
};

const getVbos = (attributes, accessors, indices, targets) => {
  const indicesAcc = accessors[indices];
  let defautData = {
    indices: { ...indicesAcc, size: getNumComponentPerType(indicesAcc.type) },
  };

  let newTargets =
    targets &&
    targets.map((target) =>
      Object.keys(target).reduce((acc, cur) => {
        const accessor = accessors[target[cur]];
        return {
          ...acc,
          [cur]: { ...accessor, size: getNumComponentPerType(accessor.type) },
        };
      }, {})
    );
  if (newTargets) {
    newTargets = newTargets.reduce((acc, cur, index) => {
      const newFormatTargets = Object.keys(cur).reduce((a, c) => {
        const finalName = getGlslProgramMappedName(c.toLowerCase());
        return { ...a, [`target${finalName}${index}`]: cur[c] };
      }, {});
      return { ...acc, ...newFormatTargets };
    }, {});
    defautData = { ...newTargets, ...defautData };
  }

  return Object.keys(attributes).reduce((a, c) => {
    const finalName = getGlslProgramMappedName(c.toLowerCase());
    if (VBO_ATTRIBUTES.indexOf(finalName) === -1) return a;
    const accessorIndex = attributes[c];
    const accessor = accessors[accessorIndex];
    return {
      ...a,
      [finalName]: { ...accessor, size: getNumComponentPerType(accessor.type) },
    };
  }, defautData);
};

const getPrimitiveData = (primitives, accessors) =>
  primitives.map((primitive) => {
    const { attributes, indices, material, targets } = primitive;
    const vbos = getVbos(attributes, accessors, indices, targets);
    let primitiveData = { vbos };
    if (material !== undefined) primitiveData = { material, ...primitiveData };
    return primitiveData;
  });

const processChildren = (children, joints) =>
  children.map((childId) => {
    const nodeIndex = joints.findIndex((node) => node.id === childId);
    const newJoint = joints.splice(nodeIndex, 1)[0];
    if (newJoint.children) {
      newJoint.children = processChildren(newJoint.children, joints);
    }
    const { id, ...rest } = newJoint;
    return rest;
  });

const getSkins = (skins, nodes, accessors) => {
  let newSkins = null;
  if (skins) {
    const indexedNodes = nodes.map((node, index) => ({ ...node, id: index }));
    newSkins = skins
      .map(({ inverseBindMatrices: matriceAccessorIndex, joints: jointsNodesIndexes }) => {
        let matrices = [];
        if (matriceAccessorIndex) {
          const rawMatrix = accessors[matriceAccessorIndex].values;
          matrices = chunkArray(rawMatrix, 16);
        }
        if (jointsNodesIndexes) {
          const joints = jointsNodesIndexes.map((nodeIndex, index) => ({
            ...indexedNodes[nodeIndex],
            invMatrix: matrices[index],
          }));
          const tmpArray = joints.slice();
          const hierarchyJoints = [];
          while (tmpArray.length !== 0) {
            const currentJoint = tmpArray.shift();
            if (currentJoint.children) {
              currentJoint.children = processChildren(currentJoint.children, tmpArray);
            }
            const { id, ...rest } = currentJoint;
            hierarchyJoints.push(rest);
          }
          return { joints: hierarchyJoints };
        }
        return null;
      })
      .filter((k) => k);
  }
  return newSkins;
};

const getAnimations = (animations, nodes, accessors, meshes) => {
  const animationsPerNodes = {};
  if (animations) {
    animations.forEach(({ channels, samplers }) => {
      channels.forEach(({ target, sampler: samplerIndex }) => {
        const { input: inputAccessorIndex, output: outputAccessorIndex, interpolation } = samplers[
          samplerIndex
        ];
        const input = accessors[inputAccessorIndex];
        const output = accessors[outputAccessorIndex];
        const { node: nodeIndex, path } = target;
        const node = nodes[nodeIndex];

        // define output chunk length
        let chunkLength = getNumComponentPerType(output.type);
        if (node[path]) {
          chunkLength = node[path].length;
        } else if (node.mesh && meshes[node.mesh][path]) {
          chunkLength = meshes[node.mesh][path].length;
        } else if (path === 'scale') {
          chunkLength = 3;
        }

        const outputData = chunkArray(output.values, chunkLength);
        const newAnimItem = {
          path,
          times: input.values,
          output: outputData,
          interpolation,
        };
        animationsPerNodes[nodeIndex] = animationsPerNodes[nodeIndex]
          ? [...animationsPerNodes[nodeIndex], newAnimItem]
          : [newAnimItem];
      });
    });
  }
  return animationsPerNodes;
};

const getImages = (images, accessors, buffers, bufferViews) => {
  return images
    ? images.map(({ bufferView: bufferViewIndex, mimeType, name }) => {
        const bufferView = bufferViews[bufferViewIndex];
        const data = getImageBufferData(buffers, bufferView);
        return { mimeType, name, data };
      })
    : null;
};

export default class {
  constructor(rawText) {
    const JsonData = JSON.parse(rawText);
    const {
      animations,
      buffers,
      bufferViews,
      accessors,
      skins,
      nodes,
      meshes,
      materials,
      images,
    } = JsonData;

    const newBuffers = buffers && buffers.map((buffer) => base64ToArrayBuffer(buffer.uri));

    const newAccessors =
      accessors &&
      accessors.map((accessor) => ({
        ...accessor,
        values: getBufferDataFromAccessor(newBuffers, bufferViews, accessor),
      }));

    // add animations to nodes
    const animationsPerNodes = getAnimations(animations, nodes, newAccessors, meshes);
    Object.keys(animationsPerNodes).forEach((nodeIndex) => {
      nodes[nodeIndex].animations = animationsPerNodes[nodeIndex];
    });

    const newSkins = getSkins(skins, nodes, newAccessors);

    const newMeshes = meshes.map(({ primitives, weights }) => {
      const newPrimitives = getPrimitiveData(primitives, newAccessors);
      let finalMesh = { primitives: newPrimitives };
      if (weights) finalMesh = { weights, ...finalMesh };
      return finalMesh;
    });

    const newImages = getImages(images, newAccessors, newBuffers, bufferViews);

    const newMaterials = materials && materials.map((material) => getMaterial(material, newImages));

    this.data = {};
    if (newMeshes) this.data.meshes = newMeshes;
    if (nodes) this.data.nodes = nodes.filter((node) => node.mesh !== undefined);
    if (newSkins) this.data.skins = newSkins;
    if (newMaterials) this.data.materials = newMaterials;
    console.log('CUSTOM', this.data);
  }

  get() {
    return this.data;
  }
}
