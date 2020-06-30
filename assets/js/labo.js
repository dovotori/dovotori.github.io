import Scene from 'Labo/scenes/labo';
import config from 'Labo/configs/labo';
import App from 'Labo/webgl/App';

export default async () => {
  const app = new App();
  await app.setup(Scene, config);
  return app.getCanvas();
};
