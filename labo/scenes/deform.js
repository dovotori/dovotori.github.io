import Scene from '../webgl/scenes/SceneLampe';
import TexturePerlinNoise from '../webgl/textures/TexturePerlinNoise';
import TextureData from '../webgl/textures/TextureData';
import Mat4 from '../webgl/maths/Mat4';
import Pulse from '../webgl/maths/Pulse';
import Spring from '../webgl/maths/Spring';
import Target from '../webgl/maths/Target';
import DualQuaternion from '../webgl/maths/DualQuaternion';
import { degToRad } from "../webgl/utils/numbers";
import UpdateVbo from "../webgl/gl/UpdateVbo";
import FixVbo from "../webgl/gl/FixVbo";

export default class extends Scene {
  constructor(gl, config, assets, width = 512, height = 512) {
    super(gl, config, assets, width, height);

    this.MAIN_PROG = config.MAIN_PROG;
    this.MAIN_OBJ = config.MAIN_OBJ;

    this.texture = new TexturePerlinNoise(gl, 256, 256);
    this.model = new Mat4();
    this.model.identity();
    this.pulse = new Pulse(0);
    this.targetX = new Spring(0);
    this.targetY = new Spring(0);
    this.targetZ = new Target(1, 0.05);
    this.mouseCanvasPosition = {
      x: 0,
      y: 0,
    };
    const frequencyLength = this.mngSound.get('akira').getFrequencyLength();
    this.uVbo = new UpdateVbo(this.gl, frequencyLength);
    let indexes = new Array(frequencyLength);
    indexes.fill(0);
    indexes = indexes.map((_, index) => index);
    this.fVbo = new FixVbo(this.gl, indexes);

    this.mngObj.get(this.MAIN_OBJ).setModeDessin(this.gl.POINTS);

    this.setupControls();
  }

  setupControls = () => {
    this.button = document.querySelector('.play-button');
    this.sound = this.mngSound.get('akira');
    if (this.button) {
      this.button.addEventListener('click', this.togglePlay, false);
      this.button.removeAttribute('style');
    }

    if (this.config.controls) {
      const controls = document.querySelector('#controls');

      if (controls) {
        const { volume, playbackRate } = this.config.controls;

        this.volumeRange = document.querySelector(`#${volume.domId}`);
        if (this.volumeRange) {
          this.volumeRange.addEventListener('change', this.onChangeVolume, false);
        }

        this.playbackRange = document.querySelector(`#${playbackRate.domId}`);
        if (this.playbackRange) {
          this.playbackRange.addEventListener('change', this.onChangePlaybackRate, false);
        }

        controls.removeAttribute('style');
      }
    }
  }

  togglePlay = () => {
    if (this.sound && this.button) {
      this.sound.togglePause();
      if (!this.sound.getIsPause()) {
        this.button.setAttribute('data-play', true);
      } else {
        this.button.removeAttribute('data-play');
      }
    }
  };

  onChangeVolume = (e) => {
    this.sound.setVolume(e.target.value * 0.01);
  };

  onChangePlaybackRate = (e) => {
    this.sound.setPlaybackRate(e.target.value * 0.02);
  };

  update() {
    super.update();

    this.targetX.update();
    this.targetY.update();
    this.targetZ.update();
    this.pulse.update();

    this.model.identity();

    const angle = degToRad(this.targetX.get()) + (this.time * 0.01);
    const angle2 = 0.5; // degToRad(this.targetY.get()) + (this.time * 0.001);

    const quat = new DualQuaternion();
    quat.rotateY(-angle);
    quat.rotateX(-angle2);
    this.model.multiply(quat.toMatrix4());

    const program = this.mngProg.get(this.MAIN_PROG);
    program.setVector("resolution", [
      this.containerSize.width,
      this.containerSize.height,
    ]);
    program.setFloat('time', this.pulse.get());
    this.setLampeInfos(program);
  }

  effects() {
    const delta = Math.cos(this.time * 0.01) * 0.04;
    if (delta > 0) {
      this.postProcess.setGlitch(
        this.time * 0.07 + this.target.get(),
        delta,
        delta
      );
    }
    this.postProcess.setWave(0.05, delta, [
      this.mouseCanvasPosition.x,
      this.mouseCanvasPosition.y,
    ]);
    this.postProcess.setFXAA();
  }

  mainRender = (program, texData = null) => {
    // this.mngGltf.get(this.MAIN_OBJ).render(program, this.model);
    program.setMatrix("model", this.model.get());
    const normalmatrix = this.model.getMatrice3x3();
    normalmatrix.inverse();
    program.setMatrix("normalmatrix", normalmatrix.transpose());
    program.setTexture(2, this.texture.get(), "noiseMap");
    program.setTexture(3, this.mngTex.get("earth").get(), "colorMap");

    if (texData) {
      program.setTexture(5, texData.get(), "displacementMap");
    }
    this.mngObj.get(this.MAIN_OBJ).render(program.get());  
  }

  renderToBuffer = (program) => {
    this.mainRender(program);
  }

  renderBasiqueForShadow() {
    const program = this.mngProg.get("basique3d");
    program.setMatrix("projection", this.camera.getProjection().get());
    program.setMatrix("view", this.getLampeViewMatrix(0).get());
    program.setMatrix("model", this.model.get());
    this.renderToBuffer(program);
  }

  render() {
    super.render();

    const amplitudes = this.mngSound.get('akira').getAmplitudes();
    const texData = new TextureData(this.gl, amplitudes);

    // this.postProcess.start();
    this.mainRender(this.mngProg.get(this.MAIN_PROG), texData);
    // this.postProcess.end();

    // // this.effects();
    // this.postProcess.render();

    const progCircle = this.mngProg.get("frequencyCircle");
    progCircle.setMatrix("projection", this.camera.getProjection().get());
    progCircle.setMatrix("view", this.camera.getView().get());
    progCircle.setMatrix("model", this.model.get());
    progCircle.setInt("length", this.fVbo.getCount());
    progCircle.setInt("maxfrequency", 256.0);
    this.uVbo.start(progCircle.get(), "value", amplitudes);
    this.fVbo.start(progCircle.get(), "index");
    this.gl.drawArrays(this.gl.LINE_LOOP, 0, this.fVbo.getCount());
    this.uVbo.end();

    const progGrid = this.mngProg.get("frequencyGrid");
    progGrid.setMatrix("projection", this.camera.getProjection().get());
    progGrid.setMatrix("view", this.camera.getView().get());
    progGrid.setMatrix("model", this.model.get());
    progGrid.setInt("length", this.fVbo.getCount());
    progGrid.setInt("maxfrequency", 256.0);
    this.uVbo.start(progGrid.get(), "value", amplitudes);
    this.fVbo.start(progGrid.get(), "index");
    // this.gl.drawArrays(this.gl.POINTS, 0, this.fVbo.getCount());
    this.uVbo.end();

    // DEBUG
    // this.postProcess.render(texData.get());
  }

  onMouseDrag = (mouse) => {
    this.targetX.set(mouse.relPrevious.x * 0.1);
    this.targetY.set(mouse.relPrevious.y * 0.1);
  }

  onMouseWheel = (mouse) => {
    let target = -mouse.deltaY;
    target = Math.min(target, 2);
    target = Math.max(target, 1);
    this.targetZ.set(target);
  }

  onMouseClick = () => {
    this.pulse.set(1000);
  }

  destroy() {
    if (this.button) {
      this.button.addEventListener('click', this.togglePlay, false);
    }

    if (this.volumeRange) {
      this.volumeRange.removeEventListener('change', this.onChangeVolume, false);
    }

    if (this.playbackRange) {
      this.playbackRange.removeEventListener('change', this.onChangePlaybackRate, false);
    }

    if (this.sound) {
      this.sound.stop();
    }
  }
}
