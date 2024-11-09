import Texture from "./Texture";
import PerlinNoise from "../../perlinNoise";

export default class extends Texture {
  create() {
    const b = new ArrayBuffer(this.size.width * this.size.height * 4);
    const pixels = new Uint8Array(b);
    let cptRVBA = 0;
    this.perlinNoise = new PerlinNoise();

    for (let y = 0; y < this.size.height; y += 1) {
      for (let x = 0; x < this.size.width; x += 1) {
        const color = this.perlinNoise.get(x, y) * 255;
        pixels[cptRVBA] = color;
        pixels[cptRVBA + 1] = color;
        pixels[cptRVBA + 2] = color;
        pixels[cptRVBA + 3] = 255;
        cptRVBA += 4;
      }
    }

    this.gl.texImage2D(
      this.gl.TEXTURE_2D,
      0,
      this.gl.RGBA,
      this.size.height,
      this.size.width,
      0,
      this.gl.RGBA,
      this.gl.UNSIGNED_BYTE,
      pixels,
    );
  }
}
