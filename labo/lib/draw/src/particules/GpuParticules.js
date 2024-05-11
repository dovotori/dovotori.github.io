import TextureData from "../textures/TextureData";
import Primitive from "../gl/Primitive";
import Fbo from "../gl/Fbo";
import Screen from "../gl/Screen";
import { get2DGridTexturePoints } from "../primitives/particules";
import { nearestNextPowerOf2 } from "../../numbers";

export const getTextureSizeFromPoints = (points) => {
  const powerOfTwo = nearestNextPowerOf2(points.length);
  return Math.sqrt(powerOfTwo);
};

export const padMissingPoints = (points) => {
  const powerOfTwo = nearestNextPowerOf2(points.length);
  const missingDataCount = powerOfTwo - points.length;
  const missingData = Array.from({ length: missingDataCount }).fill(0);
  const padPosition = points.concat(missingData);
  return padPosition;
};

export default class {
  constructor(gl, width = 32, height = 32, modeDessin = gl.POINTS) {
    this.gl = gl;
    this.screen = new Screen(gl);
    this.fbo = new Fbo(gl, width, height);
    const texture = get2DGridTexturePoints(width, height); // points to parse texture data
    this.vbo = new Primitive(gl, { texture });
    this.vbo.setModeDessin(modeDessin || gl.POINTS);
    this.textures = {};
  }

  addDataTexture = (location, points) => {
    // points should be [r1,g1,b1,a1,r2 ...] values between 0 and 255 (in shader became 0.0 to 1.0)
    this.textures = {
      ...this.textures,
      [location]: new TextureData(this.gl, new Uint8Array(points)),
    };
  };

  compute(progPass1, time = 0) {
    Object.keys(this.textures).forEach((location, index) => {
      progPass1.setTexture(index, this.textures[location].get(), location);
    });

    progPass1.setFloat("time", time);
    this.fbo.start();
    this.screen.render(progPass1.get());
    this.fbo.end();
  }

  render(progPass2) {
    // shoud resize viewport before // scene.resizeViewport()
    progPass2.setTexture(0, this.fbo.getTexture().get(), "textureMap");
    this.vbo.render(progPass2.get());
  }
}
