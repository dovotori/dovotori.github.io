import Mat4 from "../maths/Mat4";

export default class {
  constructor() {
    this.model = new Mat4();
    this.model.identity();
    this.selected = false;
  }

  setProgram(program) {
    program.setMatrix("model", this.model.get());
  }

  setProgramSpecifics(program) {
    program.setInt("selected", this.selected);
    program.setVector("color", [1.0, 1.0, 1.0, 1.0]);
  }

  render(objet, program) {
    this.setProgram(program);
    this.setProgramSpecifics(program);
    objet.enable(program.get());
    objet.render(program.get());
  }

  renderColor(objet, program) {
    this.setProgram(program);
    program.setInt("selected", this.selected);
    program.setVector("color", [1.0, 1.0, 1.0, 1.0]);
    objet.enable(program.get());
    objet.render(program.get());
  }

  update() {
    this.model.identity();
  }

  setDraggingInfos(pos) {
    this.angle.x.addToSpeed(pos.relPrevious.x * 0.1);
    this.angle.y.addToSpeed(pos.relPrevious.y * -0.1);
  }

  setSelected(pixel) {
    this.selected = pixel[0] === 255 && pixel[1] === 255 && pixel[2] === 255;
    this.size.set(this.selected ? 1.1 : 1);
  }

  setLightPos(pos) {
    this.lightPos = pos;
  }

  reset() {
    this.model.identity();
  }

  setRotate(angle, x, y, z) {
    this.model.rotate(angle, x, y, z);
  }

  setTranslate(x, y, z = 0) {
    this.model.translate(x, y, z);
  }

  setScale(x, y, z = 0) {
    this.model.scale(x, y, z);
  }
}
