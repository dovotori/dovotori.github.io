import Scene from 'Labo/scenes/picto';
import config from 'Labo/configs/picto';
import App from 'Labo/webgl/App';

export default async ({ slug = null }) => {
  const app = new App();
  await app.setup(Scene, { ...config, slug });
  return app.getCanvas();
};
