export default class {
  constructor(gl, count) {
    this.gl = gl;
    // STATIC_DRAW -> change pas // DYNAMIC_DRAW -> repete // STREAM_DRAW -> une fois au moins
    this.modeCalcul = this.gl.DYNAMIC_DRAW;

    this.vbo = this.gl.createBuffer();
    this.count = count;
    const points = new Array(count);
    points.fill(0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      points, // type Uint8Array ou Float32Array...
      this.modeCalcul
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  enable(program, location) {
    this.gl.useProgram(program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.enableVertexAttribArray(program.locations[location]);
    this.gl.vertexAttribPointer(
      program.locations[location],
      1,
      this.gl.FLOAT,
      false,
      0,
      0
    );
  }

  start(program, location, points) {
    this.enable(program, location);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(points),
      this.modeCalcul
    );
  }

  end() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.useProgram(null);
  }

  setModeCalcul(mode) {
    this.modeCalcul = mode;
  }

  getCount() {
    return this.count;
  }
}
