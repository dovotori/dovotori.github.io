import ObjetGltfPrimitive from "./ObjetGltfPrimitive";
import Bone from "./Bone";
import Bones from "./Bones";
import Quaternion from "../maths/Quaternion";
import Mat4 from "../maths/Mat4";
import Sample from "../maths/Sample";
import { lerp } from "../utils/easing";

export default class {
  constructor(gl, data) {
    const { nodes, meshes, skins, materials } = data;
    this.meshes = meshes.map(({ primitives, name = "", weights }) => {
      const primitivesData = primitives.map((primitive) => {
        if (primitive.material) {
          return { ...primitive, material: materials[primitive.material] };
        }
        return primitive;
      });
      return {
        name,
        primitives: this.formatPrimitives(gl, primitivesData),
        weights,
      };
    });
    this.nodes = nodes.reduce((acc, node) => {
      const newNode = this.addAnimations(node);
      acc.push(newNode);
      return acc;
    }, []);
    if (skins) {
      this.skins = skins.map(({ joints }) => {
        const newJoints = this.enhancedJoints(joints);
        return { joints: newJoints, bones: new Bones(gl, skins) };
      });
    }
    this.bone = new Bone(gl);
    this.boneProg = null;
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
      const node = this.nodes[key];
      const { mesh: meshIndex, skin: skinIndex } = node;
      const { primitives } = this.meshes[meshIndex];
      this.handleWeights(node, program);
      this.handleSkin(skinIndex, program, model);
      const localMatrix = this.handleLocalTransform(node);
      localMatrix.multiply(model);
      program.setMatrix("model", localMatrix.get());
      const normalmatrix = localMatrix.getMatrice3x3();
      normalmatrix.inverse();
      program.setMatrix("normalmatrix", normalmatrix.transpose());
      primitives.forEach((primitive) => primitive.render(program));
    });
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
        newWeight = weights.map((_, i) =>
          lerp(sample.get(), previous[i], next[i])
        );
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
    if (scale) {
      localMatrix.scale(...this.getVector(scale, scaleAnimation));
    }
    if (rotation) {
      localMatrix.multiply(this.getRotationMat4(rotation, rotationAnimation));
    }
    if (translation) {
      localMatrix.translate(
        ...this.getVector(translation, translationAnimation)
      );
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
        this.boneProg.setMatrix("model", localMatrix.get());
        this.bone.render(this.boneProg);
      }

      if (children) {
        this.handleJoints(children, program, localMatrix, depth + 1);
      }
    });

  getVector = (vector, vectorAnimation) => {
    let newVector = vector;
    if (vectorAnimation) {
      const { sample, output } = vectorAnimation;
      sample.update();
      const index = sample.getIndex();
      if (index > 0) {
        const previous = output[index - 1];
        const next = output[index];
        newVector = previous.map((value, i) =>
          lerp(sample.get(), previous[i], next[i])
        );
      }
    }
    return newVector;
  };

  getRotationMat4 = (rotation, rotationAnimation) => {
    const quat = new Quaternion(
      rotation[0],
      rotation[1],
      rotation[2],
      rotation[3]
    );
    if (rotationAnimation) {
      const { sample, output } = rotationAnimation;
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
