export default class {
  constructor(gl, points, indices) {
    this.gl = gl;

    // POINTS // LINES // TRIANGLES // LINE_STRIP // LINE_LOOP // TRIANGLE_STRIP // TRIANGLE_FAN
    this.modeDessin = this.gl.LINE_LOOP;

    this.vboPoints = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vboPoints);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

    this.vboIndices = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vboIndices);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

    this.count = indices.length;
  }

  setModeDessin(mode) {
    this.modeDessin = mode;
  }

  enable(program) {
    const { position } = program.locations;
    this.gl.useProgram(program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vboPoints);
    this.gl.enableVertexAttribArray(position);
    this.gl.vertexAttribPointer(position, 3, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.vboIndices);
  }

  render(program) {
    this.enable(program);

    this.gl.drawElements(this.modeDessin, this.count, this.gl.UNSIGNED_SHORT, 0);

    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.useProgram(null);
  }
}
