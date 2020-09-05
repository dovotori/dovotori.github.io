import Scene from 'Labo/scenes/signature';
import config from 'Labo/configs/signature';
import App from 'Labo/webgl/App';

export default async ({ div = null, slug = null }) => {
  const app = new App();
  await app.setup(Scene, { ...config, slug, mouse: { ...config.mouse, div } });
  return app.getCanvas();
  // const container = document.querySelector(`#${name}`);
  // if (container) {
  //   container.appendChild();
  // }
};
