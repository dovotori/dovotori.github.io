import App from '../lib/webgl/App';
import Scene from './scene';
import config from './config';

import './style.css';

let app = null;

export default async () => {
  app = new App();
  await app.setup(Scene, config);
  const div = document.querySelector(`#${config.slug}`);
  div.appendChild(app.getCanvas());
};

export const destroy = () => {
  if (app && app.destroy) {
    app.destroy();
  }
};
