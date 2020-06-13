import Scene from "Labo/scenes/picto";
import config from "Labo/configs/picto";
import App from "Labo/webgl/App";

export default async () => {
  const app = new App();
  await app.setup(Scene, config);
  const container = document.querySelector('#picto');
  if (container) {
    container.appendChild(app.getCanvas());
    const loader = document.querySelector('.loaderpicto');
    if (loader) {
      loader.style.display = "none";
    }
  }
}
