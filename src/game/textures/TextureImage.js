export default class {
  constructor(gl, image) {
    // super(gl)
    this.gl = gl;
    this.texture = gl.createTexture();
    this.filter = gl.NEAREST;
    // ou LINEAR affinage quand on scale par rapport à nearest mais des fois lignes blanches

    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      image
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MAG_FILTER,
      this.gl.NEAREST
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.NEAREST
    );
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  get() {
    return this.texture;
  }
}
