import Scene from "Labo/scenes/paysage";
import config from "Labo/configs/paysage";
import App from "Labo/webgl/App";

export default async () => {
  const app = new App();
  await app.setup(Scene, config);
  const container = document.querySelector('#paysage');
  if (container) {
    container.appendChild(app.getCanvas());
    const loader = document.querySelector('.loaderpaysage');
    if (loader) {
      loader.style.display = "none";
    }
  }
}