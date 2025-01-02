import Quaternion from "./Quaternion";
import Mat4 from "./Mat4";

class Transform {
  static get = (node) => {
    const localMatrix = Transform.handleLocalTransform(node);
    return localMatrix;
  };

  static getNormalMatrix = (localMatrix) => {
    const normalMatrix = localMatrix.getPureRotationMatrix();
    // not sure when to inverse (with rotation create wrong normales)
    // TODO negative scale fuck normal, maybe can remove sign of scale
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
