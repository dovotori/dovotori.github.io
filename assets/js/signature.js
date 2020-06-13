import Scene from "Labo/scenes/signature";
import config from "Labo/configs/signature";
import App from "Labo/webgl/App";

export default async ({ div }) => {
  const app = new App();
  await app.setup(Scene, { ...config, mouse: { ...config.mouse, div } });
  return app.getCanvas();
  // const container = document.querySelector(`#${name}`);
  // if (container) {
  //   container.appendChild();
  // }
}