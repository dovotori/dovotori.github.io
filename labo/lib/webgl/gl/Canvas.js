import Context from "./Context";

export default class {
  constructor() {
    this.canvas = document.createElement("canvas");
    this.context = new Context(this.canvas);
  }

  resize = (box) => {
    this.canvas.setAttribute("width", box.width);
    this.canvas.setAttribute("height", box.height);
  };

  get() {
    return this.canvas;
  }

  getContext() {
    return this.context.get();
  }

  getSupport() {
    return this.context.getSupport();
  }
}
