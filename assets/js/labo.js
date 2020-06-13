import Scene from "Labo/scenes/labo";
import config from "Labo/configs/labo";
import App from "Labo/webgl/App";

export default async () => {
  const app = new App();
  await app.setup(Scene, config);
  const container = document.querySelector('#labo');
  if (container) {
    container.appendChild(app.getCanvas());
    const loader = document.querySelector('.loaderlabo');
    if (loader) {
      loader.style.display = "none";
    }
  }
}
