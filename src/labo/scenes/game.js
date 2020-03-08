import {
  SceneLampe as Scene,
  Background,
  Tilemap,
  Target,
  Heros,
  Monster,
  Bullets,
  Fxs,
  CollisionSweepPrune,
  // mapFromRange,
} from '../../game';

import {
  spriteHeros,
  spriteBullet,
  spriteFx,
  spriteMonster,
  spriteTiles,
} from '../../game/constants/sprites';

import {
  heros as herosConstants,
  bullet as bulletConstants,
  fx as fxConstants,
  monster as monsterConstants,
} from '../../game/constants/persos';

const isCollide = (pair, id1, id2) => {
  if (pair[0] === id1 && pair[1] === id2) {
    return pair;
  } if (pair[0] === id2 && pair[1] === id1) {
    return [pair[1], pair[0]];
  }
  return null;
};

const isCollideGroup = (pair, id1, groupId) => {
  if (pair[0] === id1 && pair[1].indexOf(groupId) !== -1) {
    return pair;
  } if (pair[0].indexOf(groupId) !== -1 && pair[1] === id1) {
    return [pair[1], pair[0]];
  }
  return null;
};

export default class extends Scene {
  constructor(gl, config, assets, width = 1024, height = 1024) {
    super(gl, config, assets, width, height);

    this.targetRGB = new Target(0, 0.1);
    this.targetWave = new Target(0, 0.1);

    this.tilemap = new Tilemap(
      assets.levels.level3,
      this.config.tilemap,
      spriteTiles,
    );

    const { tileSize } = this.config.tilemap;
    const viewBox = this.tilemap.getViewBox();

    this.heros = new Heros({
      constants: herosConstants,
      sprites: spriteHeros,
      viewBox,
      tileSize,
    });
    this.bullets = new Bullets(bulletConstants, spriteBullet, viewBox);
    this.monster = new Monster({
      constants: monsterConstants,
      sprites: spriteMonster,
      viewBox,
      tileSize,
    });

    this.background = new Background(viewBox, this.tilemap.getLevelSize());
    this.bullets.setCallbackShoot(this.callbackBulletShoot);
    this.bullets.setCallbackCollide(this.callbackBulletCollide);
    this.collision = new CollisionSweepPrune();
    this.boxes = [this.heros.getCollisionBox(), this.monster.getCollisionBox()];
    this.collision.addBoxes(this.boxes);
    this.oldInverse = false;
    this.oldAiming = false;

    this.setLampeInfos(this.mngProg.get('spritePhong'));
    this.setLampeInfos(this.mngProg.get('albedoPhong'));

    this.fxs = new Fxs(fxConstants, spriteFx, viewBox);
  }

  // renderBeforeProcess() {
  //   this.heros.renderColor(this.mngObj.get("tile"), this.mngProg.get("color"))
  //   if (this.mousePos !== null) {
  //     const pixel = this.getColorPixel(this.mousePos)
  //     this.heros.setSelected(pixel)
  //   }
  // }

  resize(box) {
    super.resize(box);
    this.postProcess.resize(box);
  }

  update() {
    const herosWorldPos = this.heros.getWorldPosition();
    this.camera.followPosY(herosWorldPos[1]);
    super.update();
    const map = this.tilemap.get();
    const { tileSize } = this.config.tilemap;
    const herosPos = this.heros.getPosition();
    const herosInvX = this.heros.getInverseX();
    const herosIsAim = this.heros.getAiming();
    this.tilemap.follow(herosPos);
    this.tilemap.update(this.mngProg.get('spritePhong'));
    this.background.update(herosPos);
    this.heros.update(map, tileSize);
    this.monster.update(map, tileSize);
    this.bullets.update(
      map,
      tileSize,
      this.heros.getAimingPos(),
      herosIsAim,
      herosInvX,
    );
    // if (this.mousePos !== null) {
    //   const pixel = this.getColorPixel(this.mousePos);
    //   this.perso.setSelected(pixel);
    // }
    this.collision.getPaires().forEach((pair) => {
      if (isCollide(pair, 'heros', 'monster')) {
        this.heros.addToSpeed(this.monster.getX() < this.heros.getX() ? 1 : -1);
      } else {
        const newPair = isCollideGroup(pair, 'monster', 'bullet');
        if (newPair) {
          this.monster.addToSpeed(
            this.monster.getX() < this.heros.getX() ? -1 : 1,
          );
          this.collision.removeBox(newPair[1]);
          this.bullets.removeOne(newPair[1]);
        }
      }
    });
  }

  renderToProcess() {
    this.background.renderMountains(
      this.mngObj.get('tile'),
      this.mngProg.get('color'),
    );
    this.background.updateScreens(-0.15);
    this.mngProg
      .get('background')
      .setTexture(0, this.mngTex.get('clouds').get(), 'textureMap');
    this.background.renderScreen(
      this.mngObj.get('tile'),
      this.mngProg.get('background'),
      this.heros.getPosition()[0],
      0.0005,
    );
    this.background.updateScreens(-0.1);
    this.mngProg
      .get('background')
      .setTexture(0, this.mngTex.get('rocks').get(), 'textureMap');
    this.background.renderScreen(
      this.mngObj.get('tile'),
      this.mngProg.get('background'),
      this.heros.getPosition()[0],
      0.001,
    );
    this.background.updateScreens(-0.05);
    this.mngProg
      .get('background')
      .setTexture(0, this.mngTex.get('ground').get(), 'textureMap');
    this.background.renderScreen(
      this.mngObj.get('tile'),
      this.mngProg.get('background'),
      this.heros.getPosition()[0],
      0.005,
    );
    this.background.renderCloudsBack(
      this.mngObj.get('tile'),
      this.mngProg.get('color'),
    );
    this.tilemap.render(
      this.mngProg.get('spritePhong'),
      this.mngTex.get('level1'),
      this.mngObj.get('cubeTile'),
      this.mngObj.get('tile'),
    );
    this.heros.render(
      this.mngProg.get('sprite'),
      this.mngTex.get('heros'),
      this.mngObj.get('tile'),
    );
    this.monster.render(
      this.mngProg.get('sprite'),
      this.mngTex.get('heros'),
      this.mngObj.get('tile'),
    );
    this.fxs.render(
      this.mngProg.get('sprite'),
      this.mngTex.get('fx'),
      this.mngObj.get('tile'),
    );
    this.bullets.render(
      this.mngProg.get('sprite'),
      this.mngTex.get('bullet'),
      this.mngObj.get('tile'),
    );
    this.background.renderCloudsFront(
      this.mngObj.get('tile'),
      this.mngProg.get('color'),
    );
  }

  effects() {
    const herosStatus = this.heros.getStatus();
    const posHeros = this.heros.getAimingPosition();
    const herosInvX = this.heros.getInverseX();
    const herosIsAim = this.heros.getAiming();
    const { JUMP_UP, RUN_JUMP_UP } = herosConstants.states;
    const { DUST } = fxConstants.states;

    this.fxs.update();
    if (
      this.heros.isStatusChanged()
      && (herosStatus === JUMP_UP || herosStatus === RUN_JUMP_UP)
    ) {
      this.fxs.createNewOne(this.heros.getLastJumpingPosition(), DUST);
    }
    const lastRunningPosition = this.heros.getLastRunningPosition();
    if (lastRunningPosition !== null) {
      this.fxs.createNewOne(lastRunningPosition, DUST);
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
      this.camera.setSmoothZoom(herosIsAim ? 0.4 : 1);
      this.oldAiming = herosIsAim;
    }
    this.targetRGB.set(this.heros.getDashing() ? 2 : 0);

    const center = this.camera.get2dTexturePoint(posHeros);
    const delta = this.targetRGB.get();
    // const pixelize = mapFromRange(this.camera.getZoom(), 0, 1, 1, 4);

    this.postProcess.setRGB(delta, delta, posHeros.getX(), posHeros.getY());
    this.postProcess.setWave(this.time * 0.1, this.targetWave.get(), center);
    // this.postProcess.setPixel(pixelize, pixelize);
    // this.postProcess.setGlitch4(this.time, delta, 0.4);
    this.postProcess.setFXAA();
  }

  render() {
    super.render();
    this.postProcess.start();
    this.renderToProcess();
    this.postProcess.end();
    this.effects();
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.postProcess.render();
  }

  setKeyboardInteraction(keyboard) {
    this.heros.setInteraction(keyboard);
  }

  callbackBulletShoot = (id, collisionBox, recoil) => {
    this.heros.setRecoil(recoil);
    this.collision.addBoxes([collisionBox]);
  };

  callbackBulletCollide = (id) => {
    this.collision.removeBox(id);
  };
}
