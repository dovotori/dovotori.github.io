import LoadObj from "../parser/LoadObj";
import LoadMat from "../parser/LoadMat";
import LoadGltf from "../parser/LoadGltf";

class ManagerAssets {
  constructor() {
    this.assets = {
      textures: {},
      objets: {},
      materials: {},
      levels: {},
      gltfs: {},
      sounds: {}
    };
  }

  static getAssetInfo(path) {
    const parts = path
      .substring(path.lastIndexOf("/") + 1, path.length)
      .split(".");
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

  static load3dObj = (path, info) =>
    fetch(path)
      .then((response) => response.text())
      .then((response) => {
        const obj = new LoadObj(response);
        return { data: obj.get(), info };
      });

  static load3dGltf = (path, info) =>
    fetch(path)
      .then((response) => response.text())
      .then((response) => {
        const gltf = new LoadGltf(response);
        // console.log('+++ gtlf', gltf.get());
        return { data: gltf.get(), info };
      });

  static loadImage(path, info) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve({ data: img, info });
      img.onerror = reject;
      img.src = path;
    });
  }

  static loadSound(path, info) {
    return fetch(path)
      .then((response) => response.arrayBuffer())
      .then((response) => {
        return { data: response, info };
      });
  }

  async get(paths) {
    const promesses = await paths.map(async (path) => {
      const info = ManagerAssets.getAssetInfo(path);
      switch (info.ext) {
        case "jpg":
        case "jpeg":
        case "png":
        case "bmp":
          return ManagerAssets.loadImage(path, info);
        case "obj":
          return ManagerAssets.load3dObj(path, info);
        case "gltf":
          return ManagerAssets.load3dGltf(path, info);
        case "mtl":
          return ManagerAssets.loadMaterial(path, info);
        case "mp3":
          return ManagerAssets.loadSound(path, info);
        default:
          return null;
      }
    });
    return Promise.all(promesses).then((data) => {
      data.forEach((item) => {
        switch (item.info.ext) {
          case "jpg":
          case "jpeg":
          case "png":
            this.assets.textures[item.info.name] = item.data;
            break;
          case "bmp":
            this.assets.levels[item.info.name] = item.data;
            break;
          case "obj":
            this.assets.objets[item.info.name] = item.data;
            break;
          case "gltf":
            this.assets.gltfs[item.info.name] = item.data;
            break;
          case "mtl":
            this.assets.materials[item.info.name] = item.data;
            break;
          case "mp3":
            this.assets.sounds[item.info.name] = item.data;
            break;
          default:
            break;
        }
      });
      return this.assets;
    });
  }
}

export default ManagerAssets;

export const loadAssets = async (paths) => {
  const am = new ManagerAssets();
  const assets = await am.setup(paths);
  return assets;
};
