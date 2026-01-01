import { capitalize, getEnvPath } from "../utils";
import Controls from "../utils/io/Controls";
import Keyboard from "../utils/io/Keyboard";
import Mouse from "../utils/io/Mouse";
import Canvas from "../utils-3d/core/Canvas";
import Loop from "../utils-3d/core/Loop";
import ManagerAssets from "./managers/ManagerAssets";
import ManagerShaders from "./managers/ManagerShaders";

class App {
  constructor() {
    this.keyboard = null;
    this.mouse = null;
    this.scene = null;
    this.loop = null;
    this.configRatio = null;
    this.resizeObserver = null;
  }

  async setup(Scene, config = {}) {
    const container = document.querySelector(`#${config.slug}`);
    if (!container) return;

    this.configRatio = window.innerHeight / document.body.offsetWidth;

    let assets = {};
    this.configRatio = config.canvas.height / config.canvas.width;

    if (config.assets) {
      const am = new ManagerAssets(config.useWebGpu);
      assets = await am.get(config.assets.map((path) => getEnvPath(path)));
    }

    if (config.shaders) {
      const as = new ManagerShaders();
      assets.shaders = await as.get(config.shaders);
    }

    this.canvas = new Canvas(config.useWebGpu);
    await this.canvas.setup();
    const { width, height } = this.getCurrentSize(container);
    const supportConfig = this.canvas.getSupport();
    const finalConfig = {
      ...config,
      canvas: { ...config.canvas, width, height },
      support: supportConfig,
    };

    const isDrawBufferUnsupported = !!config.useDrawBuffer && !supportConfig.drawBuffers;
    const isDrawWegpuUnsupported =
      !!config.useWebGpu && (!supportConfig.webgpu || !supportConfig.device);
    const shouldDisabled = isDrawBufferUnsupported || isDrawWegpuUnsupported;

    if (shouldDisabled) {
      const oups = document.createElement("p");
      oups.innerHTML = `
      <b>ご迷惑おかけして申し訳ありません。</b>
      <br/>Sorry. A support problem occured.
      <br/>Your browser does not support ${config.useWebGpu ? "WebGPU" : "WebGL"} or one of the required features.
      `;
      oups.style.position = "absolute";
      oups.style.top = "50%";
      oups.style.left = "50%";
      oups.style.transform = "translate(-50%, -50%)";
      oups.style.textAlign = "center";
      oups.style.color = "white";
      oups.style.textShadow = "1px 1px 1px rgba(0,0,0,0.5)";
      container.appendChild(oups);
      return;
    }

    this.scene = new Scene(this.canvas.getContext(), finalConfig);
    await this.scene.setupAssets(assets);
    if (this.scene.setup) this.scene.setup();
    this.resizeObserver = new ResizeObserver(this.resize);
    this.resizeObserver.observe(container);

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
        {},
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

    App.revealAfterLoaded(container);
    this.loop = new Loop();
    this.loop.setCallback(this.render);
    this.loop.start();
    container.appendChild(this.canvas.get());
  }

  resize = (entries) => {
    window.requestAnimationFrame(() => {
      if (!Array.isArray(entries) || !entries.length) {
        return;
      }
      const container = entries[0].target;
      if (container) {
        this.adaptCanvas(container);
      }
    });
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
    return this.canvas?.get();
  }

  destroy() {
    this.stop();
    if (this.scene?.destroy) {
      this.scene.destroy();
    }
    if (this.controls) {
      this.controls.destroy();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  static revealAfterLoaded = (container) => {
    if (container) {
      const itemsToReveal = container.querySelectorAll("[style]");
      itemsToReveal.forEach((item) => {
        item.removeAttribute("style");
      });
    }
  };
}

export default App;
