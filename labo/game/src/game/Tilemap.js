import Tile from "./TileNormalMatrix";

class Tilemap {
  static setupContext(img) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0);
    return context;
  }

  constructor(img, config) {
    this.context = Tilemap.setupContext(img);
    this.levelSize = { w: img.width, h: img.height };
    const { viewBox } = config;
    this.viewBox = {
      x: 0,
      y: 0,
      w: viewBox.w || 20,
      h: viewBox.h || 20,
    };
    this.scrollBox = {
      w: this.viewBox.w / 2,
      h: this.viewBox.h / 2,
    };
    this.smoothTilePos = {
      x: 0,
      y: 0,
    }; // deplace legerement les tiles pour eviter un effet de saccade
    this.tile = new Tile(config.sprites);
    this.sprites = config.sprites;
    this.tileSize = config.tileSize;
    this.map = this.getData();
  }

  getData() {
    return this.context.getImageData(
      this.viewBox.x,
      this.viewBox.y,
      this.viewBox.w,
      this.viewBox.h,
    );
  }

  update(program) {
    this.tile.setNormalMatrix(program);
  }

  render(prog, tex, obj, flat) {
    for (let y = 0; y < this.map.height; y += 1) {
      for (let x = 0; x < this.map.width; x += 1) {
        const pixel = y * this.map.width + x;
        const r = this.map.data[pixel * 4];
        const g = this.map.data[pixel * 4 + 1];
        const b = this.map.data[pixel * 4 + 2];
        const state = `${r}${g}${b}`;
        this.tile.reset();
        if (this.sprites.colors[state]) {
          const translate = {
            x: x - this.smoothTilePos.x,
            y: y - this.smoothTilePos.y,
          };
          const { objType, pattern, scale, z } = this.sprites.colors[state];
          this.tile.setState(pattern);
          if (scale) {
            const { w, refSize } = this.tile.getState();
            this.tile.setScale(scale.x, scale.y, 1.0);
            const centerX = (w / refSize) * scale.x;
            this.tile.setTranslate(
              translate.x - (centerX - 1) * 0.5,
              translate.y - (1 - scale.y),
              z || 0,
            );
          } else {
            this.tile.setTranslate(translate.x, translate.y, z || 0);
          }
          this.tile.render(objType === 0 ? obj : flat, prog, tex);
        }
      }
    }
  }

  follow(pos) {
    let offsetX = pos[0] - this.scrollBox.w;
    if (offsetX < 0) offsetX = 0;
    if (offsetX > this.levelSize.w - this.viewBox.w)
      offsetX = this.levelSize.w - this.viewBox.w;

    let offsetY = pos[1] - this.scrollBox.h;
    if (offsetY < 0) offsetY = 0;
    if (offsetY > this.levelSize.h - this.viewBox.h)
      offsetY = this.levelSize.h - this.viewBox.h;

    if (this.viewBox.x !== offsetX || this.viewBox.y !== offsetY) {
      this.viewBox.x = offsetX;
      this.viewBox.y = offsetY;
      this.map = this.getData();
      this.smoothTilePos.x = offsetX - Math.floor(offsetX);
      this.smoothTilePos.y = offsetY - Math.floor(offsetY);
    }
  }

  getViewBox() {
    return this.viewBox;
  }

  getLevelSize() {
    return this.levelSize;
  }

  getTileSize() {
    return this.tileSize;
  }

  get() {
    return this.context;
  }

  getSmoothTilePos() {
    return this.smoothTilePos;
  }
}

export default Tilemap;
