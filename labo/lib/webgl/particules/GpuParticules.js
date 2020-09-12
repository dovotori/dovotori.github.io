import TextureData from '../textures/TextureDataRgb';
import { mapFromRange } from '../utils/numbers';
import ParticulesVbo from '../vbos/ParticulesVbo';
import Fbo from '../gl/Fbo';
import Screen from '../gl/Screen';

export default class {
  constructor(gl, width = 32, height = 32) {
    this.gl = gl;
    this.screen = new Screen(gl);
    this.vbo = new ParticulesVbo(gl, width, height);
    this.fbo = new Fbo(gl, width, height);
    this.textures = {};
  }

  addDataTexture = (location, points) => {
    this.textures = {
      ...this.textures,
      [location]: new TextureData(this.gl, new Uint8Array(points)),
    };
  };

  compute(progPass1, time = 0) {
    Object.keys(this.textures).forEach((location, index) => {
      progPass1.setTexture(index, this.textures[location].get(), location);
    });

    const t = mapFromRange(Math.cos(time * 0.05), -1, 1, 0, 1);
    progPass1.setFloat('time', t);

    this.fbo.start();
    this.screen.render(progPass1.get());
    this.fbo.end();
  }

  render(progPass2) {
    progPass2.setTexture(0, this.fbo.getTexture().get(), 'textureMap');
    this.vbo.render(progPass2.get());
  }
}
