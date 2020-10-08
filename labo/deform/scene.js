import Scene from '../lib/webgl/scenes/SceneLampe';
import TexturePerlinNoise from '../lib/webgl/textures/TexturePerlinNoise';
import TextureData from '../lib/webgl/textures/TextureData';
import Mat4 from '../lib/webgl/maths/Mat4';
import Pulse from '../lib/webgl/maths/Pulse';
import Spring from '../lib/webgl/maths/Spring';
import Target from '../lib/webgl/maths/Target';
import DualQuaternion from '../lib/webgl/maths/DualQuaternion';
import { degToRad } from '../lib/webgl/utils/numbers';
import UpdateVbo from '../lib/webgl/vbos/UpdateVbo';
import FixVbo from '../lib/webgl/vbos/FixVbo';

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);

    this.texture = new TexturePerlinNoise(gl, 256, 256);
    this.model = new Mat4();
    this.model.identity();
    this.pulse = new Pulse(0);
    this.targetX = new Spring(0);
    this.targetY = new Spring(0);
    this.targetZ = new Target(0, 0.05);
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

    this.mngObj.get(this.config.MAIN_OBJ).setModeDessin(this.gl.POINTS);
    this.targetZ.set(1);
  }

  setupControls = ({ ranges }) => {
    this.button = document.querySelector('.play-button');
    this.sound = this.mngSound.get('akira');
    if (this.button) {
      this.button.addEventListener('click', this.togglePlay, false);
    }

    this.ranges = ranges;
    if (this.config.controls) {
      const { volume, playbackRate } = this.ranges;
      volume.dom.addEventListener('change', this.onChangeVolume, false);
      playbackRate.dom.addEventListener('change', this.onChangePlaybackRate, false);
    }
  };

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

  update(time) {
    super.update(time);

    this.targetX.update();
    this.targetY.update();
    this.targetZ.update();
    this.pulse.update();

    this.model.identity();

    const angle = degToRad(this.targetX.get()) + this.time * 0.0005;
    const angle2 = 0.5; // degToRad(this.targetY.get()) + (this.time * 0.001);

    const quat = new DualQuaternion();
    quat.rotateY(-angle);
    quat.rotateX(-angle2);
    this.model.multiply(quat.toMatrix4());

    this.model.scale(this.targetZ.get());

    const program = this.mngProg.get(this.config.MAIN_PROG);
    program.setFloat('time', this.pulse.get());
  }

  mainRender = (program, texData = null) => {
    // this.mngGltf.get(this.config.MAIN_OBJ).render(program, this.model);
    program.setMatrix('model', this.model.get());
    const normalMatrix = this.model.getMatrice3x3();
    normalMatrix.inverse();
    normalMatrix.transpose();
    program.setMatrix('normalMatrix', normalMatrix.get());
    program.setTexture(2, this.texture.get(), 'noiseMap');
    program.setTexture(3, this.mngTex.get('earth').get(), 'colorMap');

    if (texData) {
      program.setTexture(5, texData.get(), 'displacementMap');
    }
    this.mngObj.get(this.config.MAIN_OBJ).render(program.get());
  };

  render() {
    super.render();

    const amplitudes = this.mngSound.get('akira').getAmplitudes();
    const texData = new TextureData(this.gl, amplitudes);

    this.mainRender(this.mngProg.get(this.config.MAIN_PROG), texData);

    const progCircle = this.mngProg.get('frequencyCircle');
    progCircle.setMatrix('projection', this.camera.getProjection().get());
    progCircle.setMatrix('view', this.camera.getView().get());
    progCircle.setMatrix('model', this.model.get());
    progCircle.setInt('length', this.fVbo.getCount());
    progCircle.setInt('maxfrequency', 256.0);
    this.uVbo.start(progCircle.get(), 'value', amplitudes);
    this.fVbo.start(progCircle.get(), 'index');
    this.gl.drawArrays(this.gl.LINE_LOOP, 0, this.fVbo.getCount());
    this.uVbo.end();

    const progGrid = this.mngProg.get('frequencyGrid');
    progGrid.setMatrix('model', this.model.get());
    progGrid.setInt('length', this.fVbo.getCount());
    progGrid.setInt('maxfrequency', 256.0);
    this.uVbo.start(progGrid.get(), 'value', amplitudes);
    this.fVbo.start(progGrid.get(), 'index');
    // this.gl.drawArrays(this.gl.POINTS, 0, this.fVbo.getCount());
    this.uVbo.end();

    // DEBUG
    // this.postProcess.render(texData.get());
  }

  onMouseDrag = (mouse) => {
    this.targetX.set(mouse.relPrevious.x * 0.1);
    this.targetY.set(mouse.relPrevious.y * 0.1);
  };

  onMouseWheel = (mouse) => {
    let target = -mouse.deltaY;
    target = Math.min(target, 2);
    target = Math.max(target, 1);
    this.targetZ.set(target);
  };

  onMouseClick = () => {
    this.pulse.set(1000);
  };

  destroy() {
    if (this.button) {
      this.button.addEventListener('click', this.togglePlay, false);
    }

    if (this.ranges) {
      const { volume, playbackRate } = this.ranges;
      volume.dom.removeEventListener('change', this.onChangeVolume, false);
      playbackRate.dom.removeEventListener('change', this.onChangePlaybackRate, false);
    }

    if (this.sound) {
      this.sound.stop();
    }
  }
}
