import ObjetGltfPrimitive from './ObjetGltfPrimitive';
import Bone from './Bone';
import Bones from './Bones';
import Quaternion from '../maths/Quaternion';
import Mat4 from '../maths/Mat4';
import Sample from '../maths/Sample';
import { lerp } from '../utils/easing';
import { mapFromRange } from '../utils/numbers';

export default class {
  constructor(gl, data) {
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
    if (skins) {
      this.skins = skins.map(({ joints }) => {
        const newJoints = this.enhancedJoints(joints);
        return { joints: newJoints, bones: new Bones(gl, skins) };
      });
    }
    this.bone = new Bone(gl);
    this.boneProg = null;
    this.customTransform = {};
  }

  enhancedJoints = (joints) =>
    joints.map((joint) => {
      const enhancedJoint = this.addAnimations(joint);
      if (enhancedJoint.children) {
        enhancedJoint.children = this.enhancedJoints(enhancedJoint.children);
      }
      return enhancedJoint;
    });

  addAnimations = (node) => {
    const { animations, ...newNode } = node;
    if (animations) {
      animations.forEach(({ path, times, output, interpolation }) => {
        newNode[`${path}Animation`] = {
          output,
          sample: new Sample(times, interpolation),
          custom: null,
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
    const { mesh: meshIndex, skin: skinIndex } = node;

    this.handleWeights(node, program);
    this.handleSkin(skinIndex, program, model);

    const localMatrix = this.handleLocalTransform(node);
    localMatrix.multiply(model);
    program.setMatrix('model', localMatrix.get());

    const normalmatrix = localMatrix.getMatrice3x3();
    normalmatrix.inverse();
    program.setMatrix('normalmatrix', normalmatrix.transpose());

    const { primitives } = this.meshes[meshIndex];
    primitives.forEach((primitive) => primitive.render(program));
  }

  handleWeights = (node, program) => {
    const { mesh: meshIndex, weightsAnimation } = node;
    const { weights } = this.meshes[meshIndex];
    if (weights) {
      let newWeight = weights;
      if (weightsAnimation) {
        const { sample, output } = weightsAnimation;
        sample.update();
        const index = sample.getIndex();
        const previous = output[index - 1];
        const next = output[index];
        newWeight = weights.map((_, i) => lerp(sample.get(), previous[i], next[i]));
      }
      newWeight.forEach((weight, index) => {
        program.setFloat(`weights[${index}]`, weight);
      });
    }
  };

  handleLocalTransform = (node) => {
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

  handleSkin = (skinIndex, program, model) => {
    if (skinIndex !== undefined) {
      const jointMatrix = new Mat4();
      jointMatrix.identity();
      jointMatrix.multiply(model);
      const { joints } = this.skins[skinIndex];
      this.handleJoints(joints, program, jointMatrix);
    }
  };

  handleJoints = (joints, program, parentMatrix, depth = 0) =>
    joints.forEach((joint) => {
      const { invMatrix, children } = joint;

      const localMatrix = this.handleLocalTransform(joint);

      const finalMatrix = new Mat4();
      finalMatrix.setFromArray(invMatrix);
      finalMatrix.multiply(localMatrix);
      program.setMatrix(`jointMat[${depth}]`, finalMatrix.get());

      if (this.boneProg) {
        this.boneProg.setMatrix('model', localMatrix.get());
        this.bone.render(this.boneProg);
      }

      if (children) {
        this.handleJoints(children, program, localMatrix, depth + 1);
      }
    });

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
      }
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
      }
    }
    return quat.toMatrix4();
  };

  setBoneProgram = (program) => {
    this.boneProg = program;
  };
}
