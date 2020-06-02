import Mesh from "./Mesh";

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
    this.tint = [1, 1, 1];
    this.inverseColor = false;
  }

  setProgramSpecifics(program) {
    program.setVector("spriteUV", [this.sprite.x, this.sprite.y]);
    program.setVector("spriteGrid", [this.sprite.texW, this.sprite.texH]);
    program.setVector("spriteSize", [this.sprite.w, this.sprite.h]);
    program.setVector("spritePivot", [this.sprite.px, this.sprite.py]);
    program.setFloat("spriteRefSize", this.sprite.refSize);
    program.setVector("tint", this.tint);
    program.setInt("inverseColor", this.inverseColor ? 1 : 0);
  }

  setTint(r, g, b) {
    this.tint = [r, g, b];
  }

  setInverseColor(value) {
    this.inverseColor = value;
  }

  setSprite(values) {
    this.sprite = values;
  }
}
