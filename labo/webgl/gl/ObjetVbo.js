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
        [cur]: this.createVbo(vbos[cur]),
      }),
      {}
    );
  }

  createVbo = (vboData) => {
    const { type, values, count, componentType, size } = vboData;
    const bufferType =
      type !== "SCALAR" ? this.gl.ARRAY_BUFFER : this.gl.ELEMENT_ARRAY_BUFFER;
    const vbo = this.gl.createBuffer();
    this.gl.bindBuffer(bufferType, vbo);
    this.gl.bufferData(bufferType, values, this.modeCalcul);
    this.gl.bindBuffer(bufferType, null);
    return {
      vbo,
      size,
      count,
      componentType,
      bufferType,
    };
  };

  enable(program) {
    this.gl.useProgram(program);
    Object.keys(this.vbos).forEach((key) => {
      const { vbo, componentType, size, bufferType } = this.vbos[key];
      if (key === "indices") {
        this.gl.bindBuffer(bufferType, vbo);
      } else {
        const location = program.locations[key];
        if (location !== undefined && location !== -1) {
          this.gl.bindBuffer(bufferType, vbo);
          this.gl.enableVertexAttribArray(location);
          this.gl.vertexAttribPointer(
            location,
            size,
            componentType,
            false,
            0,
            0
          );
        }
      }
    });
  }

  render(program) {
    this.enable(program.get());
    this.gl.drawElements(
      this.modeDessin,
      this.vbos.indices.count,
      this.gl.UNSIGNED_SHORT,
      0
    );
    this.end();
  }

  end() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
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
