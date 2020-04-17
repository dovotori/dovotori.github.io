export default {
  programs: [
    'basique3d',
    'paysage',
    'emissive',
    'buffers',
    'albedo',
    'diffuse',
  ],
  assets: [
    '/objets/plot.obj', '/objets/plot.mtl',
    '/objets/road.obj', '/objets/road.mtl',
    '/objets/mailbox.obj', '/objets/mailbox.mtl',
    '/objets/panel.obj', '/objets/panel.mtl',
    '/objets/bench.obj', '/objets/bench.mtl',
    '/objets/electric.obj', '/objets/electric.mtl'
  ],
  positions: {
    plot: [
      { x: -0.74175, z: -0.889829, y: 0.03561 },
      { x: -0.57378, z: -0.91103, y: 0.03561 },
      { x: -0.363515, z: -0.8868, y: 0.03561 }
    ],
    road: [{ x: 0, y: -0.2, z: 0 }],
    electric: [{ x: -0.5, y: 0, z: -0.4 }],
    mailbox: [{ x: -0.2, y: 0, z: -0.4 }],
    bench: [{ x: -0.2, y: 0, z: -0.4 }],
    panel: [{ x: 0, y: 0, z: 0 }]
  },
  camera: {
    position: { x: 2, y: 2, z: 4 },
    target: { x: 0, y: 0, z: 0 },
    near: 1,
    far: 40,
    angle: 90,
  },
  lampes: [
    {
      type: 1,
      position: { x: 2.5, y: 2.5, z: 0 },
      ambiant: [0, 0, 0],
      diffuse: [0.6, 0.5, 0.5],
      specular: [0, 0, 0],
      radius: 1,
      // direction: [0, 0, 1]
    },
    // {
    //   type: 1,
    //   position: { x: 0, y: 0, z: 4 },
    //   ambiant: [0, 0, 0],
    //   diffuse: [1, 1, 1],
    //   specular: [0, 0, 0],
    //   radius: 10,
    //   direction: [0, 0, 1]
    // }
  ],
  mouse: ['drag', 'wheel'],
  postprocess: {
    effects: ['blur', 'dof', 'bloom', 'fxaa', 'gamma', 'compose'],
    useDepth: true,
  },
  canvas: {
    width: 1024,
    height: 1024,
  },
};
