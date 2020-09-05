import Scene from 'Labo/scenes/paysage';
import config from 'Labo/configs/paysage';
import App from 'Labo/webgl/App';

export default async ({ div = null, slug = null }) => {
  const app = new App();
  await app.setup(Scene, { ...config, slug, mouse: { ...config.mouse, div } });
  return app.getCanvas();
};
