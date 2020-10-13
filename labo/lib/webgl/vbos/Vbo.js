export default class {
  constructor(gl, data) {
    this.gl = gl;
    if (data) {
      this.create(data);
    }
  }

  create(data) {
    const { locationKey, type, values, count, componentType, size, modeCalcul } = data;
    const bufferType = type !== 'SCALAR' ? this.gl.ARRAY_BUFFER : this.gl.ELEMENT_ARRAY_BUFFER;
    const vbo = this.gl.createBuffer();
    this.gl.bindBuffer(bufferType, vbo);
    this.gl.bufferData(bufferType, values, modeCalcul);
    this.gl.bindBuffer(bufferType, null);
    this.config = {
      vbo,
      size,
      count,
      componentType,
      bufferType,
      locationKey,
    };
  }

  enable(program) {
    const { locationKey, vbo, componentType, size, bufferType } = this.config;
    if (locationKey === 'indices') {
      this.gl.bindBuffer(bufferType, vbo);
    } else {
      const location = program.locations[locationKey];
      if (location !== undefined && location !== -1) {
        this.gl.bindBuffer(bufferType, vbo);
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(location, size, componentType, false, 0, 0);
      }
    }
  }

  start(program) {
    this.gl.useProgram(program);
  }

  end() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.useProgram(null);
  }

  render(program, modeDessin) {
    this.start(program);
    this.gl.drawElements(modeDessin, this.config.count, this.gl.UNSIGNED_SHORT, 0);
    this.end();
  }

  getCount() {
    return this.config.count;
  }
}
