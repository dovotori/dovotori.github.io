import { MeshColor as Mesh } from "../meshes";
import { mapFromRange } from "../utils";

export default class {
  constructor(viewBox, levelSize) {
    this.screen = new Mesh();

    this.cpt = 0;
    this.mountains = new Array(4);
    for (let i = 0; i < this.mountains.length; i += 1) {
      this.mountains[i] = new Mesh();
    }
    this.clouds = new Array(4);
    this.cloudData = [];

    this.viewBox = viewBox;
    this.levelSize = levelSize;
    for (let i = 0; i < this.clouds.length; i += 1) {
      this.clouds[i] = new Mesh();
      this.cloudData[i] = this.setCloud();
    }
  }

  update(pos) {
    this.updateMountains(pos);
    this.updateClouds(pos);
  }

  updateScreens(z) {
    this.screen.update();
    this.screen.setScale(20, 10, 0);
    this.screen.setTranslate(0, 10, z);
  }

  updateMountains(pos) {
    this.mountains.forEach((mesh, idx) => {
      const inverseIdx = this.mountains.length - idx;
      const scale = mapFromRange(idx, 0, this.mountains.length, 4, 40);
      const x = mapFromRange(
        pos[0],
        0,
        this.levelSize.w,
        this.viewBox.w + inverseIdx * 10,
        -inverseIdx * 10
      );
      const y = 10 + scale / 2;
      const color = mapFromRange(idx, 0, this.mountains.length, 255, 100);
      const z = mapFromRange(idx, 0, this.mountains.length, -2, -20);

      mesh.update();
      mesh.setScale(scale, scale, scale);
      mesh.setRotate(45, 0, 0, 1);
      mesh.setTranslate(x, y, z);
      mesh.setColor(color, color, color, 1);
    });
  }

  updateClouds() {
    this.clouds.forEach((mesh, idx) => {
      const { scale } = this.cloudData[idx];
      if (this.cloudData[idx].x < -scale) {
        this.cloudData[idx] = this.setCloud(this.viewBox.w + scale);
      } else {
        this.cloudData[idx].x -= this.cloudData[idx].speed;
      }
      mesh.update();
      mesh.setScale(scale, scale, scale);
      mesh.setRotate(45, 0, 0, 1);
      mesh.setTranslate(
        this.cloudData[idx].x,
        this.cloudData[idx].y,
        this.cloudData[idx].z
      );
      mesh.setColor(255, 255, 255, 0.4);
    });
  }

  renderScreen(objet, program, herosX, speed) {
    program.setFloat("offset", herosX * speed);
    this.screen.render(objet, program);
  }

  renderMountains(objet, program) {
    this.mountains.forEach((mesh) => mesh.render(objet, program));
  }

  renderCloudsFront(objet, program) {
    this.clouds.forEach((mesh, idx) => {
      if (this.cloudData[idx].z > 0) {
        mesh.render(objet, program);
      }
    });
  }

  renderCloudsBack(objet, program) {
    this.clouds.forEach((mesh, idx) => {
      if (this.cloudData[idx].z < 0) {
        mesh.render(objet, program);
      }
    });
  }

  setCloud(x) {
    return {
      x: x || Math.random() * 10,
      y: mapFromRange(Math.random(), 0, 1, 0, this.levelSize.h),
      z: mapFromRange(Math.random(), 0, 1, -4, 2) * 10,
      scale: 1 + Math.random() * 2,
      speed: 0.1 + Math.random() * 0.1,
    };
  }
}
