import ObjetGltfPrimitive from './ObjetGltfPrimitive';
import Quaternion from '../maths/Quaternion';
import Mat4 from '../maths/Mat4';
import Sample from '../maths/Sample';
import { lerp } from '../utils/easing';
import { mapFromRange } from '../utils/numbers';

export default class {
  constructor(gl, data, forceStep = null) {
    const { nodes, meshes, skins, materials } = data;
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
    this.nodes = nodes.reduce((acc, node) => {
      const newNode = this.addAnimations(node);
      return { ...acc, [node.name]: newNode };
    }, {});
    this.forceStep = forceStep;
  }

  addAnimations = (node) => {
    const { animations, ...newNode } = node;
    if (animations) {
      animations.forEach(({ path, times, output, interpolation }) => {
        newNode[`${path}Animation`] = {
          output,
          sample: new Sample(times, interpolation, 2000),
          custom: this.forceStep,
        };
      });
    }
    return newNode;
  };

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

    const normalmatrix = localMatrix.getMatrice3x3();
    normalmatrix.inverse();
    normalmatrix.transpose();
    program.setMatrix('normalmatrix', normalmatrix.get());

    const { primitives } = this.meshes[meshIndex];
    primitives.forEach((primitive) => primitive.render(program));
  }

  handleLocalTransform = (node, invMatrix = null) => {
    const {
      translation,
      translationAnimation,
      rotation,
      rotationAnimation,
      scale,
      scaleAnimation,
      matrix,
    } = node;

    const localMatrix = new Mat4();
    localMatrix.identity();

    // inverse T * R * S
    if (scale || scaleAnimation) {
      localMatrix.scale(...this.getVector(scale, scaleAnimation));
    }
    if (rotation || rotationAnimation) {
      localMatrix.multiply(this.getRotationMat4(rotation, rotationAnimation));
    }
    if (translation || translationAnimation) {
      localMatrix.translate(...this.getVector(translation, translationAnimation));
    }

    if (matrix) {
      localMatrix.multiplyArray(matrix);
    }
    return localMatrix;
  };

  setAnimationStep = (nodeName, transformType, step) => {
    const animation = this.nodes[nodeName][`${transformType}Animation`];
    const nbAnimations = animation.output.length;
    const value = mapFromRange(step, 0, 1, 0, nbAnimations - 1);
    animation.custom = Math.round(value);
  };

  setAnimationSpeed = (nodeName, transformType, millis) => {
    const animation = this.nodes[nodeName][`${transformType}Animation`];
    animation.sample.setSpeed(millis);
  };

  getVector = (vector = [0, 0, 0], vectorAnimation) => {
    let newVector = vector;
    if (vectorAnimation) {
      const { sample, output, custom = null } = vectorAnimation;
      if (custom !== null) {
        return output[custom];
      }
      sample.update();
      const index = sample.getIndex();
      if (index > 0) {
        const previous = output[index - 1];
        const next = output[index];
        newVector = previous.map((value, i) => lerp(sample.get(), previous[i], next[i]));
        return newVector;
      }
      return output[0];
    }
    return newVector;
  };

  getRotationMat4 = (rotation = [0, 0, 0, 1], rotationAnimation) => {
    const quat = new Quaternion(...rotation);
    if (rotationAnimation) {
      const { sample, output, custom = null } = rotationAnimation;
      if (custom !== null) {
        return new Quaternion(...output[custom]).toMatrix4();
      }
      sample.update();
      const index = sample.getIndex();
      if (index > 0) {
        const previous = output[index - 1];
        const next = output[index];
        quat.slerpArray(previous, next, sample.get());
        return quat.toMatrix4();
      }
      return new Quaternion(...output[0]).toMatrix4();
    }
    return quat.toMatrix4();
  };
}
