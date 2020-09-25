import ObjetGltfAnim from './ObjetGltfAnim';
import Bone from './Bone';
import Bones from './Bones';
import Mat4 from '../maths/Mat4';
import { lerp } from '../utils/easing';

export default class extends ObjetGltfAnim {
  constructor(gl, data, forceStep = null) {
    super(gl, data);
    const { skins } = data;
    if (skins) {
      skins.forEach(({ joints }) => {
        this.addJointsAnimations(joints, forceStep);
      });
      this.skins = skins.map(({ joints }) => {
        const newJoints = this.removeAnimations(joints);
        return { joints: newJoints };
      });
    }
  }

  removeAnimations = (joints) => {
    return joints.map((joint) => {
      if (joint.children) {
        joint.children = this.removeAnimations(joint.children);
      }
      return this.removeAnim(joint);
    });
  };

  addJointsAnimations = (joints, forceStep) => {
    joints.forEach((joint) => {
      const { animations, name, children } = joint;
      if (animations) {
        this.animations[name] = this.addAnimations(animations, forceStep);
      }
      if (children) {
        this.addJointsAnimations(children, forceStep);
      }
    });
  };

  renderNode(key, program, model) {
    const node = this.nodes[key];
    const { skin: skinIndex } = node;
    if (skinIndex !== undefined) {
      this.setProgramSkin(skinIndex, program, model);
    }
    super.renderNode(key, program, model);
  }

  setProgramSkin = (skinIndex, program, model) => {
    if (skinIndex !== undefined) {
      const jointMatrix = new Mat4();
      jointMatrix.identity();
      // jointMatrix.multiply(model);
      const { joints } = this.skins[skinIndex];
      this.setProgramJoints(joints, program, jointMatrix);
    }
  };

  setProgramJoints = (joints, program, parentMatrix, depth = 0) => {
    joints.forEach((joint, index) => {
      const { invMatrix, children } = joint;

      const localMatrix = this.handleLocalTransform(joint);
      localMatrix.multiply(parentMatrix);

      const finalMatrix = new Mat4();
      finalMatrix.identity();

      const jointInverse = new Mat4();
      jointInverse.setFromArray(invMatrix);
      jointInverse.resetScale(); // tmp ? fix blender export with inverse matrix

      finalMatrix.multiply(jointInverse);
      finalMatrix.multiply(localMatrix);

      program.setMatrix(`jointMat[${depth}]`, finalMatrix.get());

      if (children) {
        this.setProgramJoints(children, program, localMatrix, depth + 1);
      }
    });
  };
}
