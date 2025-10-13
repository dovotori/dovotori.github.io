class ManagerShaders {
  constructor() {
    this.shaders = {};
  }

  static getInfos(path) {
    const parts = path
      .substring(path.lastIndexOf("/") + 1, path.length)
      .split(".");
    return { name: parts[0], ext: parts[1].toLowerCase() };
  }

  get(paths) {
    const promesses = paths.map((path) => {
      let shader = {};
      const { name } = ManagerShaders.getInfos(path);
      try {
        shader = import(`Assets/shaders${path}`).then((js) => ({ name, js }));
      } catch (e) {
        console.error(e);
      }
      return shader;
    });
    return Promise.all(promesses).then((data) => {
      data.forEach(({ name, js }) => {
        this.shaders[name] = js.default;
      });
      return this.shaders;
    });
  }
}

export default ManagerShaders;
