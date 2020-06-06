import Scene from "Labo/scenes/game";
import config from "Labo/configs/game";
import App from "Labo/webgl/App";

export default async () => {
  const app = new App();
  await app.setup(Scene, config);
  const container = document.querySelector('#game');
  if (container) {
    container.appendChild(app.getCanvas());
    const loader = document.querySelector('.loadergame');
    if (loader) {
      loader.style.display = "none";
    }
  }
}