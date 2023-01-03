export default class {
  constructor(gl, uint8data) {
    this.gl = gl;
    const size = Math.sqrt(uint8data.length / 4); // power of 2
    this.size = { width: size, height: size };
    this.texture = gl.createTexture();
    this.filter = gl.NEAREST;
    // ou LINEAR affinage quand on scale par rapport à nearest mais des fois lignes blanches
    this.setup(uint8data);
  }

  setup(data) {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.size.width,
      this.size.height,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      data,
    );
    this.setFilters();
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  setFilters() {
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.filter,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.filter,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.REPEAT,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.REPEAT,
    );
  }

  get() {
    return this.texture;
  }
}
