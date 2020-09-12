import App from '../lib/webgl/App';
import Scene from './scene';
import config from './config';

let app = null;

export default async ({ div = null }) => {
  app = new App();
  await app.setup(Scene, {
    ...config,
    mouse: { ...config.mouse, div },
  });
  return app.getCanvas();
};

export const destroy = () => {
  if (app && app.destroy) {
    app.destroy();
  }
};
