import Scene from '../../lib/webgl/scenes/SceneLampe';

import Target from '../../lib/webgl/maths/Target';
import Collisions from '../../lib/webgl/collisions/Collisions';

import Background from './game/Background';
import Tilemap from './game/Tilemap';
import Heros from './persos/Heros';
import Monster from './persos/Monster';

export default class extends Scene {
  constructor(gl, config) {
    super(gl, config);

    this.targetRGB = new Target(0, 0.1);
    this.targetWave = new Target(0, 0.1);

    this.oldInverse = false;
    this.oldAiming = false;
    this.isPause = true;
    this.interactives = {};
    this.tilemap = null;
  }

  // renderBeforeProcess() {
  //   this.heros.renderColor(this.mngObj.get("tile"), this.mngProg.get("color"))
  //   if (this.mousePos !== null) {
  //     const pixel = this.getColorPixel(this.mousePos)
  //     this.heros.setSelected(pixel)
  //   }
  // }

  setupGameLevel(level, spriteLevel, callbackRestart) {
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
              this.interactives[id] = new Heros({
                constants,
                sprites,
                viewBox,
                tileSize,
                bullets,
                fxs,
              });
              this.interactives[id].setCallbackDeath(callbackRestart);
              break;
            }
            case 'monster': {
              this.interactives[id] = new Monster({
                constants,
                sprites,
                viewBox,
                tileSize,
              });
              break;
            }
            default:
              break;
          }
        }
      });

      const boxes = Object.keys(this.interactives).map((id) =>
        this.interactives[id].getCollisionBox(),
      );

      this.background = new Background(viewBox, this.tilemap.getLevelSize());
      this.collisions = new Collisions(boxes);
      const { addBoxes, removeBox } = this.collisions;
      Object.keys(this.interactives).forEach((id) => {
        this.interactives[id].setCallbacks({ addBoxes, removeBox });
      });
    }
  }

  resetGameLevel() {
    Object.keys(this.interactives).forEach((id) => {
      this.interactives[id].reset();
    });
    this.collisions.clear();
    const boxes = Object.keys(this.interactives).map((id) =>
      this.interactives[id].getCollisionBox(),
    );
    this.collisions.addBoxes(boxes);
  }

  update(time) {
    super.update(time);

    const { heros } = this.interactives;

    const herosWorldPos = heros.getWorldPosition();
    const herosPos = heros.getPosition();
    const map = this.tilemap.get();

    this.camera.followPosY(herosWorldPos[1]);
    this.tilemap.follow(herosPos);
    this.tilemap.update(this.mngProg.get('spritePhong'));
    // this.background.update(herosPos);

    if (!this.isPause) {
      const tileSize = this.tilemap.getTileSize();

      Object.keys(this.interactives).forEach((id) => {
        this.interactives[id].update(map, tileSize);
      });

      // if (this.mousePos !== null) {
      //   const pixel = this.getColorPixel(this.mousePos);
      //   this.perso.setSelected(pixel);
      // }
      this.updateCollisionsInteractions();
    }
  }

  updateCollisionsInteractions = () => {
    const collisionsIdentifiers = this.collisions.get();
    if (collisionsIdentifiers.length > 0) {
      collisionsIdentifiers.forEach(({ type, on, from, bulletId }) => {
        switch (type) {
          case 'SIMPLE': {
            const onElem = this.interactives[on];
            const fromElem = this.interactives[from];
            const isAttacking = onElem.getStatus() === 'SLASH';
            if (isAttacking) {
              fromElem.addToSpeed(fromElem.getX() < onElem.getX() ? -1 : 1);
              fromElem.setDamage(30);
            } else {
              onElem.addToSpeed(fromElem.getX() < onElem.getX() ? 1 : -1);
              onElem.setDamage(10);
            }
            break;
          }
          case 'SHOOT': {
            const onElem = this.interactives[on];
            const fromElem = this.interactives[from];
            onElem.addToSpeed(fromElem.getX() < onElem.getX() ? 1 : -1);
            onElem.setDamage(10);
            this.collisions.removeBox(bulletId);
            fromElem.removeBullet(bulletId);
            break;
          }
          default:
            break;
        }
      });
    }
  };

  renderPause() {
    super.render();
    this.renderBackground();
    this.renderTilemap();
  }

  mainRender() {
    this.renderBackground();
    this.renderTilemap();
    this.renderInteractives();
    this.renderForeground();
  }

  renderTilemap() {
    this.tilemap.render(
      this.mngProg.get('spritePhong'),
      this.mngTex.get('level1'),
      this.mngObj.get('cubeTile'),
      this.mngObj.get('tile'),
    );
  }

  renderInteractives() {
    Object.keys(this.interactives).forEach((id) => {
      this.interactives[id].render(
        this.mngProg.get('sprite'),
        this.mngTex.get('heros'),
        this.mngObj.get('tile'),
      );
    });
    const { heros } = this.interactives;
    heros.renderFxs(this.mngProg.get('sprite'), this.mngTex.get('fx'), this.mngObj.get('tile'));
    heros.renderBullets(
      this.mngProg.get('sprite'),
      this.mngTex.get('bullet'),
      this.mngObj.get('tile'),
    );
  }

  renderBackground() {
    const { heros } = this.interactives;
    const herosPosX = heros.getX();
    const program = this.mngProg.get('background');
    this.background.renderMountains(this.mngObj.get('tile'), this.mngProg.get('color'));
    this.background.updateScreens(-0.15);
    program.setTexture(0, this.mngTex.get('clouds').get(), 'textureMap');
    this.background.renderScreen(this.mngObj.get('tile'), program, herosPosX, 0.0005);
    this.background.updateScreens(-0.1);
    program.setTexture(0, this.mngTex.get('rocks').get(), 'textureMap');
    this.background.renderScreen(this.mngObj.get('tile'), program, herosPosX, 0.001);
    this.background.updateScreens(-0.05);
    program.setTexture(0, this.mngTex.get('ground').get(), 'textureMap');
    this.background.renderScreen(this.mngObj.get('tile'), program, herosPosX, 0.005);
    this.background.renderCloudsBack(this.mngObj.get('tile'), this.mngProg.get('color'));
  }

  renderForeground() {
    this.background.renderCloudsFront(this.mngObj.get('tile'), this.mngProg.get('color'));
  }

  effects() {
    const { heros } = this.interactives;
    const posHeros = heros.getAimingPosition();
    const herosInvX = heros.getInverseX();
    const herosIsAim = heros.isAiming();

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
    this.postProcess.setWave(this.time * 0.01, this.targetWave.get(), center);
    // this.postProcess.setSketch(0.2);
    // this.postProcess.setFxaa();

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
      const { heros } = this.interactives;
      heros.setInteraction(keyboard);
    }
  }

  setPause = (isPause) => {
    this.isPause = isPause;
  };
}
