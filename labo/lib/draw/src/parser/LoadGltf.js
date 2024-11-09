import { dataViewToUint8 } from "../../../utils/base64";
import { chunkArray } from "../../../utils";
import {
  getNumComponentPerType,
  getGlslProgramLocationsMappedName,
  getBuffersData,
  getMaterial,
} from "./GltfCommon";

const getImageBufferData = (buffers, bufferView) => {
  const { buffer: bufferIndex, byteOffset, byteLength } = bufferView;
  const dataView = new DataView(buffers[bufferIndex], byteOffset, byteLength);
  return dataViewToUint8(dataView, byteLength);
};

const VBO_ATTRIBUTES = [
  "position",
  "normale",
  "texture",
  "joint",
  "weight",
  "tangent",
];

const getVbos = (attributes, accessors, indices, targets) => {
  const indicesAcc = accessors[indices];
  let defautData = {
    indices: { ...indicesAcc, size: getNumComponentPerType(indicesAcc.type) },
  };

  let newTargets = targets?.map((target) =>
    Object.keys(target).reduce((acc, cur) => {
      const accessor = accessors[target[cur]];
      return {
        ...acc,
        [cur]: { ...accessor, size: getNumComponentPerType(accessor.type) },
      };
    }, {}),
  );
  if (newTargets) {
    newTargets = newTargets.reduce((acc, cur, index) => {
      const newFormatTargets = Object.keys(cur).reduce((a, c) => {
        const finalName = getGlslProgramLocationsMappedName(c.toLowerCase());
        return { ...a, [`target${finalName}${index}`]: cur[c] };
      }, {});
      return { ...acc, ...newFormatTargets };
    }, {});
    defautData = { ...newTargets, ...defautData };
  }

  return Object.keys(attributes).reduce((a, c) => {
    const finalName = getGlslProgramLocationsMappedName(c.toLowerCase());
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
      .map(
        ({
          inverseBindMatrices: matriceAccessorIndex,
          joints: jointsNodesIndexes,
        }) => {
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
                currentJoint.children = processChildren(
                  currentJoint.children,
                  tmpArray,
                );
              }
              const { id, ...rest } = currentJoint;
              hierarchyJoints.push(rest);
            }
            return { joints: hierarchyJoints };
          }
          return null;
        },
      )
      .filter((k) => k);
  }
  return newSkins;
};

const getAnimations = (animations, nodes, accessors, meshes) => {
  const animationsPerNodes = {};
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
        const node = nodes[nodeIndex];

        // define output chunk length
        let chunkLength = getNumComponentPerType(output.type);
        if (node[path]) {
          chunkLength = node[path].length;
        } else if (node.mesh && meshes[node.mesh][path]) {
          chunkLength = meshes[node.mesh][path].length;
        } else if (path === "scale") {
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

const getImages = (images, buffers, bufferViews) =>
  images
    ? images.map(({ bufferView: bufferViewIndex, mimeType, name }) => {
        const bufferView = bufferViews[bufferViewIndex];
        const data = getImageBufferData(buffers, bufferView);
        return { mimeType, name, data };
      })
    : null;

const addChildrenToNode = (parent, nodes) => {
  const { children } = parent;
  if (children) {
    const newChildren = children.map((nodeId) =>
      addChildrenToNode(nodes[nodeId], nodes),
    );
    return { ...parent, children: newChildren };
  }
  return parent;
};

const organizeParenting = (nodes) => {
  const indexNodeIsChild = {};
  nodes.forEach(
    ({ children }) =>
      children &&
      children.forEach((childIndex) => {
        indexNodeIsChild[childIndex] = true;
      }),
  );
  const nodesWithChildren = nodes.map((node) => addChildrenToNode(node, nodes));
  return nodesWithChildren.filter(
    (node, index) => indexNodeIsChild[index] === undefined,
  );
};

const convertNodesToObject = (nodesArray) =>
  nodesArray.reduce((acc, node) => {
    const { name, children } = node;
    acc[name] = node;
    if (children) {
      acc[name].children = convertNodesToObject(children);
    }
    return acc;
  }, {});

const markedAndNameNodes = (nodes, allJointsIds = []) => {
  const newNodes = nodes.map((node, index) => {
    let name = node.name || `node-${index}`;
    let customType = "node";
    if (allJointsIds.indexOf(index) !== -1) {
      name = node.name || `joint-${index}`;
      customType = "joint";
    }
    return { ...node, name, customType };
  });
  return newNodes;
};

export default class {
  constructor(rawText) {
    const JsonData = JSON.parse(rawText);
    console.log({ JsonData });
    const { animations, bufferViews, skins, nodes, meshes, materials, images } =
      JsonData;

    const { newBuffers, newAccessors } = getBuffersData(JsonData);
    const allJointsIds = skins?.reduce(
      (acc, skin) => acc.concat(skin.joints),
      [],
    );
    const markedNodes = markedAndNameNodes(nodes, allJointsIds);

    // add animations to nodes
    const animationsPerNodes = getAnimations(
      animations,
      markedNodes,
      newAccessors,
      meshes,
    );
    Object.keys(animationsPerNodes).forEach((nodeIndex) => {
      markedNodes[nodeIndex].animations = animationsPerNodes[nodeIndex];
    });

    const newSkins = getSkins(skins, markedNodes, newAccessors);

    const newMeshes = meshes.map(({ primitives, weights }) => {
      const newPrimitives = getPrimitiveData(primitives, newAccessors);
      let finalMesh = { primitives: newPrimitives };
      if (weights) finalMesh = { weights, ...finalMesh };
      return finalMesh;
    });

    const newImages = getImages(images, newBuffers, bufferViews);
    const newMaterials =
      materials &&
      materials.map((material) => getMaterial(material, newImages));

    let newNodes = organizeParenting(markedNodes);
    newNodes = convertNodesToObject(newNodes);

    this.data = {};
    if (newMeshes) this.data.meshes = newMeshes;
    if (newNodes) this.data.nodes = newNodes;
    if (newSkins) this.data.skins = newSkins;
    if (newMaterials) this.data.materials = newMaterials;
    console.log(
      "[Gltf custom data]",
      this.data,
      `\n${nodes.length} nodes\n${allJointsIds?.length || "0"} joints`,
    );
  }

  get() {
    return this.data;
  }
}
