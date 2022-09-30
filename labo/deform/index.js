import App from '../lib/webgl/App';

import config from './config';
import Scene from './scene';

import 'Assets/style/controls.css';
import 'Assets/style/fullscreen-btn.css';
import 'Assets/style/range-input.css';

import './style.css';

let app = null;

export default async () => {
  app = new App();
  await app.setup(Scene, config);
  const div = document.querySelector(`#${config.slug}`);
  const canvas = app.getCanvas();
  if (canvas && div) div.appendChild(canvas);
};

export const destroy = () => {
  if (app && app.destroy) {
    app.destroy();
  }
};
