import earcut from 'earcut';
import { getAbsoluteCoor } from 'Labo/lib/parseSvgPath';
import Scene from '../lib/webgl/scenes/SceneCamera';
import Primitive from '../lib/webgl/gl/Primitive';
import Mat4 from '../lib/webgl/maths/Mat4';
import { hslToRgb } from '../lib/webgl/utils/color';

const pathLogo =
  'm40.5 162-6.21 6.27 20.9 33.3-50.1 50.1v12.5l20.9 20.9v-27.2l14.6-14.6 12.6 12.5h29.2l12.5-12.5 14.6 14.6v27.2l20.9-20.9v-12.5l-50.1-50.1 20.9-33.3-6.31-6.27-27.2 27.2z';

export default class extends Scene {
  constructor(gl, config, assets) {
    super(gl, config, assets);

    const points = getAbsoluteCoor(pathLogo);
    const indices = earcut(points.flat());

    const position = indices.reduce((acc, cur) => {
      const point = [...points[cur], 0];
      const newPoints = acc.concat(point);
      return newPoints;
    }, []);

    const nbTriangles = indices.length / 3;
    const colorPerTriangle = Array.from({ length: nbTriangles }, () => {
      const { r, g, b } = hslToRgb(40, Math.random() * 100, 50);
      return [r / 255, g / 255, b / 255, 1.0];
    });

    const color = indices.reduce((acc, cur, index) => {
      const indexColor = Math.floor(index / 3);
      const newColors = acc.concat(colorPerTriangle[indexColor]);
      return newColors;
    }, []);

    this.vboDelaunay = new Primitive(gl, { position, color });
    // this.vboDelaunay.setModeDessin(gl.TRIANGLES);

    this.bloom.setBlurSize(0.4);
    this.bloom.setBlurIntensity(1.1);
    this.model = new Mat4();
  }

  destroy = () => {
    if (this.buttons) {
      this.buttons.forEach((button, index) =>
        button.removeEventListener('click', () => this.onClickButton(index), false)
      );
    }
  };

  render() {
    super.render();
    this.model.identity();
    this.model.rotate(this.time * 0.01, 0, 1, 0);
    this.mngProg.get('vertexColor').setMatrix('model', this.model.get());
    this.bloom.start();
    this.vboDelaunay.render(this.mngProg.get('vertexColor').get());
    this.bloom.end();
    this.bloom.render();
  }
}
