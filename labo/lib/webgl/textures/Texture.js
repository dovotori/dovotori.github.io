export default class {
  // POWER OF TWO
  constructor(gl, width = 64, height = 64) {
    this.gl = gl;
    this.size = { width, height };
    this.texture = gl.createTexture();
    this.filter = gl.NEAREST;
    // ou LINEAR affinage quand on scale par rapport à nearest mais des fois lignes blanches
    this.setup();
  }

  setup() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.create();
    this.setFilters();
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  create() {
    const buffer = new ArrayBuffer(this.size.width * this.size.height);
    const pixels = new Uint8Array(buffer);
    let cpt = 0;

    for (let y = 0; y < this.size.height; y += 1) {
      for (let x = 0; x < this.size.width; x += 1) {
        pixels[cpt] = Math.random() * 255;
        cpt += 1;
      }
    }

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.ALPHA,
      this.size.width,
      this.size.height,
      0,
      this.gl.ALPHA,
      this.gl.UNSIGNED_BYTE,
      pixels
    );
  }

  setFilters() {
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.filter);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.filter);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.REPEAT);
    this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.REPEAT);
  }

  get() {
    return this.texture;
  }

  setFiltre(valeur) {
    this.filter = valeur;
  }
}
