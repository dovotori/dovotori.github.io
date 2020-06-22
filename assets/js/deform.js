import Scene from "Labo/scenes/deform";
import config from "Labo/configs/deform";
import App from "Labo/webgl/App";

let app = null;

export default async ({ div = null }) => {
  app = new App();
  await app.setup(Scene, { ...config, mouse: { ...config.mouse, div } });
  return app.getCanvas();
}

export const destroy = () => {
  if (app && app.destroy) {
    app.destroy();
  }
}
