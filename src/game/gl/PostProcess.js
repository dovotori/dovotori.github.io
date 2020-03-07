import PingPongBuffer from './PingPongBuffer';
import Screen from './Screen';
import Program from './Program';
import { TextureNoise } from '../textures';
import { Vec3, Mat4 } from '../geometry';
import * as glsl from '../constants/shaders/screen';
import { lerp } from '../utils/easing';
import { random } from '../utils/numbers';

export default class {
  constructor(gl, effects = [], width = 1024, height = 1024, useDepth = false) {
    this.gl = gl;
    this.ppb = new PingPongBuffer(this.gl, width, height, useDepth);
    this.screen = new Screen(this.gl);
    this.width = width;
    this.height = height;
    this.noiseTex = null;

    this.programs = {};
    const finalEffects = [...effects, 'screen', 'debug'];
    finalEffects.forEach((effect) => {
      this.programs[effect] = new Program(this.gl, glsl[effect]);
      // pass resolution for effect which need it
      if (glsl[effect].uniforms.indexOf('resolution') !== -1) {
        this.programs[effect].setVector('resolution', [
          this.width,
          this.height,
        ]);
      }

      switch (effect) {
        case 'ssao':
          this.noiseTex = new TextureNoise(this.gl, 4, 4);
          this.generateSsaoSamples(effect);
          break;
        default:
          break;
      }
    });

    this.passCount = 0;
  }

  generateSsaoSamples(name) {
    const KERNEL_SIZE = 32;
    const tmpSamples = [KERNEL_SIZE];

    for (let i = 0; i < KERNEL_SIZE; i += 1) {
      tmpSamples[i] = new Vec3(
        random(-1.0, 1.0),
        random(-1.0, 1.0),
        random(-1.0, 1.0),
      );
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

  start() {
    this.ppb.start();
    this.passCount = 0;
  }

  end() {
    this.ppb.end();
  }

  resize(box) {
    this.ppb.resize(box);
  }

  commonFirstTex(program, tex = null) {
    const usePPB = tex === null;
    this.passCount = usePPB ? this.passCount + 1 : 0;
    /*
     * texture index ne peux pas etre 0 car 0 est utilisé
     * pour écrire la texture -> gl.COLOR_ATTACHMENT0
     */
    const textureIdx = this.passCount + 1;
    const finalTexture = usePPB ? this.ppb.getTexture().get() : tex;
    program.setTexture(textureIdx, finalTexture, 'textureMap');
    const flipYWay = this.passCount > 0 ? -1.0 : 1.0;
    program.setFloat('flipY', flipYWay);
    return program;
  }

  commonRenderPass(program) {
    this.ppb.swap();
    this.ppb.start();
    this.screen.render(program.get());
    this.ppb.end();
  }

  render(tex = null, debug = false) {
    if (debug) {
      const program = this.commonFirstTex(this.programs.debug, tex);
      this.screen.render(program.get());
    } else {
      const program = this.commonFirstTex(this.programs.screen, tex);
      this.screen.render(program.get());
    }
  }

  setDOF(range, blur, focusDistance, ppm, tex = null) {
    const program = this.commonFirstTex(this.programs.dof, tex);
    program.setFloat('focusDistance', focusDistance);
    program.setFloat('blur', blur);
    program.setFloat('ppm', ppm);
    program.setVector('range', range);
    program.setTexture(2, this.ppb.getDepthTexture().get(), 'depthMap');
    this.commonRenderPass(program);
  }

  setBloom(bloomTexture, gamma, exposure, tex = null) {
    const program = this.commonFirstTex(this.programs.bloom, tex);
    program.setFloat('gamma', gamma);
    program.setFloat('exposure', exposure);
    program.setTexture(2, bloomTexture.get(), 'bloomMap');
    this.commonRenderPass(program);
  }

  setBlur(direction, tex = null) {
    const program = this.commonFirstTex(this.programs.blur, tex);
    program.setVector('direction', direction);
    this.commonRenderPass(program);
  }

  setWatercolor(tex = null) {
    const program = this.commonFirstTex(this.programs.watercolor, tex);
    this.commonRenderPass(program);
  }

  setBlurPass(size = 2.0, nbPass = 1, tex = null) {
    for (let i = 0; i < nbPass; i += 1) {
      let program = this.commonFirstTex(this.programs.blurDirection, tex);
      program.setFloat('direction', 0.0);
      program.setFloat('size', size);
      this.commonRenderPass(program);

      program = this.commonFirstTex(program, tex);
      program.setFloat('direction', 1.0);
      program.setFloat('size', size);
      this.commonRenderPass(program);
    }
  }

  setFXAA(tex = null) {
    const program = this.commonFirstTex(this.programs.fxaa, tex);
    this.commonRenderPass(program);
  }

  setGamma(gamma, tex = null) {
    const program = this.commonFirstTex(this.programs.gamma, tex);
    program.setFloat('gamma', gamma);
    this.commonRenderPass(program);
  }

  setRGB(deltaX, deltaY, centerX, centerY, tex = null) {
    const program = this.commonFirstTex(this.programs.rgb, tex);
    program.setVector('center', [centerX, centerY]);
    program.setVector('delta', [deltaX, deltaY]);

    this.commonRenderPass(program);
  }

  setPixel(deltaX, deltaY, tex = null) {
    const program = this.commonFirstTex(this.programs.pixel, tex);
    program.setVector('delta', [deltaX, deltaY]);
    this.commonRenderPass(program);
  }

  setWave(time, radius, center, tex = null) {
    const program = this.commonFirstTex(this.programs.wave, tex);
    program.setFloat('time', time);
    program.setFloat('radius', radius);
    program.setVector('center', center);
    this.commonRenderPass(program);
  }

  setGlitch(time, delta, speed, tex = null) {
    const program = this.commonFirstTex(this.programs.glitch, tex);
    program.setFloat('delta', delta);
    program.setFloat('time', time);
    program.setFloat('speed', speed);
    this.commonRenderPass(program);
  }

  setGlitch2(time, delta, speed, tex = null) {
    const program = this.commonFirstTex(this.programs.glitch2, tex);
    program.setFloat('delta', delta);
    program.setFloat('time', time);
    program.setFloat('speed', speed);

    this.commonRenderPass(program);
  }

  setGlitch3(time, delta, tex = null) {
    const program = this.commonFirstTex(this.programs.glitch3, tex);
    program.setFloat('delta', delta);
    program.setFloat('time', time);
    this.commonRenderPass(program);
  }

  setGlitch4(time, delta, rate, tex = null) {
    const program = this.commonFirstTex(this.programs.glitch4, tex);
    program.setFloat('delta', delta);
    program.setFloat('time', time);
    program.setFloat('rate', rate);
    this.commonRenderPass(program);
  }

  setSignature(time, delta, tex = null) {
    const program = this.commonFirstTex(this.programs.signature, tex);
    program.setFloat('delta', delta);
    program.setFloat('time', time);
    this.commonRenderPass(program);
  }

  setSSAO(projection, view, position, normal, depth, radius, tex = null) {
    const program = this.commonFirstTex(this.programs.ssao, tex);
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
    this.commonRenderPass(program);
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
    this.commonRenderPass(program);
  }

  getTexture() {
    return this.ppb.getTexture();
  }

  renderSimple(program) {
    program.setFloat('flipY', -1.0);
    this.screen.render(program.get());
  }
}
