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
    this.configRatio = null;
    this.resizeObserver = null;
  }

  async setup(Scene, config) {
    const container = document.querySelector(`#${config.slug}`);
    if (!container) return;

    this.configRatio = window.innerHeight / document.body.offsetWidth;

    let assets = {};
    if (config) {
      this.configRatio = config.canvas.height / config.canvas.width;

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
    const { width, height } = this.getCurrentSize(container);
    const supportConfig = this.canvas.getSupport();
    const finalConfig = {
      ...config,
      canvas: { ...config.canvas, width, height },
      support: supportConfig,
    };

    const shouldDisabled = config.useDrawBuffer && !supportConfig.drawBuffers;
    if (shouldDisabled) {
      const oups = document.createElement('p');
      oups.innerHTML = `
      <b>ご迷惑おかけして申し訳ありません。</b>
      <br/>Sorry. Webgl draw buffers extension support problem occured.
      <br/>Please try on a more recent device.
      `;
      oups.style.textAlign = "center";
      oups.style.margin = "20px auto";
      container.appendChild(oups);
      return;
    }

    this.scene = new Scene(this.canvas.getContext(), finalConfig);
    await this.scene.setupAssets(assets)
    if (this.scene.setup) {
      this.scene.setup();
    }
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(container);

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
    return true;
  }

  resize = (e) => {
    const container = e[0].target;
    if (container) {
      this.adaptCanvas(container);
    }
  };

  adaptCanvas = (container) => {
    const { width, height } = this.getCurrentSize(container);
    this.canvas.resize({ width, height });
    this.scene.resize({ width, height });
  };

  getCurrentSize = (container) => {
    const ratio = window.devicePixelRatio || 1;
    const width = (container?.offsetWidth || 1024) * ratio;
    const height = width * this.configRatio;
    return { width, height };
  };

  render = (time) => {
    if (this.keyboard) {
      this.keyboard.start();
      this.scene.setKeyboardInteraction(this.keyboard);
    }
    this.scene.update(time);
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
    this.stop();
    if (this.scene && this.scene.destroy) {
      this.scene.destroy();
    }
    if (this.controls) {
      this.controls.destroy();
    }
    if (this.controls) {
      this.resizeObserver.disconnect();
    }
  }

  revealAfterLoaded = (container) => {
    if (container) {
      const itemsToReveal = container.querySelectorAll('[style]');
      itemsToReveal.forEach((item) => item.removeAttribute('style'));
    }
  };
}
