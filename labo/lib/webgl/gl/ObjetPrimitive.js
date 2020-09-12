export default class {
  constructor(gl, isDynamic = false) {
    this.gl = gl;
    // gl.LINES // gl.TRIANGLES // gl.LINE_STRIP // gl.LINE_LOOP
    this.modeDessin = this.gl.TRIANGLES;
    // STATIC_DRAW -> change pas // DYNAMIC_DRAW -> repete // STREAM_DRAW -> une fois au moins
    this.modeCalcul = isDynamic ? this.gl.DYNAMIC_DRAW : this.gl.STATIC_DRAW;

    this.objet = {
      position: { count: 0, vbo: null },
      texture: { count: 0, vbo: null },
      indice: { count: 0, vbo: null },
    };
  }

  setIndices(indices) {
    this.objet.indice = { count: indices.length, vbo: this.gl.createBuffer() };
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.objet.indice.vbo);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), this.modeCalcul);
  }

  setPoints(points = [0, 0, 0, 0, 1, 0, 1, 0, 0], type) {
    this.objet[type] = { count: points.length, vbo: this.gl.createBuffer() };
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.objet[type].vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points), this.modeCalcul);
  }

  enable(program, type, nbPoint) {
    this.gl.useProgram(program);
    this.gl.enableVertexAttribArray(program.locations[type]);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.objet[type].vbo);
    this.gl.vertexAttribPointer(program.locations[type], nbPoint, this.gl.FLOAT, false, 0, 0);
  }

  render() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.objet.indice.vbo);
    this.gl.drawElements(this.modeDessin, this.objet.indice.count, this.gl.UNSIGNED_SHORT, 0);
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
