import Texture from './Texture';

export default class extends Texture {
  create() {
    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.size.width,
      this.size.height,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      null,
    );
  }

  setFilters() {
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_MIN_FILTER,
      this.gl.LINEAR,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_S,
      this.gl.CLAMP_TO_EDGE,
    );
    this.gl.texParameteri(
      this.gl.TEXTURE_2D,
      this.gl.TEXTURE_WRAP_T,
      this.gl.CLAMP_TO_EDGE,
    );
  }
}
