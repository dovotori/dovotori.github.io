import { lerp } from "../../utils/easing";
import Mat4 from "../../utils/maths/Mat4";
import Quaternion from "../../utils/maths/Quaternion";
import Sample from "../../utils/maths/Sample";
import { mapFromRange } from "../../utils/numbers";
import ObjetGltf from "./ObjetGltf";

class ObjectGltfAnim extends ObjetGltf {
  constructor(gl, data, forceStep = null) {
    super(gl, data);
    const { nodes } = data;
    this.speedAnimation = 2000;
    this.animationInterval = [0, 0];
    this.animations = this.addAllAnimations(nodes, forceStep);
    this.nodes = this.removeNodesAnimations(nodes);
    this.lastFrame = 0;
  }

  addAllAnimations = (nodes, forceStep) =>
    Object.keys(nodes).reduce((acc, key) => {
      let newAcc = acc;
      const { animations, name, children } = nodes[key];
      if (animations) {
        newAcc[name] = this.addAnimations(animations, forceStep);
      }
      if (children) {
        newAcc = { ...acc, ...this.addAllAnimations(children, forceStep) };
      }
      return newAcc;
    }, {});

  addAnimations = (animations, forceStep) => {
    const newAnimations = {};
    animations.forEach(({ path, times, output, interpolation }) => {
      let value = forceStep !== null ? output[forceStep] : output[0];
      if (path === "rotation") {
        value = new Quaternion(...value).toMatrix4();
      }

      // max time
      this.animationInterval[1] = Math.max(...times, this.animationInterval[1]);

      newAnimations[path] = {
        output,
        sample: new Sample(times, interpolation, this.speedAnimation),
        customStep: forceStep,
        value,
      };
    });
    return newAnimations;
  };

  removeNodesAnimations = (nodes) =>
    Object.keys(nodes).reduce((acc, nodeKey) => {
      let newAcc = acc;
      const node = nodes[nodeKey];
      newAcc[node.name] = ObjectGltfAnim.removeNodeAnim(node);
      if (node.children) {
        newAcc = { ...newAcc, ...this.removeNodesAnimations(node.children) };
      }
      return acc;
    }, {});

  static removeNodeAnim = (node) => {
    const { animations, ...nodeWithoutAnim } = node;
    return nodeWithoutAnim;
  };

  static getAnimationInterval = (nodes) => {
    let max = 0;
    nodes.forEach((node) => {
      const { animations } = node;
      if (animations) {
        animations.forEach((animation) => {
          const { times } = animation;
          max = Math.max(...times, max);
        });
      }
    });
    return [0, max];
  };

  update = (time) => {
    const currentTime = time - this.lastFrame;
    if (currentTime > this.animationInterval[1] * this.speedAnimation) {
      this.lastFrame = time;
    }
    this.updateAnimations(currentTime);
  };

  updateAnimations = (time) => {
    Object.keys(this.animations).forEach((nodeName) => {
      const nodeAnimations = this.animations[nodeName];
      Object.keys(nodeAnimations).forEach((path) => {
        if (path === "rotation") {
          nodeAnimations[path] = ObjectGltfAnim.updateQuat(
            nodeAnimations[path],
            time,
          );
        } else {
          nodeAnimations[path] = ObjectGltfAnim.updateVector(
            nodeAnimations[path],
            time,
          );
        }
      });
    });
  };

  static updateVector = (animation, time) => {
    const newAnimation = animation;
    const { sample, customStep, output } = newAnimation;

    if (customStep === null) {
      sample.update(time);
      const index = sample.getIndex();
      if (index === 0) {
        [newAnimation.value] = output;
      } else if (index > output.length - 1) {
        newAnimation.value = output[output.length - 1];
      } else {
        const previous = output[index - 1];
        const next = output[index];
        const interpolationValue = sample.get();
        newAnimation.value = previous.map((previousValue, i) =>
          lerp(interpolationValue, previousValue, next[i]),
        );
      }
    } else {
      newAnimation.value = output[customStep];
    }
    return newAnimation;
  };

  static updateQuat = (animation, time) => {
    const newAnimation = animation;
    const { sample, customStep, output } = newAnimation;

    if (customStep === null) {
      sample.update(time);
      const index = sample.getIndex();
      if (index === 0) {
        newAnimation.value = new Quaternion(...output[0]).toMatrix4();
      } else if (index > output.length - 1) {
        newAnimation.value = new Quaternion(
          ...output[output.length - 1],
        ).toMatrix4();
      } else {
        const previous = output[index - 1];
        const next = output[index];
        const interpolationValue = sample.get();
        newAnimation.value = Quaternion.slerpArray(
          previous,
          next,
          interpolationValue,
        ).toMatrix4();
      }
    } else {
      newAnimation.value = new Quaternion(...output[customStep]).toMatrix4();
    }
    return newAnimation;
  };

  handleLocalTransform = (node) => {
    const { translation, rotation, scale, matrix, name } = node;
    const animations = this.animations[name];
    const rotationAnimation = (animations && animations.rotation) || null;
    const translationAnimation = (animations && animations.translation) || null;
    const scaleAnimation = (animations && animations.scale) || null;

    const localMatrix = new Mat4();
    localMatrix.identity();

    // inverse T * R * S
    if (scale || scaleAnimation) {
      localMatrix.scale(...ObjectGltfAnim.getVector(scale, scaleAnimation));
    }
    if (rotation || rotationAnimation) {
      localMatrix.multiply(
        ObjectGltfAnim.getRotationMat(rotation, rotationAnimation),
      );
    }
    if (translation || translationAnimation) {
      localMatrix.translate(
        ...ObjectGltfAnim.getVector(translation, translationAnimation),
      );
    }

    if (matrix) {
      localMatrix.multiplyArray(matrix);
    }
    return localMatrix;
  };

  setAnimationStep = (nodeName, transformType, step) => {
    const animation = this.animations[nodeName][transformType];
    const nbAnimations = animation.output.length;
    const value = mapFromRange(step, 0, 1, 0, nbAnimations - 1);
    animation.customStep = Math.round(value);
  };

  setAnimationSpeed = (nodeName, transformType, millis) => {
    const animation = this.animations[nodeName][transformType];
    animation.sample.setSpeed(millis);
  };

  static getVector = (vector = [0, 0, 0], vectorAnimation = null) => {
    if (vectorAnimation && vectorAnimation.value) {
      return vectorAnimation.value;
    }
    return vector;
  };

  static getRotationMat = (
    rotation = [0, 0, 0, 1],
    rotationAnimation = null,
  ) => {
    if (rotationAnimation && rotationAnimation.value) {
      return rotationAnimation.value;
    }
    return new Quaternion(...rotation).toMatrix4();
  };
}

export default ObjectGltfAnim;
