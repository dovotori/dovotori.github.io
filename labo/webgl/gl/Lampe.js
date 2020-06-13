import Objectif from "./Objectif";
import Fbo from "./Fbo";
import MeshRepere from "../meshes/MeshRepere";
import Vec3 from "../maths/Vec3";

export default class extends Objectif {
  constructor(gl, config, width = 1024, height = 1024) {
    super(config);
    this.gl = gl;
    this.fbo = new Fbo(this.gl, width, height, true);
    this.sizeRepere = new Vec3(0.05, 0.05, 0.05);
    this.repere = new MeshRepere(this.gl);
    this.repere.update(this.position, this.sizeRepere);
    this.lookAt();
  }

  start() {
    this.fbo.start();
  }

  end() {
    this.fbo.end();
  }

  move(time, offset = 0) {
    this.position.set(
      Math.cos(time * 0.002) * (4.0 + offset),
      this.position.getY(),
      Math.sin(time * 0.002) * (4.0 + offset),
    );
    this.lookAt();
    this.repere.update(this.position, this.sizeRepere);
  }

  renderRepere(camera) {
    this.repere.render(camera);
  }

  getDepthTexture() {
    return this.fbo.getDepthTexture();
  }
}
