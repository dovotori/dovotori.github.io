import Scene from "./src/SceneGame";
import SplashScreen from "./src/game/SplashScreen";

export default class extends Scene {
  constructor(gl, config) {
    super(gl, config);
    this.isSplashScreen = true;
    this.needReset = false;
    this.splash = new SplashScreen();
    this.splash.showReady();
    this.currentLevel = 0;
  }

  async setupAssets(assets) {
    const { levels: assetsLevels, ...restAssets } = assets;
    await super.setupAssets(restAssets);
    const { levels } = this.config.game;
    if (levels) {
      const level = levels[this.currentLevel];
      const asset = assetsLevels[level.tilemap.texture];
      this.setupGameLevel(level, asset, this.callbackDeath);
    }
  }

  callbackDeath = () => {
    this.setPause(true);
    this.isSplashScreen = true;
    this.splash.showRestart();
    this.resetGameLevel();
  };

  setKeyboardInteraction(keyboard) {
    super.setKeyboardInteraction(keyboard);
    if (
      this.isSplashScreen &&
      keyboard.isPressedOne(this.config.keyboard.ENTER)
    ) {
      this.setPause(false);
      this.splash.hide();
      this.isSplashScreen = false;
    }
    if (keyboard.isPressedOne(this.config.keyboard.ECHAP)) {
      this.isSplashScreen = !this.isSplashScreen;
      this.setPause(this.isSplashScreen);
      if (this.isSplashScreen) {
        this.splash.showPause();
      } else {
        this.splash.hide();
      }
    }
  }
}
