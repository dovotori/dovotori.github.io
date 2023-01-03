import ManagerShaders from "../../labo/lib/webgl/managers/ManagerShaders";
import ManagerAssets from "../../labo/lib/webgl/managers/ManagerAssets";
import { getEnvPath } from "../../labo/lib/webgl/utils";

self.onmessage = async (e) => {
  const { type, config, id } = e.data;
  let assets = {};

  switch (type) {
    case "setup": {
      if (config.assets) {
        const am = new ManagerAssets();
        assets = await am.get(config.assets.map((path) => getEnvPath(path)));
      }
      if (config.shaders) {
        const as = new ManagerShaders();
        assets.shaders = await as.get(config.shaders);
      }
      break;
    }
    default:
      break;
  }
  self.postMessage({ type, id, payload: { assets }, config });
};
