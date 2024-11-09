import ProcessBase from "./ProcessBase";
import TextureNoise from "../textures/TextureNoise";

export default class extends ProcessBase {
  constructor(gl, config, programs = {}) {
    super(gl, config, programs);

    this.textures = {};
    Object.keys(this.programs).forEach((effect) => {
      switch (effect) {
        case "watercolor2":
        case "watercolor3":
          this.textures[effect] = new TextureNoise(this.gl, 512, 512);
          break;
        default:
          break;
      }
    });
  }

  setDOF(range, blur, focusDistance, ppm, tex = null) {
    const program = this.applyTexToProg(this.programs.dof, tex);
    program.setFloat("focusDistance", focusDistance);
    program.setFloat("blur", blur);
    program.setFloat("ppm", ppm);
    program.setVector("range", range);
    program.setTexture(2, this.ppb.getDepthTexture().get(), "depthMap");
    this.renderToPingPong(program);
  }

  mergeBloom(bloomTexture, gamma = 1.0, exposure = 1.0, tex = null) {
    const program = this.applyTexToProg(this.programs.mergeBloom, tex);
    program.setFloat("gamma", gamma);
    program.setFloat("exposure", exposure);
    program.setTexture(3, bloomTexture.get(), "bloomMap");
    this.renderToPingPong(program);
  }

  setKuwahara(tex = null) {
    const program = this.applyTexToProg(this.programs.kuwahara, tex);
    this.renderToPingPong(program);
  }

  setWatercolor(tex = null) {
    const program = this.applyTexToProg(this.programs.watercolor, tex);
    this.renderToPingPong(program);
  }

  setWatercolor2(gradientStep, advectStep, flipHeightMap, time, tex = null) {
    const program = this.applyTexToProg(this.programs.watercolor2, tex);
    program.setFloat("gradientStep", gradientStep);
    program.setFloat("advectStep", advectStep);
    program.setFloat("flipHeightMap", flipHeightMap);
    program.setFloat("time", time);
    program.setTexture(2, this.textures.watercolor2.get(), "heightMap");
    this.renderToPingPong(program);
  }

  setWatercolor3(tex = null) {
    const program = this.applyTexToProg(this.programs.watercolor3, tex);
    program.setTexture(2, this.textures.watercolor3.get(), "noiseMap");
    this.renderToPingPong(program);
  }

  setWatercolorMoving(time, mouse, scale = 4.0, tex = null) {
    const program = this.applyTexToProg(this.programs.watercolorMoving, tex);
    program.setFloat("time", time);
    program.setVector("mouse", mouse);
    program.setFloat("scale", scale);
    this.renderToPingPong(program);
  }

  setSobel(tex = null) {
    const program = this.applyTexToProg(this.programs.sobel, tex);
    this.renderToPingPong(program);
  }

  setGamma(gamma, tex = null) {
    const program = this.applyTexToProg(this.programs.gamma, tex);
    program.setFloat("gamma", gamma);
    this.renderToPingPong(program);
  }

  setRGB(deltaX, deltaY, centerX, centerY, tex = null) {
    const program = this.applyTexToProg(this.programs.rgb, tex);
    program.setVector("center", [centerX, centerY]);
    program.setVector("delta", [deltaX, deltaY]);

    this.renderToPingPong(program);
  }

  setVortex(center, radius, angle, tex = null) {
    const program = this.applyTexToProg(this.programs.vortex, tex);
    program.setVector("center", center);
    program.setFloat("radius", radius);
    program.setFloat("angle", angle);
    this.renderToPingPong(program);
  }

  setOil(radius, tex = null) {
    const program = this.applyTexToProg(this.programs.oil, tex);
    program.setFloat("radius", radius);
    this.renderToPingPong(program);
  }

  setSketch(delta, tex = null) {
    const program = this.applyTexToProg(this.programs.sketch, tex);
    program.setFloat("delta", delta);
    this.renderToPingPong(program);
  }

  setPixel(deltaX, deltaY, tex = null) {
    const program = this.applyTexToProg(this.programs.pixel, tex);
    program.setVector("delta", [deltaX, deltaY]);
    this.renderToPingPong(program);
  }

  setWave(time, radius, center, tex = null) {
    const program = this.applyTexToProg(this.programs.wave, tex);
    program.setFloat("time", time);
    program.setFloat("radius", radius);
    program.setVector("center", center);
    this.renderToPingPong(program);
  }

  setSepia(delta, tex = null) {
    const program = this.applyTexToProg(this.programs.sepia, tex);
    program.setFloat("delta", delta);
    this.renderToPingPong(program);
  }

  setGlitch(time, delta, speed, tex = null) {
    const program = this.applyTexToProg(this.programs.glitch, tex);
    program.setFloat("delta", delta);
    program.setFloat("time", time);
    program.setFloat("speed", speed);
    this.renderToPingPong(program);
  }

  setGlitch2(time, delta, speed, tex = null) {
    const program = this.applyTexToProg(this.programs.glitch2, tex);
    program.setFloat("delta", delta);
    program.setFloat("time", time);
    program.setFloat("speed", speed);

    this.renderToPingPong(program);
  }

  setGlitch3(time, delta, tex = null) {
    const program = this.applyTexToProg(this.programs.glitch3, tex);
    program.setFloat("delta", delta);
    program.setFloat("time", time);
    this.renderToPingPong(program);
  }

  setGlitch4(time, delta, rate, tex = null) {
    const program = this.applyTexToProg(this.programs.glitch4, tex);
    program.setFloat("delta", delta);
    program.setFloat("time", time);
    program.setFloat("rate", rate);
    this.renderToPingPong(program);
  }

  setSignature(time, delta, tex = null) {
    const program = this.applyTexToProg(this.programs.signature, tex);
    program.setFloat("delta", delta);
    program.setFloat("time", time);
    this.renderToPingPong(program);
  }

  setCompose(ssaoMap, shadowMap, depthMap, tex = null) {
    const program = this.applyTexToProg(this.programs.compose, tex);
    program.setTexture(6, ssaoMap, "ssaoMap");
    program.setTexture(7, shadowMap, "shadowMap");
    program.setTexture(4, depthMap, "depthMap");
    // program.setTexture(2, albedoMap, 'albedoMap');
    this.renderToPingPong(program);
  }

  setComposeShadow(shadowMap, tex = null) {
    const program = this.applyTexToProg(this.programs.composeShadow, tex);
    program.setTexture(4, shadowMap, "shadowMap");
    this.renderToPingPong(program);
  }
}
