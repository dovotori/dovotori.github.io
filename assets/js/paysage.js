import Scene from "Labo/scenes/paysage";
import config from "Labo/configs/paysage";
import App from "Labo/webgl/App";

export default async ({ div = null }) => {
  const app = new App();
  await app.setup(Scene, { ...config, mouse: { ...config.mouse, div } });
  return app.getCanvas();
}