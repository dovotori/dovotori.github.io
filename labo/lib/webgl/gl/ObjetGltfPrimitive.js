import ObjetVbo from './ObjetVbo';
import TextureData from '../textures/TextureDataRgb';

export default class {
  constructor(gl, { vbos, material = {} }) {
    this.material = material;
    this.objet = new ObjetVbo(gl, vbos);

    if (material.normalMap) {
      this.normalMap = new TextureData(gl, material.normalMap.data);
    }
  }

  render(program) {
    const { color, metal, rough, ao } = this.material;
    program.setVector('color', color || [1, 1, 1, 1]);
    program.setFloat('metal', metal !== undefined ? metal : 0.0);
    program.setFloat('rough', rough !== undefined ? rough : 0.5);
    program.setFloat('ao', ao !== undefined ? ao : 0.1);
    // if (this.normalMap) {
    //   program.setTexture(0, this.normalMap.get(), 'normalMap');
    // }
    this.objet.render(program);
  }

  setModeDessin(mode) {
    this.objet.setModeDessin(mode);
  }

  setModeCalcul(mode) {
    this.objet.setModeCalcul(mode);
  }
}
