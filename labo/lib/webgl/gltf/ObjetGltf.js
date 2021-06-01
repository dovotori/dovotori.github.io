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

  addInstancingVbos(count, vbos) {
    Object.keys(this.nodes).forEach((key) => {
      const node = this.nodes[key];
      const { mesh: meshIndex } = node;
      const { primitives } = this.meshes[meshIndex];
      primitives.forEach((primitive) => primitive.addInstancing(count, vbos));
    });
  }

  formatPrimitives = (gl, primitives) =>
    primitives.map((primitive) => {
      const { vbos, material } = primitive;
      return new ObjetGltfPrimitive(gl, { vbos, material });
    });

  render(program, model) {
    this.renderNodesAndChildren(this.nodes, program, model);
  }

  renderNodesAndChildren = (nodes, program, model) => {
    Object.keys(nodes).forEach((key) => {
      const node = nodes[key];
      this.renderNodeAndChildren(node, program, model);
    });
  };

  renderNodeAndChildren = (node, program, model) => {
    let newModel = model;
    newModel = this.setNodeModel(node, program, model);
    this.renderNode(node, program);
    if (node.children) {
      this.renderNodesAndChildren(node.children, program, newModel);
    }
  };

  renderOnly(keys, program, model) {
    keys.forEach((key) => {
      const node = this.nodes[key];
      this.renderNodeAndChildren(node, program, model);
    });
  }

  renderExcept(keys, program, model) {
    Object.keys(this.nodes).forEach((key) => {
      if (keys.indexOf(key) === -1) {
        const node = this.nodes[key];
        this.renderNodeAndChildren(node, program, model);
      }
    });
  }

  setNodeModel = (node, program, model) => {
    const localMatrix = this.handleLocalTransform(node);
    localMatrix.multiply(model);
    program.setMatrix('model', localMatrix.get());

    const normalMatrix = localMatrix.getMatrice3x3();
    normalMatrix.inverse(); // erreur quand scale a 0
    normalMatrix.transpose();
    program.setMatrix('normalMatrix', normalMatrix.get());
    return localMatrix;
  };

  renderNode(node, program) {
    if (node.mesh !== undefined) {
      const { mesh: meshIndex } = node;
      const { primitives } = this.meshes[meshIndex];
      primitives.forEach((primitive) => primitive.render(program));
    }
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
