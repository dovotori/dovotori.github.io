import { LoadObj, LoadMat } from '../parser';

class ManagerAssets {
  constructor() {
    this.assets = {
      textures: {},
      objets: {},
      materials: {},
      levels: {},
    };
  }

  static getAssetInfo(path) {
    const parts = path
      .substring(path.lastIndexOf('/') + 1, path.length)
      .split('.');
    return { name: parts[0], ext: parts[1].toLowerCase() };
  }

  static loadMaterial(path, info) {
    return fetch(path)
      .then((response) => response.text())
      .then((response) => {
        const mat = new LoadMat(response);
        return { data: mat.get(), info };
      });
  }

  static loadImage(path, info) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ data: img, info });
      img.onerror = reject;
      img.src = path;
    });
  }

  async setup(paths) {
    const promesses = await paths.map(async (path) => {
      const info = ManagerAssets.getAssetInfo(path);
      switch (info.ext) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'bmp':
          return ManagerAssets.loadImage(path, info);
        case 'obj':
          return this.loadObjet(path, info);
        case 'mtl':
          return ManagerAssets.loadMaterial(path, info);
        default:
          return null;
      }
    });
    return Promise.all(promesses).then((data) => {
      data.forEach((item) => {
        switch (item.info.ext) {
          case 'jpg':
          case 'jpeg':
          case 'png':
            this.assets.textures[item.info.name] = item.data;
            break;
          case 'bmp':
            this.assets.levels[item.info.name] = item.data;
            break;
          case 'obj':
            this.assets.objets[item.info.name] = item.data;
            break;
          case 'mtl':
            this.assets.materials[item.info.name] = item.data;
            break;
          default:
            break;
        }
      });
      return this.assets;
    });
  }

  loadImg = (path) => new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = path;
  });

  loadObjet = (path, info) => fetch(path)
    .then((response) => response.text())
    .then((response) => {
      const obj = new LoadObj(response);
      return { data: obj.get(), info };
    });

  async getAssets(assets) {
    return assets.map(async (asset) => {
      const info = ManagerAssets.getAssetInfo(asset);
      switch (info.ext) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'bmp':
          return ManagerAssets.loadImage(asset, info);
        case 'obj':
          return this.loadObjet(asset, info);
        default: return null;
      }
    });
  }

  get() {
    return this.assets;
  }
}

export default ManagerAssets;

export const loadAssets = async (paths) => {
  const am = new ManagerAssets();
  const assets = await am.setup(paths);
  return assets;
};
