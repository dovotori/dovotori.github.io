import Vbos from "../vbos/Vbos";
import TextureData from "../textures/TextureData";

export default class {
  constructor(gl, { vbos, material = {} }) {
    this.material = material;
    this.vbos = new Vbos(gl, vbos);

    if (material.normalMap) {
      this.normalMap = new TextureData(gl, material.normalMap.data);
    }
  }

  addInstancing = (count, vbos) => {
    this.vbos.addInstancingVbos(count, vbos);
  };

  render(program) {
    const { color, metal, rough, ao } = this.material;
    program.setVector("color", color || [1, 1, 1, 1]);
    program.setFloat("metal", metal !== undefined ? metal : 0.0);
    program.setFloat("rough", rough !== undefined ? rough : 0.5);
    program.setFloat("ao", ao !== undefined ? ao : 1.0);
    // if (this.normalMap) {
    //   program.setTexture(0, this.normalMap.get(), 'normalMap');
    // }
    this.vbos.render(program.get());
  }

  setModeDessin(mode) {
    this.vbos.setModeDessin(mode);
  }

  setModeCalcul(mode) {
    this.vbos.setModeCalcul(mode);
  }
}
