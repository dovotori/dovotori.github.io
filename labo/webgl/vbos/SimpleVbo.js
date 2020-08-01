export default class {
  constructor(gl, points, isDynamic = false) {
    this.gl = gl;
    // POINTS // LINES // TRIANGLES // LINE_STRIP // LINE_LOOP // TRIANGLE_STRIP // TRIANGLE_FAN
    this.modeDessin = this.gl.TRIANGLES;
    // STATIC_DRAW -> change pas // DYNAMIC_DRAW -> repete // STREAM_DRAW -> une fois au moins
    const modeCalcul = isDynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;

    this.vbo = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points), modeCalcul);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.nbPoints = points.length / 3;
  }

  update(points) {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferSubData(this.gl.ARRAY_BUFFER, 0, new Float32Array(points));
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  enable(program) {
    const location = program.locations.position;
    this.gl.useProgram(program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.enableVertexAttribArray(location);
    this.gl.vertexAttribPointer(location, 3, this.gl.FLOAT, false, 0, 0);
  }

  render(program) {
    this.enable(program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.drawArrays(this.modeDessin, 0, this.nbPoints);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.useProgram(null);
  }

  setModeDessin(mode) {
    this.modeDessin = mode;
  }
}
