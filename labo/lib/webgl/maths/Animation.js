import { lerp } from '../utils/easing';
import { mapFromRange } from '../utils/numbers';
import Mat4 from './Mat4';
import Quaternion from './Quaternion';
import Sample from './Sample';

class Animation {
  constructor(animations, nodes, forceStep = null) {
    this.speedAnimation = 2000;
    this.animationInterval = [0, 0];
    this.animations = new Map();
    this.nodeTramsforms = new Map();
    this.lastFrame = 0;
    this.addAllAnimations(animations, nodes, forceStep);
  }

  addAllAnimations = (animations, nodes, forceStep) => {
    for (const [key, anims] of animations) {
      const node = nodes.get(key);
      this.nodeTramsforms.set(key, {
        scale: node.scale,
        rotation: node.rotation,
        translation: node.translation,
      });
      this.animations.set(key, this.addAnimations(anims, forceStep));
    }
  };

  addAnimations = (animations, forceStep) => {
    const animPerPath = new Map();
    animations.forEach(({ path, times, output, interpolation }) => {
      let value = forceStep !== null ? output[forceStep] : output[0];
      if (path === 'rotation') {
        value = new Quaternion(...value).toMatrix4();
      }

      // max time for all animations
      this.animationInterval[1] = Math.max(...times, this.animationInterval[1]);

      animPerPath.set(path, {
        output,
        sample: new Sample(times, interpolation, this.speedAnimation),
        customStep: forceStep,
        value,
      });
    });
    return animPerPath;
  };

  update = (time) => {
    const currentTime = time - this.lastFrame;
    if (currentTime > this.animationInterval[1] * this.speedAnimation) {
      this.lastFrame = time;
    }
    this.updateAnimations(currentTime);
  };

  updateAnimations = (time) => {
    for (const [nodeKey, animsPerPath] of this.animations) {
      const newAnimsPerPath = new Map();
      for (const [path, anim] of animsPerPath) {
        if (path === 'rotation') {
          newAnimsPerPath.set(path, Animation.updateQuat(anim, time));
        } else {
          newAnimsPerPath.set(path, Animation.updateVector(anim, time));
        }
      }
      this.animations.set(nodeKey, newAnimsPerPath);
    }
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
        newAnimation.value = new Quaternion(...output[output.length - 1]).toMatrix4();
      } else {
        const previous = output[index - 1];
        const next = output[index];
        const interpolationValue = sample.get();
        newAnimation.value = Quaternion.slerpArray(previous, next, interpolationValue).toMatrix4();
      }
    } else {
      newAnimation.value = new Quaternion(...output[customStep]).toMatrix4();
    }
    return newAnimation;
  };

  handleLocalTransform = (key) => {
    const { translation, rotation, scale } = this.nodeTramsforms.get(key);
    const animations = this.animations.get(key);
    const rotationAnimation = animations?.get('rotation') || null;
    const translationAnimation = animations?.get('translation') || null;
    const scaleAnimation = animations?.get('scale') || null;

    const localMatrix = new Mat4();
    localMatrix.identity();

    // inverse T * R * S
    if (scale || scaleAnimation) {
      localMatrix.scale(...Animation.getVector(scale, scaleAnimation));
    }
    if (rotation || rotationAnimation) {
      localMatrix.multiply(Animation.getRotationMat(rotation, rotationAnimation));
    }
    if (translation || translationAnimation) {
      localMatrix.translate(...Animation.getVector(translation, translationAnimation));
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

  isNodeHasAnimation = (nodeKey) => {
    return this.animations.has(nodeKey);
  };

  static getVector = (vector = [0, 0, 0], vectorAnimation = null) => {
    if (vectorAnimation && vectorAnimation.value) {
      return vectorAnimation.value;
    }
    return vector;
  };

  static getRotationMat = (rotation = [0, 0, 0, 1], rotationAnimation = null) => {
    if (rotationAnimation && rotationAnimation.value) {
      return rotationAnimation.value;
    }
    return new Quaternion(...rotation).toMatrix4();
  };
}

export default Animation;
