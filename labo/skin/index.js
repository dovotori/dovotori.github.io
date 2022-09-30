import App from '../lib/webgl/App';
import Scene from './scene';
import config from './config';
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
