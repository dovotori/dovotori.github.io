import Scene from 'Labo/scenes/race';
import config from 'Labo/configs/race';
import App from 'Labo/webgl/App';

export default async ({ div = null, slug = null }) => {
  const app = new App();
  await app.setup(Scene, {
    ...config,
    slug,
    mouse: { ...config.mouse, div },
  });
  return app.getCanvas();
};
