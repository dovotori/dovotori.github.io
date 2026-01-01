import { generate2DTexture } from "../../utils/clouds";

export default class {
  constructor(gl, width = 4, height = 4, depth = 4) {
    this.gl = gl;
    this.size = { width, height, depth };
    this.texture = gl.createTexture();
    this.filter = gl.NEAREST;
    this.setup();
  }

  setup() {
    this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
    this.create();
    this.setFilters();
    this.gl.bindTexture(this.gl.TEXTURE_2D, null);
  }

  create() {
    const { width, height } = this.size;
    const resolution = 32; // power of two
    const b = new ArrayBuffer(width * resolution * height * resolution * 4);
    const pixels = new Uint8Array(b);
    const points = generate2DTexture(width, height, resolution);
    // const offsetZ = width * resolution * height * resolution;
    // const points = generate3DTexture(width, height, depth, resolution).slice(0, offsetZ);
    let cptRVBA = 0;

    for (let i = 0; i < points.length; i++) {
      const color = 255 - points[i] * 255;
      pixels[cptRVBA] = color;
      pixels[cptRVBA + 1] = color;
      pixels[cptRVBA + 2] = color;
      pixels[cptRVBA + 3] = 255;
      cptRVBA += 4;
    }

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      height * resolution,
      width * resolution,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      pixels,
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
}
