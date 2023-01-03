import earcut from "earcut";
import { getAbsoluteCoor } from "Labo/lib/parseSvgPath";
import Scene from "../lib/webgl/scenes/SceneCamera";
import Primitive from "../lib/webgl/gl/Primitive";
import Mat4 from "../lib/webgl/maths/Mat4";
import { hslToRgb } from "../lib/webgl/utils/color";

const pathLogo =
  "m-10-20-2 2 8 12-18 18v5l7 7v-10l5-5 5 5h10l5-5 5 5v10l7-7v-5l-18-18 8-12-2-2-10 10z";

export default class extends Scene {
  setup() {
    const { gl } = this;
    const points = getAbsoluteCoor(pathLogo, true);
    const indices = earcut(points.flat());

    const position = indices.reduce((acc, cur) => {
      const [x, y] = points[cur];
      const z = Math.random() * 5.0;
      const point = [x, y, z];
      const newPoints = acc.concat(point);
      return newPoints;
    }, []);

    const nbTriangles = indices.length / 3;
    const colorPerTriangle = Array.from({ length: nbTriangles }, () => {
      const { r, g, b } = hslToRgb(150 + Math.random() * 100, 50, 60);
      return [r / 255, g / 255, b / 255, 1.0];
    });

    const color = indices.reduce((acc, cur, index) => {
      const indexColor = Math.floor(index / 3);
      const newColors = acc.concat(colorPerTriangle[indexColor]);
      return newColors;
    }, []);

    this.vbo = new Primitive(gl, { position, color });
    // this.vbo.setModeDessin(gl.TRIANGLES);
    this.model = new Mat4();
  }

  render() {
    super.render();
    this.model.identity();
    this.model.rotate(Math.cos(this.time * 0.001) * 50.0, 0, 1, 0);
    this.mngProg.get("vertexColor").setMatrix("model", this.model.get());
    this.bloom.start();
    this.vbo.render(this.mngProg.get("vertexColor").get());
    this.bloom.end();
    this.bloom.render();
  }
}
