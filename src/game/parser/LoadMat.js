export default class {
  constructor(source) {
    this.materials = {};
    this.current = "";
    this.readLines(source);
  }

  readLines(source) {
    const lines = source.split("\n");
    lines.forEach((line) => {
      const words = line.split(" ");
      const firstWord = words[0];
      switch (firstWord) {
        case "newmtl":
          this.createMaterial(words.slice(1));
          break;
        case "Ns":
        case "Ka":
        case "Kd":
        case "Ks":
        case "Ke":
        case "Ni":
        case "d":
        case "illum":
          this.addInfoToMaterial(firstWord, words.slice(1));
          break;
        default:
          break;
      }
    });
  }

  createMaterial(name) {
    this.current = name;
    this.materials[this.current] = {};
  }

  addInfoToMaterial(name, value) {
    let overwriteName = "";
    switch (name) {
      case "Ka":
        overwriteName = "ambiant";
        break;
      case "Kd":
        overwriteName = "diffuse";
        break;
      case "Ks":
        overwriteName = "specular";
        break;
      case "Ke":
        overwriteName = "emissive";
        break;
      case "Ns":
        overwriteName = "specDensity";
        break;
      case "d":
        overwriteName = "opacity";
        break;
      default:
        break;
    }
    if (overwriteName !== "") {
      this.materials[this.current][overwriteName] = value.map((v) =>
        parseFloat(v, 10)
      );
    }
  }

  get() {
    return this.materials;
  }
}
