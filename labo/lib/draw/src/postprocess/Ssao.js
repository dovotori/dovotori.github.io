import Blur from "./Blur";
import Vec3 from "../maths/Vec3";
import { lerp } from "../../easing";
import { random } from "../../../utils/numbers";

export default class extends Blur {
  constructor(gl, config, programs = {}) {
    super(gl, config, programs);

    this.near = config.near || 1.0;
    this.far = config.far || 100.0;
    this.radius = config.radius || 5.0;
    this.strength = config.strength || 1.0;

    const program = this.programs.ssao;
    program.setFloat("radius", this.radius);
    program.setFloat("near", this.near);
    program.setFloat("far", this.far);
    program.setFloat("strength", this.strength);
  }

  generateSsaoSamples(effect, nbSamples) {
    // not used anymore
    for (let i = 0; i < nbSamples; i += 1) {
      let scale = i / nbSamples;
      scale = lerp(scale * scale, 0.1, 1.0);
      const sample = new Vec3(
        random(-1.0, 1.0),
        random(-1.0, 1.0),
        random(0.0, 1.0)
      )
        .normalise()
        .multiplyNumber(random(0.0, 1.0))
        .multiplyNumber(scale);
      this.programs[effect].setVector(`samples[${i}]`, sample.get());
    }
  }

  compute(depthTex) {
    const program = this.applyTexToProg(this.programs.ssao, depthTex);
    program.setFloat("flipY", -1.0);
    this.renderToPingPong(program);
  }

  // for old version ssao chapman / not working :(
  // computeSsao(projection, view, positionTex, normalTex, depthTex, radius) {
  //   const invView = new Mat4();
  //   const invProj = new Mat4();
  //   invView.equal(view).inverse();
  //   invProj.equal(projection).inverse();

  //   const finalProj = new Mat4();
  //   finalProj.equal(view).multiply(projection);

  //   const program = this.programs.ssao;
  //   program.setMatrix('finalProj', projection.get());
  //   program.setMatrix('inverseView', invView.get());
  //   program.setMatrix('inverseProjection', invProj.get());
  //   program.setTexture(0, positionTex, 'positionMap');
  //   program.setTexture(1, normalTex, 'normalMap');
  //   program.setTexture(2, depthTex, 'depthMap');
  //   program.setTexture(3, this.textures.ssao.get(), 'noiseMap');
  //   program.setFloat('radius', radius);

  //   program.setFloat('near', 1);
  //   program.setFloat('far', 40);
  //   program.setFloat('strength', 1.0);

  //   this.fboSsao.start();
  //   this.screen.render(program.get());
  //   this.fboSsao.end();
  // }
}
