import Mat4 from '../maths/Mat4';

export default class {
  constructor(gl) {
    this.gl = gl;
    // POINTS // LINES // TRIANGLES // LINE_STRIP // LINE_LOOP // TRIANGLE_STRIP // TRIANGLE_FAN
    this.modeDessin = gl.LINES;
    // STATIC_DRAW -> change pas // DYNAMIC_DRAW -> repete // STREAM_DRAW -> une fois au moins
    this.modeCalcul = gl.STATIC_DRAW;
    this.model = new Mat4();
    this.model.identity();

    const points = [0, 0, 0, 0, 1, 0];
    const colors = [1, 0, 0, 0, 1, 0];

    const vbos = {
      position: {
        values: points,
        count: points.length / 3,
        size: 3,
      },
      ambiant: {
        values: colors,
        count: colors.length / 3,
        size: 3,
      },
    };

    this.vbos = Object.keys(vbos).reduce(
      (acc, cur) => ({
        ...acc,
        [cur]: this.createVbo(vbos[cur]),
      }),
      {},
    );
  }

  createVbo = (vboData) => {
    const { type, values, count, size } = vboData;
    const vbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(values), this.modeCalcul);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    return {
      vbo,
      type,
      size,
      count,
    };
  };

  enable(program) {
    this.gl.useProgram(program);
    Object.keys(this.vbos).forEach((key) => {
      const { vbo, size } = this.vbos[key];

      const location = program.locations[key];
      if (location !== undefined && location !== -1) {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vbo);
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(location, size, this.gl.FLOAT, false, 0, 0);
      }
    });
  }

  render(program) {
    this.enable(program.get());
    this.gl.drawArrays(this.modeDessin, 0, this.vbos.position.count);
    this.end();
  }

  end() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.useProgram(null);
  }

  setModeDessin(mode) {
    this.modeDessin = mode;
  }

  setModeCalcul(mode) {
    this.modeCalcul = mode;
  }
}
