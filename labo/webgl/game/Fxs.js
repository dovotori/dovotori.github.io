import Fx from './Fx';

export default class {
  constructor(constants, sprites, viewBox) {
    this.fxs = {};
    this.isAiming = false;
    this.viewBox = viewBox;
    this.sprites = sprites;
    this.constants = constants;
    this.cpt = 0;
  }

  update() {
    Object.keys(this.fxs).forEach((fx) => {
      this.fxs[fx].update();
    });

    // if (toDelete.length > 0) {
    //   this.fxs = this.fxs.filter((fx, idx) => toDelete.indexOf(idx) === -1);
    // }
  }

  endOfAnimation = (id) => () => {
    delete this.fxs[id];
  };

  createNewOne(startPos, status) {
    this.fxs[this.cpt] = new Fx(
      this.constants,
      this.sprites,
      this.viewBox,
      startPos,
      status,
      this.endOfAnimation(this.cpt)
    );
    this.cpt += 1;
  }

  render(program, texture, objet) {
    Object.keys(this.fxs).forEach((fx) => {
      this.fxs[fx].render(program, texture, objet);
    });
  }

  getConstants() {
    return this.constants;
  }
}
