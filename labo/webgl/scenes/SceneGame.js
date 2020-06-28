import Scene from './SceneLampe';
import Background from '../game/Background';
import Tilemap from '../game/Tilemap';
import Bullets from '../game/Bullets';
import Fxs from '../game/Fxs';

import Target from '../maths/Target';

import Heros from '../persos/Heros';
import Monster from '../persos/Monster';
import Collisions from '../collisions/Collisions';

export default class extends Scene {
  constructor(gl, config, assets, width = 1024, height = 1024) {
    super(gl, config, assets, width, height);

    this.targetRGB = new Target(0, 0.1);
    this.targetWave = new Target(0, 0.1);

    this.oldInverse = false;
    this.oldAiming = false;
    this.isPause = true;
    this.interactives = {};
    this.boxes = [];
    this.tilemap = null;

    this.setLampeInfos(this.mngProg.get('spritePhong'));
    this.setLampeInfos(this.mngProg.get('albedoPhong'));
  }

  // renderBeforeProcess() {
  //   this.heros.renderColor(this.mngObj.get("tile"), this.mngProg.get("color"))
  //   if (this.mousePos !== null) {
  //     const pixel = this.getColorPixel(this.mousePos)
  //     this.heros.setSelected(pixel)
  //   }
  // }

  setupGameLevel(level, spriteLevel) {
    if (this.config.game) {
      const { types } = this.config.game;
      const { tilemap, interactives } = level;
      const { tileSize } = tilemap;

      this.tilemap = new Tilemap(spriteLevel, tilemap);
      const viewBox = this.tilemap.getViewBox();

      Object.keys(interactives).forEach((id) => {
        const interactive = interactives[id];
        const { type, x, y } = interactive;
        if (types[type]) {
          const configType = types[type];
          const constants = { ...configType.constants, x, y, id };
          const { sprites } = configType;
          switch (type) {
            case 'heros': {
              const { fxs, bullets } = configType;
              this.interactives[id] = {
                main: new Heros({
                  constants,
                  sprites,
                  viewBox,
                  tileSize,
                }),
                bullets: new Bullets(bullets.constants, bullets.sprites, viewBox),
                fxs: new Fxs(fxs.constants, fxs.sprites, viewBox),
              };
              break;
            }
            case 'monster': {
              this.interactives[id] = {
                main: new Monster({
                  constants,
                  sprites,
                  viewBox,
                  tileSize,
                }),
              };
              break;
            }
            default:
              break;
          }
        }
      });

      if (this.interactives.heros) {
        const { bullets } = this.interactives.heros;
        bullets.setCallbackShoot(this.callbackBulletShoot);
        bullets.setCallbackCollide(this.callbackBulletCollide);
      }

      this.boxes = Object.keys(this.interactives).map((id) => {
        return this.interactives[id].main.getCollisionBox();
      });

      this.collisions = new Collisions(this.boxes);
      this.background = new Background(viewBox, this.tilemap.getLevelSize());

      console.log(this.interactives);
    }
  }

  resize(box) {
    super.resize(box);
    this.postProcess.resize(box);
  }

  update() {
    super.update();

    const { main: heros, bullets, fxs } = this.interactives.heros;

    const herosWorldPos = heros.getWorldPosition();
    const herosPos = heros.getPosition();
    const herosInvX = heros.getInverseX();
    const herosIsAim = heros.getAiming();
    const map = this.tilemap.get();

    this.camera.followPosY(herosWorldPos[1]);
    this.tilemap.follow(herosPos);
    this.tilemap.update(this.mngProg.get('spritePhong'));
    // this.background.update(herosPos);

    if (!this.isPause) {
      const tileSize = this.tilemap.getTileSize();

      Object.keys(this.interactives).forEach((id) => {
        this.interactives[id].main.update(map, tileSize);
      });

      fxs.update();
      bullets.update(map, tileSize, heros.getAimingPos(), herosIsAim, herosInvX);
      // if (this.mousePos !== null) {
      //   const pixel = this.getColorPixel(this.mousePos);
      //   this.perso.setSelected(pixel);
      // }

      // this.collisions.update(this.interactives);
    }
  }

  renderPause() {
    super.render();
    this.renderBackground();
    this.renderTilemap();
  }

  mainRender() {
    // this.renderBackground();
    this.renderTilemap();
    this.renderInteractives();
    // this.renderForeground();
  }

  renderTilemap() {
    this.tilemap.render(
      this.mngProg.get('spritePhong'),
      this.mngTex.get('level1'),
      this.mngObj.get('cubeTile'),
      this.mngObj.get('tile')
    );
  }

  renderInteractives() {
    Object.keys(this.interactives).forEach((id) => {
      this.interactives[id].main.render(
        this.mngProg.get('sprite'),
        this.mngTex.get('heros'),
        this.mngObj.get('tile')
      );
    });
    const { bullets, fxs } = this.interactives.heros;
    // fxs.render(this.mngProg.get('sprite'), this.mngTex.get('fx'), this.mngObj.get('tile'));
    bullets.render(this.mngProg.get('sprite'), this.mngTex.get('bullet'), this.mngObj.get('tile'));
  }

  renderBackground() {
    const { main: heros } = this.interactives.heros;
    const herosPosX = heros.getX();
    this.background.renderMountains(this.mngObj.get('tile'), this.mngProg.get('color'));
    this.background.updateScreens(-0.15);
    this.mngProg.get('background').setTexture(0, this.mngTex.get('clouds').get(), 'textureMap');
    this.background.renderScreen(
      this.mngObj.get('tile'),
      this.mngProg.get('background'),
      herosPosX,
      0.0005
    );
    this.background.updateScreens(-0.1);
    this.mngProg.get('background').setTexture(0, this.mngTex.get('rocks').get(), 'textureMap');
    this.background.renderScreen(
      this.mngObj.get('tile'),
      this.mngProg.get('background'),
      herosPosX,
      0.001
    );
    this.background.updateScreens(-0.05);
    this.mngProg.get('background').setTexture(0, this.mngTex.get('ground').get(), 'textureMap');
    this.background.renderScreen(
      this.mngObj.get('tile'),
      this.mngProg.get('background'),
      herosPosX,
      0.005
    );
    this.background.renderCloudsBack(this.mngObj.get('tile'), this.mngProg.get('color'));
  }

  renderForeground() {
    this.background.renderCloudsFront(this.mngObj.get('tile'), this.mngProg.get('color'));
  }

  effects() {
    const { main: heros, fxs } = this.interactives.heros;
    const herosStatus = heros.getStatus();
    const posHeros = heros.getAimingPosition();
    const herosInvX = heros.getInverseX();
    const herosIsAim = heros.getAiming();
    const { JUMP_UP, RUN_JUMP_UP } = heros.getConstants().states;
    const { DUST } = fxs.getConstants().states;

    // inside heros or perso
    if (heros.isStatusChanged() && (herosStatus === JUMP_UP || herosStatus === RUN_JUMP_UP)) {
      fxs.createNewOne(heros.getLastJumpingPosition(), DUST);
    }
    const lastRunningPosition = heros.getLastRunningPosition();
    if (lastRunningPosition !== null) {
      fxs.createNewOne(lastRunningPosition, DUST);
    }

    this.targetRGB.update();
    this.targetWave.update();

    if (herosInvX !== this.oldInverse) {
      this.camera.setSmoothRotation(herosInvX ? 0.4 : -0.4);
      this.camera.setSmoothTarget(herosInvX ? -4 : 4);
      this.oldInverse = herosInvX;
    }
    if (herosIsAim !== this.oldAiming) {
      this.targetWave.set(herosIsAim ? 0.01 : 0);
      this.camera.setSmoothZoom(herosIsAim ? 0.8 : 1);
      this.oldAiming = herosIsAim;
    }
    this.targetRGB.set(heros.getDashing() || this.isPause ? 2 : 0);

    const center = this.camera.get2dTexturePoint(posHeros);
    const delta = this.targetRGB.get();

    this.postProcess.setRGB(delta, delta, posHeros.getX(), posHeros.getY());
    this.postProcess.setWave(this.time * 0.1, this.targetWave.get(), center);
    // this.postProcess.setSketch(0.2);
    // this.postProcess.setFXAA();

    // this.postProcess.setGlitch4(this.time, delta, 0.4);
    // this.postProcess.setOil(1);
  }

  render() {
    super.render();
    this.postProcess.start();
    this.mainRender();
    this.postProcess.end();
    this.effects();
    this.postProcess.render();
  }

  setKeyboardInteraction(keyboard) {
    if (!this.isPause) {
      const { main: heros } = this.interactives.heros;
      heros.setInteraction(keyboard);
    }
  }

  callbackBulletShoot = (id, collisionBox, recoil) => {
    const { main: heros } = this.interactives.heros;
    heros.setRecoil(recoil);
    this.collisions.addBoxes([collisionBox]);
  };

  callbackBulletCollide = (id) => {
    this.collisions.removeBox(id);
  };

  setPause = (isPause) => {
    this.isPause = isPause;
  };
}
