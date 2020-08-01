// import ProcessBase from './ProcessBase';
import TextureData from '../textures/TextureDataRgb';
import { mapFromRange } from '../utils/numbers';
import Program from './Program';
import pass1 from '../constants/shaders/particules/pass1Morph';
import pass2 from '../constants/shaders/particules/pass2Camera';
import ParticulesVbo from '../vbos/ParticulesVbo';
import Fbo from './Fbo';
import Screen from './Screen';
import Mat4 from '../maths/Mat4';
import {
  getRandomPointsInCube,
  getRandomPointsInSphere,
  getGridPerlinPoints,
  getGridPoints,
} from '../primitives/particules';

export default class /* extends ProcessBase */ {
  constructor(gl, width = 32, height = 32) {
    // super(gl, width, height, useDepth);
    const nbPoints = width * height;
    // const points = getRandomPointsInCube(nbPoints);
    const points = getGridPerlinPoints(width, height);
    console.log(points);
    // const points2 = getRandomPointsInSphere(nbPoints);
    const points2 = getGridPoints(width, height);

    this.model = new Mat4();
    this.screen = new Screen(gl);
    this.vbo = new ParticulesVbo(gl, width, height);
    this.texMap = new TextureData(gl, new Uint8Array(points));
    this.morphMap = new TextureData(gl, new Uint8Array(points2));
    this.program1 = new Program(gl, pass1);
    this.program2 = new Program(gl, pass2);
    this.fbo = new Fbo(gl, width, height);
  }

  compute(time) {
    // const program = this.applyTexToProg(this.program1, this.texMap.get());
    // this.renderToPingPong(program);
    const t = mapFromRange(Math.cos(time * 0.05), -1, 1, 0, 1);
    this.fbo.start();
    this.program1.setTexture(1, this.texMap.get(), 'textureMap');
    this.program1.setTexture(2, this.morphMap.get(), 'morphMap');
    this.program1.setFloat('time', t);
    this.screen.render(this.program1.get());
    this.fbo.end();
  }

  render(camera, time) {
    // const program2 = this.applyTexToProg(this.program2);
    // this.ppb.swap();
    // this.ppb.start();
    // this.vbo.render(program2.get());
    // this.ppb.end();

    this.model.identity();
    this.model.rotate(time, 0, 1, 0);
    this.program2.setMatrix('model', this.model.get());
    this.program2.setMatrix('projection', camera.getProjection().get());
    this.program2.setMatrix('view', camera.getView().get());
    this.program2.setTexture(0, this.fbo.getTexture().get(), 'textureMap');
    this.vbo.render(this.program2.get());

    // this.program1.setTexture(0, this.fbo.getTexture().get(), 'textureMap');
    // this.screen.render(this.program1.get());
  }
}
