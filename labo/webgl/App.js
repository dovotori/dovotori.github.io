import Loop from "./logic/Loop";
import ManagerAssets from "./managers/ManagerAssets";
import Canvas from "./gl/Canvas";
import Keyboard from "./io/Keyboard";
import Fullscreen from "./io/Fullscreen";
import Mouse from "./io/Mouse";
import { capitalize, getEnvPath } from "./utils";

export default class {
  constructor() {
    this.keyboard = null;
    this.mouse = null;
    this.scene = null;
    this.loop = null;
  }

  async setup(Scene, config) {
    let width = document.body.offsetWidth;
    let height = window.innerHeight; 

    let assets = null;
    if (config) {
      width = config.canvas.width; 
      height = config.canvas.height;

      if (config.assets) {
        const am = new ManagerAssets();
        assets = await am.get(config.assets.map((path) => getEnvPath(path)));
      }
    }

    this.canvas = new Canvas();
    this.canvas.resize({ width, height });
    const finalConfig = {...config, support: this.canvas.getSupport() };
    this.scene = new Scene(this.canvas.getContext(), finalConfig, assets, width, height);

    if (config) {
      if (config.keyboard) {
        this.keyboard = new Keyboard(config.keyboard);
      }
      if (config.mouse) {
        const { events, domId, div } = config.mouse;
        const callbacks = events.reduce(
          (acc, cur) => ({
            ...acc,
            [`callback${capitalize(cur)}`]: this.scene[`onMouse${capitalize(cur)}`],
          }),
          {}
        );
        const container = div ||(domId ? document.querySelector(`#${domId}`) : document.body);
        this.mouse = new Mouse(container, callbacks);
      }
      if (config.controls) {
        const {fullscreen} = config.controls;
        if (fullscreen) {
          const { div, domId, buttonId, button } = fullscreen;
          const containerElem = div ||(domId ? document.querySelector(`#${domId}`) : document.body);
          const buttonElem = button || (buttonId ? document.querySelector(`#${buttonId}`) : null);
          this.fullscreen = new Fullscreen(containerElem, buttonElem);
        }
      }
    }

    this.loop = new Loop();
    this.loop.setCallback(this.render);
    this.loop.start();
  }

  render = () => {
    if (this.keyboard) {
      this.keyboard.start();
      this.scene.setKeyboardInteraction(this.keyboard);
    }
    this.scene.render();
    if (this.keyboard) this.keyboard.end();
  }

  stop() {
    if (this.loop) {
      this.loop.stop();
    }
    if (this.mouse) {
      this.mouse.cancel();
    }
  }

  getCanvas() {
    return this.canvas && this.canvas.get();
  }

  destroy() {
    if (this.scene && this.scene.destroy) {
      this.scene.destroy();
    }
  }
}
