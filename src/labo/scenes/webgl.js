import { Scene } from '../../game';

export default class extends Scene {
  constructor(gl, config, assets, width = 512, height = 512) {
    super(gl, config, assets, width, height);
    this.setGlitch = this.setGlitch.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.req = null;
    this.value = 0;
    this.target = 0;
    this.centerWave = [Math.random(), Math.random()];
    this.req = setTimeout(this.setGlitch, 1000);
  }

  setGlitch() {
    this.value = 0;
    this.centerWave = [Math.random(), Math.random()];
    this.target = this.centerWave > 0.5 ? Math.PI : -Math.PI;
    clearTimeout(this.req);
    this.req = setTimeout(this.setGlitch, 2000 + Math.random() * 5000);
  }

  update() {
    super.update();
    this.value += (this.target - this.value) * 0.04;
  }

  onMouseMove(mouse) {
    const newPos = [
      mouse.relScroll.x / mouse.size.width,
      1 - mouse.relScroll.y / mouse.size.height,
    ];
    const velocity = [
      this.centerWave[0] - newPos[0],
      this.centerWave[1] - newPos[1],
    ];
    this.centerWave = newPos;
    this.target = (velocity[0] + velocity[1]) * 100;
  }

  render() {
    super.render();

    const delta = Math.sin(this.value) * 0.1;
    const time = this.time * 0.04;
    this.postProcess.setGlitch(
      time,
      delta,
      delta,
      this.mngTex.get('android-chrome-256x256').get(),
    );
    this.postProcess.setWave(time, delta, this.centerWave);
    // this.postProcess.setRGB(
    //   delta * 100.0,
    //   delta * 100.0,
    //   this.centerWave[0],
    //   this.centerWave[1]
    // );
    this.postProcess.render();
  }
}
