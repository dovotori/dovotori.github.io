import Scene from "Labo/scenes/game";
import config from "Labo/configs/game";
import App from "Labo/webgl/App";

export default async () => {
  const app = new App();
  await app.setup(Scene, config);
  return app.getCanvas();
}