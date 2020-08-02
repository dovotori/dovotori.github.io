import Scene from 'Labo/scenes/game';
import config from 'Labo/configs/game/index';
import App from 'Labo/webgl/App';

export default async ({ div = null, slug = null }) => {
  const app = new App();
  await app.setup(Scene, { ...config, div, slug });
  return app.getCanvas();
};
