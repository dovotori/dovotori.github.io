import Mesh from './MeshNormalMatrix';

export default class extends Mesh {
  constructor() {
    super();
    this.sprite = {
      x: 0,
      y: 0,
      texW: 1,
      texH: 1,
      w: 1,
      h: 1,
    };
  }

  setProgramSpecifics(program) {
    program.setVector('spriteUV', [this.sprite.x, this.sprite.y]);
    program.setVector('spriteGrid', [this.sprite.texW, this.sprite.texH]);
    program.setVector('spriteSize', [this.sprite.w, this.sprite.h]);
    program.setFloat('spriteRefSize', this.sprite.refSize);
  }

  setSprite(values) {
    this.sprite = values;
  }
}
