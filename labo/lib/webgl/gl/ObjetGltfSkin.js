import ObjetGltf from './ObjetGltf';
import Bone from './Bone';
import Bones from './Bones';
import Mat4 from '../maths/Mat4';
import { lerp } from '../utils/easing';

export default class extends ObjetGltf {
  constructor(gl, data) {
    super(gl, data);
    const { skins } = data;
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

      // if (this.boneProg) {
      //   this.boneProg.setMatrix('model', localMatrix.get());
      //   this.bone.render(this.boneProg);
      // }

      if (children) {
        this.setProgramJoints(children, program, localMatrix, depth + 1);
      }
    });
  };

  setBoneProgram = (program) => {
    this.boneProg = program;
  };
}
