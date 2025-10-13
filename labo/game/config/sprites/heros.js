import heros from "../persos/heros";

const {
  STAND,
  RUN,
  JUMP_UP,
  JUMP_DOWN,
  DASH,
  AIM,
  RUN_JUMP_UP,
  RUN_JUMP_DOWN,
  DIE,
  SLASH,
  SLASH_2,
  SLASH_3,
  WALL,
  WALL_UP,
  LAND,
  JUMP_LOAD,
  SLOW_DOWN,
} = heros.states;

export default {
  size: { w: 256, h: 512 },
  time: 100,
  refSize: 57,
  [STAND]: {
    uv: [
      {
        x: 28,
        y: 239,
        w: 26,
        h: 57,
        t: 1000,
      },
      {
        x: 0,
        y: 239,
        w: 28,
        h: 57,
        t: 1000,
      },
    ],
  },
  [RUN]: {
    uv: [
      {
        x: 39,
        y: 80,
        w: 40,
        h: 47,
      },
      {
        x: 106,
        y: 34,
        w: 40,
        h: 45,
      },
      {
        x: 0,
        y: 80,
        w: 39,
        h: 47,
      },
      {
        x: 79,
        y: 80,
        w: 39,
        h: 47,
      },
    ],
  },
  [DASH]: {
    uv: [
      {
        x: 84,
        y: 0,
        w: 99,
        h: 28,
        px: 90,
        py: 0,
      },
      {
        x: 146,
        y: 34,
        w: 100,
        h: 46,
        px: 90,
        py: 0,
      },
    ],
    iteration: 1,
    next: STAND,
  },
  [JUMP_LOAD]: {
    uv: [
      {
        x: 0,
        y: 34,
        w: 50,
        h: 37,
      },
    ],
  },
  [JUMP_UP]: {
    uv: [
      {
        x: 199,
        y: 128,
        w: 44,
        h: 55,
      },
      {
        x: 99,
        y: 183,
        w: 44,
        h: 56,
      },
    ],
  },
  [JUMP_DOWN]: {
    uv: [
      {
        x: 173,
        y: 239,
        w: 33,
        h: 64,
      },
      {
        x: 206,
        y: 239,
        w: 34,
        h: 64,
      },
    ],
  },
  [RUN_JUMP_UP]: {
    uv: [
      {
        x: 118,
        y: 128,
        w: 39,
        h: 52,
      },
      {
        x: 157,
        y: 128,
        w: 42,
        h: 52,
      },
    ],
  },
  [RUN_JUMP_DOWN]: {
    uv: [
      {
        x: 186,
        y: 183,
        w: 42,
        h: 56,
      },
      {
        x: 143,
        y: 183,
        w: 43,
        h: 56,
      },
    ],
  },
  [SLOW_DOWN]: {
    uv: [
      {
        x: 83,
        y: 239,
        w: 61,
        h: 58,
      },
    ],
  },
  [AIM]: {
    uv: [
      {
        x: 83,
        y: 239,
        w: 61,
        h: 58,
        cx: 57,
        cy: 41,
      },
    ], // cx / cy -> bullet pos
  },
  [LAND]: {
    uv: [
      {
        x: 183,
        y: 0,
        w: 45,
        h: 34,
      },
    ],
  },
  [WALL]: {
    uv: [
      {
        x: 54,
        y: 239,
        w: 29,
        h: 58,
      },
    ],
  },
  [WALL_UP]: {
    uv: [
      {
        x: 144,
        y: 239,
        w: 29,
        h: 58,
      },
    ],
  },
  [DIE]: {
    uv: [
      {
        x: 50,
        y: 34,
        w: 56,
        h: 40,
        t: 1000,
      },
      {
        x: 0,
        y: 0,
        w: 84,
        h: 18,
        t: 1000,
      },
    ],
    iteration: 1,
  },
  [SLASH]: {
    uv: [
      {
        x: 0,
        y: 303,
        w: 57,
        h: 75,
        t: 50,
        px: 24,
      },
      {
        x: 57,
        y: 303,
        w: 118,
        h: 95,
        t: 50,
        px: 31,
      },
      {
        x: 0,
        y: 128,
        w: 72,
        h: 48,
        t: 100,
        px: 43,
      },
    ],
    iteration: 1,
    next: STAND,
  },
  [SLASH_2]: {
    uv: [
      {
        x: 118,
        y: 80,
        w: 78,
        h: 48,
      },
      {
        x: 0,
        y: 183,
        w: 99,
        h: 55,
      },
    ],
    iteration: 1,
    next: STAND,
  },
  [SLASH_3]: {
    uv: [
      {
        x: 72,
        y: 128,
        w: 46,
        h: 51,
      },
      {
        x: 175,
        y: 303,
        w: 79,
        h: 106,
      },
    ],
    iteration: 1,
    next: STAND,
  },
};
