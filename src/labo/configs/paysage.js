export default {
  programs: [
    'basique3d',
    'paysage',
    'emissive',
    'buffers',
    'albedo',
    'diffuse',
  ],
  assets: ['/objets/paysage.obj', '/objets/paysage.mtl'],
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
