import App from '../lib/webgl/App';
import Scene from './scene';
import config from './config';

import 'Assets/style/controls.css';
import 'Assets/style/fullscreen-btn.css';

let app = null;

export default async () => {
  app = new App();
  await app.setup(Scene, config);
  const div = document.querySelector(`#${config.slug}`);
  if (div.parentNode) {
    div.parentNode.style.display = 'flex';
    div.parentNode.style.alignItems = 'center';
  }
  const canvas = app.getCanvas();
  if (canvas && div) div.appendChild(canvas);
};

export const destroy = () => {
  if (app && app.destroy) {
    app.destroy();
  }
};
