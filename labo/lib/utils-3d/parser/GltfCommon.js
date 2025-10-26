import {
  base64ToArrayBuffer,
  dataViewToFloat32,
  dataViewToUint8,
  dataViewToUint16,
} from '../../utils/base64';

const getConvertMethod = (componentType) => {
  switch (componentType) {
    case 5123: // UNSIGNED_SHORT
      return dataViewToUint16;
    case 5126: // FLOAT
      return dataViewToFloat32;
    case 5121: // UNSIGNED_BYTE / Uint8Array
      return dataViewToUint8; // for joints
    case 5120: // BYTE / Int8Array
    case 5122: // SHORT / Int16Array
    case 5125: // UNSIGNED_INT / Uint32Array
    default:
      return null;
  }
};

export const getArrayType = (componentType) => {
  switch (componentType) {
    case 5123: // UNSIGNED_SHORT
      return Uint16Array;
    case 5126: // FLOAT
      return Float32Array;
    case 5121: // UNSIGNED_BYTE / Uint8Array
      return Uint8Array; // for joints
    case 5120: // BYTE / Int8Array
      return Int8Array;
    case 5122: // SHORT / Int16Array
      return Int16Array;
    default:
    case 5125: // UNSIGNED_INT / Uint32Array
      return Uint32Array;
  }
};

export const getGlslProgramLocationsMappedName = (gltfName) => {
  switch (gltfName) {
    case 'position':
      return 'position';
    case 'normal':
      return 'normale';
    case 'texcoord_0':
      return 'texture';
    case 'baseColorFactor':
    case 'color_0':
      return 'color';
    case 'metallicFactor':
      return 'metal';
    case 'roughnessFactor':
      return 'rough';
    case 'joints_0':
      return 'joint';
    case 'weights_0':
      return 'weight';
    case 'tangent':
      return 'tangent';
    default:
      console.warn('unknown gltf primitive attribute', gltfName);
      return undefined;
  }
};

export const getNumComponentPerType = (type) => {
  switch (type) {
    case 'VEC2':
      return 2;
    case 'VEC3':
      return 3;
    case 'VEC4':
      return 4;
    case 'MAT2':
      return 4;
    case 'MAT3':
      return 9;
    case 'MAT4':
      return 16;
    case 'SCALAR':
      return 1;
    default:
      return 0;
  }
};

const getBufferDataFromAccessor = (buffers, bufferViews, accessor) => {
  const {
    bufferView: bufferViewIndex,
    componentType,
    count,
    type,
    byteOffset: accessorByteOffset = 0, // if defined in accessor, its interleaved
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
    bufferViewByteLength - accessorByteOffset,
  );
  const numElement = getNumComponentPerType(type);
  const length = numElement * count;
  const converterMethod = getConvertMethod(componentType);
  return converterMethod ? converterMethod(dataView, length, count, numElement, byteStride) : null;
};

export const getBufferDataFromLayout = (buffers, layout) => {
  const { buffer, componentType, count, numElement, length, byteOffset, byteLength, byteStride } =
    layout;
  const dataView = new DataView(buffers[buffer], byteOffset, byteLength);
  const converterMethod = getConvertMethod(componentType);
  return converterMethod ? converterMethod(dataView, length, count, numElement, byteStride) : null;
};

export const getBufferDataFromTexture = (buffers, bufferView) => {
  const {
    buffer: bufferIndex,
    byteLength: bufferViewByteLength,
    byteOffset: bufferViewByteOffset = 0,
    byteStride,
  } = bufferView;
  const dataView = new DataView(buffers[bufferIndex], bufferViewByteOffset, bufferViewByteLength);
  const numElement = 4; // RBGA
  const length = bufferViewByteLength / Uint8Array.BYTES_PER_ELEMENT;
  const count = length / numElement;
  const componentType = 5121; // uint8
  const converterMethod = getConvertMethod(componentType);
  return converterMethod ? converterMethod(dataView, length, count, numElement, byteStride) : null;
};

export const getMixedInterleavedBufferData = (buffers, bufferViews, accessors) => {
  const arraysByComponentType = {};
  const bv = bufferViews[accessors[0].bufferView];
  const buffer = buffers[bv.buffer];
  const count = accessors[0].count;

  let offset = 0;
  for (let i = 0; i < count; i++) {
    accessors.forEach((accessor) => {
      const { type, componentType } = accessor;
      const numElement = getNumComponentPerType(type);
      const arrayType = getArrayType(componentType);
      const start = offset;
      const end = start + numElement * arrayType.BYTES_PER_ELEMENT;
      const values = Array.from(new arrayType(buffer.slice(start, end)));
      offset = end;
      if (arraysByComponentType[componentType]) {
        arraysByComponentType[componentType].push(...values);
      } else {
        arraysByComponentType[componentType] = values;
      }
    });
  }
  return {
    vertex: new Float32Array(arraysByComponentType['5126']),
    index: new Uint16Array(arraysByComponentType['5123']),
  };
};

export const getBuffersData = (gltf) => {
  const { buffers, accessors, bufferViews } = gltf;
  const newBuffers = buffers?.map((buffer) => base64ToArrayBuffer(buffer.uri));

  const newAccessors = accessors?.map((accessor) => ({
    ...accessor,
    values: getBufferDataFromAccessor(newBuffers, bufferViews, accessor),
  }));

  return { newBuffers, newAccessors };
};

const formatMaterial = (gltfMaterial) =>
  Object.keys(gltfMaterial).reduce((acc, cur) => {
    const name = getGlslProgramLocationsMappedName(cur);
    return { ...acc, [name]: gltfMaterial[cur] };
  }, []);

export const getMaterial = (material, images) => {
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

export function parseGLB(arrayBuffer) {
  const dataView = new DataView(arrayBuffer);
  // GLB header
  const magic = dataView.getUint32(0, true);
  const version = dataView.getUint32(4, true);
  const length = dataView.getUint32(8, true);

  if (magic !== 0x46546c67) throw new Error('Invalid GLB magic string');

  // // First chunk (JSON)
  // const jsonChunkLength = dataView.getUint32(12, true);
  // const jsonChunkType = dataView.getUint32(16, true);
  // const jsonChunkData = new Uint8Array(arrayBuffer, 20, jsonChunkLength);
  // const jsonText = new TextDecoder().decode(jsonChunkData);
  // const gltf = JSON.parse(jsonText);

  // // Second chunk (BIN)
  // const binChunkStart = 20 + jsonChunkLength;
  // const binChunkLength = dataView.getUint32(binChunkStart, true);
  // const binChunkType = dataView.getUint32(binChunkStart + 4, true);
  // const binChunkData = new Uint8Array(arrayBuffer, binChunkStart + 8, binChunkLength);

  // return { gltf, binChunkData, version, length, jsonChunkType, binChunkType };

  let offset = 12;
  let gltf = null;
  let binChunkData = null;

  // Parse chunks
  while (offset < length) {
    const chunkLength = dataView.getUint32(offset, true);
    const chunkType = dataView.getUint32(offset + 4, true);
    offset += 8;

    if (chunkType === 0x4e4f534a) {
      // 'JSON'
      const jsonChunkData = new Uint8Array(arrayBuffer, offset, chunkLength);
      const jsonText = new TextDecoder().decode(jsonChunkData);
      gltf = JSON.parse(jsonText);
    } else if (chunkType === 0x004e4942) {
      // 'BIN'
      binChunkData = arrayBuffer.slice(offset, offset + chunkLength);
    }
    // Ignore other chunk types
    offset += chunkLength;
  }

  // Attach binChunkData to gltf.buffers[0] if present
  if (gltf && binChunkData && gltf.buffers && gltf.buffers.length > 0) {
    gltf.buffers[0].uri = undefined; // Remove uri, as data is now in buffer
    gltf.buffers[0].data = binChunkData;
  }

  return { gltf, version, length };
}

const processJointChildren = (children, joints) =>
  children.map((childId) => {
    const nodeIndex = joints.findIndex((node) => node.id === childId);
    const newJoint = joints.splice(nodeIndex, 1)[0];
    if (newJoint.children) {
      newJoint.children = processChildren(newJoint.children, joints);
    }
    const { id, ...rest } = newJoint;
    return rest;
  });

export const getHierarchyJoints = (jointNodes) => {
  const tmpArray = jointNodes.slice();
  const hierarchyJoints = [];
  while (tmpArray.length !== 0) {
    const currentJoint = tmpArray.shift();
    if (currentJoint.children) {
      currentJoint.children = processJointChildren(currentJoint.children, tmpArray);
    }
    const { id, ...rest } = currentJoint;
    hierarchyJoints.push(rest);
  }
  return hierarchyJoints;
};
