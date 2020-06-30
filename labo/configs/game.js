import {
  UP,
  DOWN,
  LEFT,
  RIGHT,
  SPACE,
  SHIFT,
  X,
  W,
  ENTER,
  ECHAP,
} from '../webgl/constants/keyboard';

import spriteHeros from '../webgl/constants/sprites/heros';
import spriteBullet from '../webgl/constants/sprites/bullet';
import spriteFx from '../webgl/constants/sprites/fx';
import spriteMonster from '../webgl/constants/sprites/monster';
import spriteTiles from '../webgl/constants/sprites/tiles';

import herosConstants from '../webgl/constants/persos/heros';
import bulletConstants from '../webgl/constants/persos/bullet';
import fxConstants from '../webgl/constants/persos/fx';
import monsterConstants from '../webgl/constants/persos/monster';

export default {
  assets: [
    '/textures/heros.png',
    '/textures/fx.png',
    '/textures/bullet.png',
    '/textures/level1.png',
    '/textures/rocks.png',
    '/textures/ground.png',
    '/textures/clouds.png',
    '/obj/tile.obj',
    '/obj/cube.obj',
    '/obj/cubeTile.obj',
    '/levels/level3.bmp',
  ],
  programs: ['color', 'sprite', 'spritePhong', 'albedoPhong', 'background'],
  camera: {
    position: { x: 10, y: 10, z: 22 },
    target: { x: 10, y: 10, z: 0 },
    near: 1,
    far: 1000,
    angle: 40,
  },
  lampes: [
    {
      type: 0,
      position: { x: 0, y: 0, z: 0 },
      ambiant: [1, 1, 1],
      diffuse: [1, 0.9, 0.9],
      specular: [0, 0, 0],
      strength: 1,
      brillance: 200,
    },
  ],
  controls: {
    fullscreen: { domId: 'game', buttonId: 'fullscreen-toggle-btn' },
  },
  keyboard: {
    UP,
    DOWN,
    LEFT,
    RIGHT,
    SPACE,
    SHIFT,
    X,
    W,
    ENTER,
    ECHAP,
  },
  postprocess: {
    effects: ['fxaa', 'rgb', 'wave', 'blurDirection', 'pixel'],
  },
  useDepthTexture: false,
  splashscreen: false,
  canvas: {
    width: 1024,
    height: 1024,
  },
  game: {
    types: {
      heros: {
        constants: herosConstants,
        sprites: spriteHeros,
        fxs: {
          constants: fxConstants,
          sprites: spriteFx,
        },
        bullets: {
          constants: bulletConstants,
          sprites: spriteBullet,
        },
      },
      monster: {
        constants: monsterConstants,
        sprites: spriteMonster,
      },
    },
    levels: [
      {
        name: 'level 1',
        tilemap: {
          texture: 'level3',
          tileSize: {
            w: 1,
            h: 1,
          },
          viewBox: {
            w: 20,
            h: 10,
          },
          sprites: spriteTiles,
        },
        interactives: {
          heros: { type: 'heros', x: 4, y: 5, z: 0.1 },
          'monster-1': { type: 'monster', x: 10, y: 4, z: 0.2 },
        },
      },
    ],
  },
};
