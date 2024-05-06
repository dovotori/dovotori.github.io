import Vbo from './Vbo';

export default class {
  constructor(gl, vbos, isDynamic = false) {
    this.gl = gl;
    // POINTS // LINES // TRIANGLES // LINE_STRIP // LINE_LOOP // TRIANGLE_STRIP // TRIANGLE_FAN
    this.modeDessin = this.gl.TRIANGLES;
    // STATIC_DRAW -> change pas // DYNAMIC_DRAW -> repete // STREAM_DRAW -> une fois au moins
    this.modeCalcul = isDynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;

    this.vbos = Object.keys(vbos).reduce((acc, cur) => {
      acc[cur] = new Vbo(gl, { locationKey: cur, modeCalcul: this.modeCalcul, ...vbos[cur] });
      return acc;
    }, {});

    this.instanceCount = -1;
  }

  addInstancingVbos(count, vbos) {
    const newVbos = Object.keys(vbos).reduce((acc, cur) => {
      acc[cur] = new Vbo(this.gl, {
        locationKey: cur,
        modeCalcul: this.modeCalcul,
        isInstancing: true,
        ...vbos[cur],
      });
      return acc;
    }, {});
    this.vbos = { ...this.vbos, ...newVbos };
    this.instanceCount = count;
  }

  enable(program) {
    this.gl.useProgram(program);
    Object.keys(this.vbos).forEach((key) => {
      this.vbos[key].enable(program);
    });
  }

  update(vbos) {
    Object.keys(vbos).forEach((key) => {
      this.vbos[key].update(vbos[key]);
    });
  }

  getActiveVbo = () =>
    this.vbos.indices || this.vbos.position || this.vbos.texture || this.vbos.index;

  render(program) {
    this.enable(program);
    const vbo = this.getActiveVbo();
    if (this.instanceCount !== -1) {
      vbo.renderInstancing(program, this.modeDessin, this.instanceCount);
    } else {
      vbo.render(program, this.modeDessin);
    }
    vbo.end();
  }

  setModeDessin(mode) {
    this.modeDessin = mode;
  }

  setModeCalcul(mode) {
    this.modeCalcul = mode;
  }
}
