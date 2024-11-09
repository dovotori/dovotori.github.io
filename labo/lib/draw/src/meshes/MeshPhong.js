import MeshNormalMatrix from "./MeshNormalMatrix";

export default class extends MeshNormalMatrix {
  constructor() {
    super();
    this.lightPos = null;
  }

  start(camera) {
    super.start(camera);
    this.setEyePos(camera);
  }

  setEyePos(camera) {
    this.program.setVector("posEye", camera.getPosition().get());
  }

  setProgramSpecifics(program) {
    program.setInt("selected", this.selected);
    program.setVector("ambiant", [0.5, 0, 0]);
    program.setVector("diffuse", [1, 0, 0]);
    program.setVector("specular", [1, 1, 1]);
    program.setFloat("brillance", 10);
    if (this.lightPos !== null) {
      program.setVector("posLum", this.lightPos.get());
    }
  }

  setLightPos(value) {
    this.lightPos = value;
  }
}
