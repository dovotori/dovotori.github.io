import Scene from "Labo/scenes/signature";
import config from "Labo/configs/signature";
import App from "Labo/webgl/App";

export default async () => {
  const app = new App();
  await app.setup(Scene, config);
  const container = document.querySelector('#signature');
  if (container) {
    container.appendChild(app.getCanvas());
    const loader = document.querySelector('.loadersignature');
    if (loader) {
      loader.style.display = "none";
    }
  }
}