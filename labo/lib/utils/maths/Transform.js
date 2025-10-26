import Mat4 from './Mat4';
import Quaternion from './Quaternion';

class Transform {
  constructor() {
    this.name = 'Transform';
  }

  static get = (node) => {
    const localMatrix = Transform.handleLocalTransform(node);
    return localMatrix;
  };

  static getNormalMatrix = (localMatrix) => {
    const normalMatrix = localMatrix.getMatrice3x3();
    normalMatrix.inverse(); // erreur quand scale a 0
    normalMatrix.transpose();
    return normalMatrix;
  };

  static handleLocalTransform = (node) => {
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

export default Transform;
