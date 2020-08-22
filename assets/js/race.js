import Scene from 'Labo/scenes/race';
import config from 'Labo/configs/race';
import App from 'Labo/webgl/App';

export default async ({ div = null }) => {
  const app = new App();
  await app.setup(Scene, {
    ...config,
    mouse: { ...config.mouse, div },
  });
  return app.getCanvas();
};
