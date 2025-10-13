import Vbos from "../vbos/Vbos";

const createVbosFromPrimitive = (gl, primitive) =>
  Object.keys(primitive).reduce((acc, locationKey) => {
    const values = primitive[locationKey];
    let componentType;
    let type;
    let size;
    let convertedValues;

    switch (locationKey) {
      case "color": {
        type = "VEC4";
        size = 4;
        componentType = gl.FLOAT;
        convertedValues = new Float32Array(values);
        break;
      }

      case "texture": {
        type = "VEC2";
        size = 2;
        componentType = gl.FLOAT;
        convertedValues = new Float32Array(values);
        break;
      }
      case "indices": {
        type = "SCALAR";
        size = 1;
        componentType = gl.UNSIGNED_SHORT;
        convertedValues = new Uint16Array(values);
        break;
      }
      case "side":
      case "index":
      case "random": {
        type = "FLOAT";
        size = 1;
        componentType = gl.FLOAT;
        convertedValues = new Float32Array(values);
        break;
      }
      case "position":
      case "next":
      case "previous":
      case "normale":
      default: {
        type = "VEC3";
        size = 3;
        componentType = gl.FLOAT;
        convertedValues = new Float32Array(values);
        break;
      }
    }
    acc[locationKey] = {
      locationKey,
      type,
      values: convertedValues,
      count: values.length / size,
      componentType,
      size,
    };
    return acc;
  }, {});

export default class extends Vbos {
  constructor(gl, primitive, isDynamic = false) {
    const vbos = createVbosFromPrimitive(gl, primitive);
    super(gl, vbos, isDynamic);
  }
}
