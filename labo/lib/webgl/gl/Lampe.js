import Vec3 from "../../utils/maths/Vec3";
import Objectif from "../../utils-3d/cameras/Objectif";
import MeshRepere from "../meshes/MeshRepere";
import Fbo from "./Fbo";

export default class extends Objectif {
  constructor(gl, config, width = 1024, height = 1024, useDepth = false) {
    super(config);
    this.gl = gl;
    this.fbo = new Fbo(this.gl, width, height, useDepth);
    this.sizeRepere = new Vec3(0.05, 0.05, 0.05);
    this.repere = new MeshRepere(this.gl);
    this.repere.update(this.position, this.sizeRepere);
    this.lookAt();
  }

  start() {
    this.fbo.start();
    // this.gl.cullFace(this.gl.FRONT);
  }

  end() {
    // this.gl.cullFace(this.gl.BACK);
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

  renderRepere(program) {
    this.repere.render(program);
  }

  getDepthTexture() {
    return this.fbo.getDepthTexture();
  }

  setDepthProgram(program) {
    program.setMatrix("projection", this.getOrtho().get());
    program.setMatrix("view", this.getView().get());
  }

  setShadowProgram(program) {
    // need to have renderBasiqueForLampeDepth method on scene
    program.setTexture(2, this.getDepthTexture().get(), "shadowMap");
    program.setMatrix("shadowView", this.getView().get());
    program.setMatrix("shadowProjection", this.getOrtho().get());
    program.setVector("posLum", this.getPosition());
  }

  resize(box) {
    this.fbo.resize(box);
  }
}
