import Scene from "../lib/webgl/scenes/Scene";

export default class extends Scene {
  setup() {
    this.req = null;
    this.value = 0;
    this.target = 0;
    this.centerWave = [Math.random(), Math.random()];
    this.req = setTimeout(this.setGlitch, 1000);
  }

  setGlitch = () => {
    this.value = 0;
    this.centerWave = [Math.random(), Math.random()];
    this.target = this.centerWave > 0.5 ? Math.PI : -Math.PI;
    clearTimeout(this.req);
    this.req = setTimeout(this.setGlitch, 2000 + Math.random() * 5000);
  };

  update(time) {
    super.update(time);
    this.value += (this.target - this.value) * 0.04;
  }

  render() {
    super.render();
    const delta = Math.sin(this.value) * 0.1;
    const time = this.time * 0.004;
    this.postProcess.setGlitch(time, delta, delta, this.mngTex.get("signature3").get());
    this.postProcess.setWave(time, delta, this.centerWave);
    this.postProcess.setWatercolorMoving(this.time * 0.002, [this.value, this.value], 4.0);
    this.postProcess.setRGB(delta * 100.0, delta * 100.0, this.centerWave[0], this.centerWave[1]);
    this.postProcess.renderInverse();
  }

  onMouseMove = (mouse) => {
    const newPos = [mouse.relScroll.x / mouse.size.width, mouse.relScroll.y / mouse.size.height];
    const velocity = [this.centerWave[0] - newPos[0], this.centerWave[1] - newPos[1]];
    this.centerWave = newPos;
    this.target = (velocity[0] + velocity[1]) * 100;
  };
}
