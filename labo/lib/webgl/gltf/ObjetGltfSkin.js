import ObjetGltfAnim from './ObjetGltfAnim';
// import Bone from './Bone';
// import Bones from './Bones';
import Mat4 from '../maths/Mat4';

class ObjectGltfSkin extends ObjetGltfAnim {
  constructor(gl, data, forceStep = null) {
    super(gl, data);
    const { nodes, skins } = data;
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

  removeAnimations = (joints) =>
    joints.map((joint) => {
      const newJoint = joint;
      if (newJoint.children) {
        newJoint.children = this.removeAnimations(newJoint.children);
      }
      return ObjetGltfAnim.removeNodeAnim(newJoint);
    });

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

  renderNode(node, program, model) {
    const { skin: skinIndex } = node;
    if (skinIndex !== undefined) {
      this.setProgramSkin(skinIndex, program);
    }
    super.renderNode(node, program, model);
  }

  setProgramSkin = (skinIndex, program) => {
    if (skinIndex !== undefined) {
      const jointMatrix = new Mat4();
      jointMatrix.identity();
      const { joints } = this.skins[skinIndex];
      this.setProgramJoints(joints, program, jointMatrix);
    }
  };

  setProgramJoints = (joints, program, parentMatrix, depth = 0) => {
    // console.log('--------')
    joints.forEach((joint) => {
      const { invMatrix, children, name } = joint;

      // if (['neutral_bone', 'Bras.L', 'AvBras.L', 'Main.L'].indexOf(name) !== -1) return;
      // if (['neutral_bone', 'Cou', 'Tete'].indexOf(name) !== -1) return;
      // console.log(name, depth, finalMatrix.get())


      const localMatrix = this.handleLocalTransform(joint);
      localMatrix.multiply(parentMatrix);

      const finalMatrix = new Mat4();
      finalMatrix.identity();

      const jointInverse = new Mat4();
      jointInverse.setFromArray(invMatrix);

      finalMatrix.multiply(jointInverse);
      finalMatrix.multiply(localMatrix);

      program.setMatrix(`jointMat[${depth}]`, finalMatrix.get());

      if (children) {
        this.setProgramJoints(children, program, localMatrix, depth + 1);
      }
    });
  };
}

export default ObjectGltfSkin;

/**
 
"skins" : [
  {
    "inverseBindMatrices" : 5,
    "joints" : [
      7, // Hanches
      6, // Torse
      5, // HautTorse
      1, // COU
      0, // TETE
      4, // Bras.L
      3, // AvBras.L
      2, // Main.L
      8 // neutral_bone
    ],
    "name" : "Armature.001"
  }
],

 */
