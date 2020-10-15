import ObjetGltfPrimitive from './ObjetGltfPrimitive';
import Quaternion from '../maths/Quaternion';
import Mat4 from '../maths/Mat4';

export default class {
  constructor(gl, data) {
    const { nodes, meshes, materials } = data;
    this.meshes = meshes.map(({ primitives, name = '', weights }) => {
      const primitivesData = primitives.map((primitive) => {
        if (primitive.material !== undefined) {
          return { ...primitive, material: materials[primitive.material] };
        }
        return primitive;
      });
      const formatPrimitives = this.formatPrimitives(gl, primitivesData);
      return {
        name,
        primitives: formatPrimitives,
        weights,
      };
    });
    this.nodes = nodes;
  }

  formatPrimitives = (gl, primitives) =>
    primitives.map((primitive) => {
      const { vbos, material } = primitive;
      return new ObjetGltfPrimitive(gl, { vbos, material });
    });

  render(program, model) {
    Object.keys(this.nodes).forEach((key) => {
      this.renderNode(key, program, model);
    });
  }

  renderNode(key, program, model) {
    const node = this.nodes[key];
    const { mesh: meshIndex } = node;

    const localMatrix = this.handleLocalTransform(node);
    localMatrix.multiply(model);
    program.setMatrix('model', localMatrix.get());

    localMatrix.resetTranslate();
    const normalMatrix = localMatrix.getMatrice3x3();
    normalMatrix.inverse(); // erreur quand scale a 0
    normalMatrix.transpose();
    program.setMatrix('normalMatrix', normalMatrix.get());

    const { primitives } = this.meshes[meshIndex];
    primitives.forEach((primitive) => primitive.render(program));
  }

  handleLocalTransform = (node) => {
    const { translation, rotation, scale, matrix } = node;

    const localMatrix = new Mat4();
    localMatrix.identity();

    // inverse T * R * S
    if (scale) {
      localMatrix.scale(...scale);
    }
    if (rotation) {
      localMatrix.multiply(new Quaternion(...rotation).toMatrix4());
    }
    if (translation) {
      localMatrix.translate(...translation);
    }

    if (matrix) {
      localMatrix.multiplyArray(matrix);
    }
    return localMatrix;
  };
}
