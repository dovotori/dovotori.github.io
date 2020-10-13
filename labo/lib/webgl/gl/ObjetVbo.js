import Vbo from '../vbos/Vbo';

export default class {
  constructor(gl, vbos) {
    this.gl = gl;
    // POINTS // LINES // TRIANGLES // LINE_STRIP // LINE_LOOP // TRIANGLE_STRIP // TRIANGLE_FAN
    this.modeDessin = this.gl.TRIANGLES;
    // STATIC_DRAW -> change pas // DYNAMIC_DRAW -> repete // STREAM_DRAW -> une fois au moins
    this.modeCalcul = this.gl.STATIC_DRAW;

    this.vbos = Object.keys(vbos).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: new Vbo(gl, { locationKey: cur, modeCalcul: this.modeCalcul, ...vbos[cur] }),
      }),
      {}
    );
  }

  enable(program) {
    this.gl.useProgram(program);
    Object.keys(this.vbos).forEach((key) => {
      this.vbos[key].enable(program);
    });
  }

  render(program) {
    this.enable(program.get());
    const vbo = this.vbos.indices;
    vbo.render(program.get(), this.modeDessin);
  }

  setModeDessin(mode) {
    this.modeDessin = mode;
  }

  setModeCalcul(mode) {
    this.modeCalcul = mode;
  }
}
