import ObjetGltf from './ObjetGltf';
import Quaternion from '../maths/Quaternion';
import Mat4 from '../maths/Mat4';
import Sample from '../maths/Sample';
import { lerp } from '../utils/easing';
import { mapFromRange } from '../utils/numbers';

export default class extends ObjetGltf {
  constructor(gl, data, forceStep = null) {
    super(gl, data);
    const { nodes } = data;
    this.speedAnimation = 2000;
    this.animationInterval = [0, 0];
    this.animations = nodes.reduce((acc, node) => {
      const { animations, name } = node;
      if (animations) {
        acc[name] = this.addAnimations(animations, forceStep);
      }
      return acc;
    }, {});
    this.nodes = nodes.reduce((acc, node) => {
      acc[node.name] = this.removeAnim(node);
      return acc;
    }, {});
    this.lastFrame = new Date().getTime();
  }

  removeAnim = (node) => {
    const { animations, ...nodeWithoutAnim } = node;
    return nodeWithoutAnim;
  };

  addAnimations = (animations, forceStep) => {
    const newAnimations = {};
    animations.forEach(({ path, times, output, interpolation }) => {
      let value = forceStep !== null ? output[forceStep] : output[0];
      if (path === 'rotation') {
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

  getAnimationInterval = (nodes) => {
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

  update = (now) => {
    let currentTime = now - this.lastFrame;
    if (currentTime > this.animationInterval[1] * this.speedAnimation) {
      this.lastFrame = now;
    }
    this.updateAnimations(currentTime);
  };

  updateAnimations = (time) => {
    Object.keys(this.animations).forEach((nodeName) => {
      const nodeAnimations = this.animations[nodeName];
      Object.keys(nodeAnimations).forEach((path) => {
        if (path === 'rotation') {
          this.updateQuat(nodeAnimations[path], time);
        } else {
          this.updateVector(nodeAnimations[path], time);
        }
      });
    });
  };

  updateVector = (animation, time) => {
    const { sample, customStep, output } = animation;

    if (customStep === null) {
      sample.update(time);
      const index = sample.getIndex();
      if (index === 0) {
        animation.value = output[0];
      } else if (index > output.length - 1) {
        animation.value = output[output.length - 1];
      } else {
        const previous = output[index - 1];
        const next = output[index];
        const interpolationValue = sample.get();
        animation.value = previous.map((previousValue, i) =>
          lerp(interpolationValue, previousValue, next[i])
        );
      }
    } else {
      animation.value = output[customStep];
    }
  };

  updateQuat = (animation, time) => {
    const { sample, customStep, output } = animation;

    if (customStep === null) {
      sample.update(time);
      const index = sample.getIndex();
      if (index === 0) {
        animation.value = new Quaternion(...output[0]).toMatrix4();
      } else if (index > output.length - 1) {
        animation.value = new Quaternion(...output[output.length - 1]).toMatrix4();
      } else {
        const previous = output[index - 1];
        const next = output[index];
        const interpolationValue = sample.get();
        animation.value = Quaternion.slerpArray(previous, next, interpolationValue).toMatrix4();
      }
    } else {
      animation.value = new Quaternion(...output[customStep]).toMatrix4();
    }
  };

  handleLocalTransform = (node, invMatrix = null) => {
    const { translation, rotation, scale, matrix, name } = node;
    const animations = this.animations[name];
    const rotationAnimation = (animations && animations.rotation) || null;
    const translationAnimation = (animations && animations.translation) || null;
    const scaleAnimation = (animations && animations.scale) || null;

    const localMatrix = new Mat4();
    localMatrix.identity();

    // inverse T * R * S
    if (scale || scaleAnimation) {
      localMatrix.scale(...this.getVector(scale, scaleAnimation));
    }
    if (rotation || rotationAnimation) {
      localMatrix.multiply(this.getRotationMat(rotation, rotationAnimation));
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
    const animation = this.animations[nodeName][transformType];
    const nbAnimations = animation.output.length;
    const value = mapFromRange(step, 0, 1, 0, nbAnimations - 1);
    animation.customStep = Math.round(value);
  };

  setAnimationSpeed = (nodeName, transformType, millis) => {
    const animation = this.animations[nodeName][transformType];
    animation.sample.setSpeed(millis);
  };

  getVector = (vector = [0, 0, 0], vectorAnimation = null) => {
    if (vectorAnimation && vectorAnimation.value) {
      return vectorAnimation.value;
    }
    return vector;
  };

  getRotationMat = (rotation = [0, 0, 0, 1], rotationAnimation = null) => {
    if (rotationAnimation && rotationAnimation.value) {
      return rotationAnimation.value;
    }
    return new Quaternion(...rotation).toMatrix4();
  };
}
