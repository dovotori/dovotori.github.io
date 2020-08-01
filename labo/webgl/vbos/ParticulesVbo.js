import { mapFromRange } from '../utils/numbers';

export default class {
  constructor(gl, width, height) {
    this.gl = gl;
    this.vbo = this.gl.createBuffer();
    this.nbPoints = width * height;

    const points = []; // texture coord to read position texture
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const posX = mapFromRange(x, 0, width - 1, 0, 1);
        const posY = mapFromRange(y, 0, height - 1, 0, 1);
        points.push(posX);
        points.push(posY);
      }
    }

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(points), this.gl.STATIC_DRAW);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  enable(program) {
    const location = program.locations.texture;
    this.gl.useProgram(program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.enableVertexAttribArray(location);
    this.gl.vertexAttribPointer(location, 2, this.gl.FLOAT, false, 0, 0);
  }

  render(program) {
    this.enable(program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.drawArrays(this.gl.POINTS, 0, this.nbPoints);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.useProgram(null);
  }
}
