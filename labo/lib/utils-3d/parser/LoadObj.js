export default class {
  constructor(source) {
    this.obj = {
      v: {
        indices: [],
        points: [],
      },
      vt: {
        indices: [],
        points: [],
      },
      vn: {
        indices: [],
        points: [],
      },
    };
    this.mat = {};
    this.faceCount = 0;
    this.readLines(source);
  }

  readLines(source) {
    const lines = source.split("\n");
    lines.forEach((line) => {
      const words = line.split(" ");
      const firstWord = words[0];
      switch (firstWord) {
        case "f":
          this.addFace(words.slice(1));
          break;
        case "v":
        case "vn":
        case "vt":
          this.addPoints(firstWord, words.slice(1));
          break;
        case "usemtl":
          this.addNewMaterial(words.slice(1)[0]);
          break;
        default:
          break;
      }
    });
  }

  addFace(words) {
    words.forEach(this.addFaceIndex);
    this.faceCount += 1;
  }

  addFaceIndex = (indexGroup) => {
    const indexes = indexGroup.split("/");
    if (indexes[0] && indexes[0] !== "") {
      this.obj.v.indices.push(parseInt(indexes[0], 10) - 1);
    }
    if (indexes[1] && indexes[1] !== "") {
      this.obj.vt.indices.push(parseInt(indexes[1], 10) - 1);
    }
    if (indexes[2] && indexes[2] !== "") {
      this.obj.vn.indices.push(parseInt(indexes[2], 10) - 1);
    }
  };

  addPoints(type, coor) {
    const finalCoor = type === "vt" && coor.length === 3 ? coor.slice(0, 2) : coor;
    finalCoor.forEach((c) => {
      this.obj[type].points.push(parseFloat(c, 10));
    });
  }

  addNewMaterial(name) {
    // { 0: "mat", 215: "mat" }
    this.mat[this.faceCount * 3] = name;
  }

  get() {
    return {
      ...this.obj,
      mat: this.mat,
    };
  }
}
