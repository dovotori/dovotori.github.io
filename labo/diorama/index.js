import App from '../lib/webgl/App';
import Scene from './scene';
import config from './config';

import 'Assets/style/controls.css';
import 'Assets/style/fullscreen-btn.css';

let app = null;

export default async () => {
  app = new App();
  const div = document.querySelector(`#${config.slug}`);
  const isOkay = await app.setup(Scene, config);
  if (!isOkay) return;
  const canvas = app.getCanvas();
  if (canvas && div) div.appendChild(canvas);
};

export const destroy = () => {
  if (app && app.destroy) {
    app.destroy();
  }
};
