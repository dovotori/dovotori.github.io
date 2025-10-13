import App from "../lib/webgl/App";
import config from "./config";
import Scene from "./scene";

import "Assets/style/controls.css";
import "Assets/style/fullscreen-btn.css";

let app = null;

export default async () => {
  app = new App();
  await app.setup(Scene, config);
};

export const destroy = () => {
  if (app && app.destroy) {
    app.destroy();
  }
};
