import Loop from './logic/Loop';
import ManagerAssets from './managers/ManagerAssets';
import ManagerShaders from './managers/ManagerShaders';
import Canvas from './gl/Canvas';
import Keyboard from './io/Keyboard';
import Controls from './io/Controls';
import Mouse from './io/Mouse';
import { capitalize, getEnvPath } from './utils';

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

    let assets = {};
    if (config) {
      width = config.canvas.width;
      height = config.canvas.height;

      if (config.assets) {
        const am = new ManagerAssets();
        assets = await am.get(config.assets.map((path) => getEnvPath(path)));
      }

      if (config.shaders) {
        const as = new ManagerShaders();
        assets.shaders = await as.get(config.shaders);
      }
    }

    this.canvas = new Canvas();
    this.canvas.resize({ width, height });
    const finalConfig = { ...config, support: this.canvas.getSupport() };
    this.scene = new Scene(this.canvas.getContext(), finalConfig, assets);
    const container = document.querySelector(`#${config.slug}`);

    if (config) {
      if (config.keyboard) {
        this.keyboard = new Keyboard(config.keyboard);
      }
      if (config.mouse) {
        const { events, domId } = config.mouse;
        const callbacks = events.reduce(
          (acc, cur) => ({
            ...acc,
            [`callback${capitalize(cur)}`]: this.scene[`onMouse${capitalize(cur)}`],
          }),
          {}
        );
        const mouseContainer = domId ? document.querySelector(`#${domId}`) : container;
        this.mouse = new Mouse(mouseContainer, callbacks);
      }
      if (config.controls) {
        this.controls = new Controls(container, config.controls);
        container.appendChild(this.controls.getDomItem());
        if (config.controls.ranges && this.scene.setupControls) {
          this.scene.setupControls({ ranges: this.controls.getRanges() });
        }
      }
    }

    this.revealAfterLoaded(container);
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
  };

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
    if (this.controls) {
      this.controls.destroy();
    }
  }

  revealAfterLoaded = (container) => {
    if (container) {
      const itemsToReveal = container.querySelectorAll('[style]');
      itemsToReveal.forEach((item) => item.removeAttribute('style'));
    }
  };
}
