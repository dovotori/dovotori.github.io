import ProcessBase from './ProcessBase';
import TextureNoise from '../textures/TextureNoise';
import Vec3 from '../maths/Vec3';
import Mat4 from '../maths/Mat4';
import { lerp } from '../utils/easing';
import { random } from '../utils/numbers';

export default class extends ProcessBase {
  constructor(gl, width = 1024, height = 1024, useDepth = false, programs = {}) {
    super(gl, width, height, useDepth, programs);
    this.noiseTex = null;
    Object.keys(this.programs).forEach((effect) => {
      switch (effect) {
        case 'ssao':
          this.noiseTex = new TextureNoise(this.gl, 4, 4);
          this.generateSsaoSamples(effect);
          break;
        case 'watercolor2':
        case 'watercolor3':
          this.noiseTex = new TextureNoise(this.gl, 512, 512);
          this.generateSsaoSamples(effect);
          break;
        default:
          break;
      }
    });
  }

  generateSsaoSamples(name) {
    const KERNEL_SIZE = 32;
    const tmpSamples = [KERNEL_SIZE];

    for (let i = 0; i < KERNEL_SIZE; i += 1) {
      tmpSamples[i] = new Vec3(random(-1.0, 1.0), random(-1.0, 1.0), random(-1.0, 1.0));
      tmpSamples[i].normalise();
      tmpSamples[i].multiplyNumber(random(0.0, 1.0));

      let scale = i / KERNEL_SIZE;
      scale = lerp(scale * scale, 0.1, 1.0);
      tmpSamples[i].multiplyNumber(scale);
    }
    for (let i = 0; i < KERNEL_SIZE; i += 1) {
      this.programs[name].setVector(`sampleKernel[${i}]`, tmpSamples[i].get());
    }
  }

  setDOF(range, blur, focusDistance, ppm, tex = null) {
    const program = this.applyTexToProg(this.programs.dof, tex);
    program.setFloat('focusDistance', focusDistance);
    program.setFloat('blur', blur);
    program.setFloat('ppm', ppm);
    program.setVector('range', range);
    program.setTexture(2, this.ppb.getDepthTexture().get(), 'depthMap');
    this.renderToPingPong(program);
  }

  setBloom(bloomTexture, gamma = 1.0, exposure = 1.0, tex = null) {
    const program = this.applyTexToProg(this.programs.bloom, tex);
    program.setFloat('gamma', gamma);
    program.setFloat('exposure', exposure);
    program.setTexture(3, bloomTexture.get(), 'bloomMap');
    this.renderToPingPong(program);
  }

  setBlur(direction, tex = null) {
    const program = this.applyTexToProg(this.programs.blur, tex);
    program.setVector('direction', direction);
    this.renderToPingPong(program);
  }

  setKuwahara(tex = null) {
    const program = this.applyTexToProg(this.programs.kuwahara, tex);
    this.renderToPingPong(program);
  }

  setWatercolor(tex = null) {
    const program = this.applyTexToProg(this.programs.watercolor, tex);
    this.renderToPingPong(program);
  }

  setWatercolor2(gradientStep, advectStep, flipHeightMap, time, tex = null) {
    const program = this.applyTexToProg(this.programs.watercolor2, tex);
    program.setFloat('gradientStep', gradientStep);
    program.setFloat('advectStep', advectStep);
    program.setFloat('flipHeightMap', flipHeightMap);
    program.setFloat('time', time);
    program.setTexture(2, this.noiseTex.get(), 'heightMap');
    this.renderToPingPong(program);
  }

  setWatercolor3(tex = null) {
    const program = this.applyTexToProg(this.programs.watercolor3, tex);
    program.setTexture(2, this.noiseTex.get(), 'noiseMap');
    this.renderToPingPong(program);
  }

  setWatercolorMoving(time, mouse, scale = 4.0, tex = null) {
    const program = this.applyTexToProg(this.programs.watercolorMoving, tex);
    program.setFloat('time', time);
    program.setVector('mouse', mouse);
    program.setFloat('scale', scale);
    this.renderToPingPong(program);
  }

  setSobel(tex = null) {
    const program = this.applyTexToProg(this.programs.sobel, tex);
    this.renderToPingPong(program);
  }

  setBlurPass(size = 2.0, nbPass = 1, tex = null) {
    for (let i = 0; i < nbPass; i += 1) {
      let program = this.applyTexToProg(this.programs.blurDirection, tex);
      program.setFloat('direction', 0.0);
      program.setFloat('size', size);
      this.renderToPingPong(program);

      program = this.applyTexToProg(program, tex);
      program.setFloat('direction', 1.0);
      program.setFloat('size', size);
      this.renderToPingPong(program);
    }
  }

  setFXAA(tex = null) {
    const program = this.applyTexToProg(this.programs.fxaa, tex);
    this.renderToPingPong(program);
  }

  setGamma(gamma, tex = null) {
    const program = this.applyTexToProg(this.programs.gamma, tex);
    program.setFloat('gamma', gamma);
    this.renderToPingPong(program);
  }

  setRGB(deltaX, deltaY, centerX, centerY, tex = null) {
    const program = this.applyTexToProg(this.programs.rgb, tex);
    program.setVector('center', [centerX, centerY]);
    program.setVector('delta', [deltaX, deltaY]);

    this.renderToPingPong(program);
  }

  setVortex(center, radius, angle, tex = null) {
    const program = this.applyTexToProg(this.programs.vortex, tex);
    program.setVector('center', center);
    program.setFloat('radius', radius);
    program.setFloat('angle', angle);
    this.renderToPingPong(program);
  }

  setOil(radius, tex = null) {
    const program = this.applyTexToProg(this.programs.oil, tex);
    program.setFloat('radius', radius);
    this.renderToPingPong(program);
  }

  setSketch(delta, tex = null) {
    const program = this.applyTexToProg(this.programs.sketch, tex);
    program.setFloat('delta', delta);
    this.renderToPingPong(program);
  }

  setPixel(deltaX, deltaY, tex = null) {
    const program = this.applyTexToProg(this.programs.pixel, tex);
    program.setVector('delta', [deltaX, deltaY]);
    this.renderToPingPong(program);
  }

  setWave(time, radius, center, tex = null) {
    const program = this.applyTexToProg(this.programs.wave, tex);
    program.setFloat('time', time);
    program.setFloat('radius', radius);
    program.setVector('center', center);
    this.renderToPingPong(program);
  }

  setSepia(delta, tex = null) {
    const program = this.applyTexToProg(this.programs.sepia, tex);
    program.setFloat('delta', delta);
    this.renderToPingPong(program);
  }

  setGlitch(time, delta, speed, tex = null) {
    const program = this.applyTexToProg(this.programs.glitch, tex);
    program.setFloat('delta', delta);
    program.setFloat('time', time);
    program.setFloat('speed', speed);
    this.renderToPingPong(program);
  }

  setGlitch2(time, delta, speed, tex = null) {
    const program = this.applyTexToProg(this.programs.glitch2, tex);
    program.setFloat('delta', delta);
    program.setFloat('time', time);
    program.setFloat('speed', speed);

    this.renderToPingPong(program);
  }

  setGlitch3(time, delta, tex = null) {
    const program = this.applyTexToProg(this.programs.glitch3, tex);
    program.setFloat('delta', delta);
    program.setFloat('time', time);
    this.renderToPingPong(program);
  }

  setGlitch4(time, delta, rate, tex = null) {
    const program = this.applyTexToProg(this.programs.glitch4, tex);
    program.setFloat('delta', delta);
    program.setFloat('time', time);
    program.setFloat('rate', rate);
    this.renderToPingPong(program);
  }

  setSignature(time, delta, tex = null) {
    const program = this.applyTexToProg(this.programs.signature, tex);
    program.setFloat('delta', delta);
    program.setFloat('time', time);
    this.renderToPingPong(program);
  }

  setSSAO(projection, view, position, normal, depth, radius, tex = null) {
    const program = this.applyTexToProg(this.programs.ssao, tex);
    const invViewProj = new Mat4();
    invViewProj.equal(view).multiply(projection);
    invViewProj.inverse();
    program.setMatrix('inverseProjection', invViewProj.transpose());
    const viewProj = new Mat4();
    viewProj.equal(view).multiply(projection);
    program.setMatrix('projection', viewProj.transpose());
    program.setTexture(2, position, 'positionMap');
    program.setTexture(3, normal, 'normalMap');
    program.setTexture(4, depth, 'depthMap');
    program.setTexture(5, this.noiseTex.get(), 'noiseMap');
    program.setFloat('radius', radius);
    this.renderToPingPong(program);
  }

  compose(albedoMap, diffuseMap, ssaoMap, depthMap, shadowMap) {
    this.passCount = 0;
    const program = this.programs.compose;
    program.setFloat('flipY', -1.0);
    program.setTexture(0, albedoMap, 'albedoMap');
    program.setTexture(1, diffuseMap, 'diffuseMap');
    program.setTexture(2, ssaoMap, 'ssaoMap');
    program.setTexture(3, depthMap, 'depthMap');
    program.setTexture(4, shadowMap, 'shadowMap');
    this.renderToPingPong(program);
  }
}
