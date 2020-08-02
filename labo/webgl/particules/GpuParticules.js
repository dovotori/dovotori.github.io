import TextureData from '../textures/TextureDataRgb';
import { mapFromRange } from '../utils/numbers';
import ParticulesVbo from '../vbos/ParticulesVbo';
import Fbo from '../gl/Fbo';
import Screen from '../gl/Screen';
import { getGridPerlinPoints, getGridPoints } from '../primitives/particules';

export default class {
  constructor(gl, width = 32, height = 32) {
    const points = getGridPerlinPoints(width, height);
    const points2 = getGridPoints(width, height);

    this.screen = new Screen(gl);
    this.vbo = new ParticulesVbo(gl, width, height);
    this.texMap = new TextureData(gl, new Uint8Array(points));
    this.morphMap = new TextureData(gl, new Uint8Array(points2));
    this.fbo = new Fbo(gl, width, height);
  }

  compute(progPass1, time = 0) {
    const t = mapFromRange(Math.cos(time * 0.05), -1, 1, 0, 1);
    this.fbo.start();
    progPass1.setTexture(1, this.texMap.get(), 'textureMap');
    progPass1.setTexture(2, this.morphMap.get(), 'morphMap');
    progPass1.setFloat('time', t);
    this.screen.render(progPass1.get());
    this.fbo.end();
  }

  render(progPass2) {
    progPass2.setTexture(0, this.fbo.getTexture().get(), 'textureMap');
    this.vbo.render(progPass2.get());
  }
}
