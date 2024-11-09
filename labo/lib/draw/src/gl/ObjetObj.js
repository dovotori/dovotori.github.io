const DEFAULT_MAT = {
  ambiant: [0, 0, 0],
  diffuse: [0.5, 0.5, 0.5],
  specular: [1, 1, 1],
  emissive: [0, 0, 0],
  specDensity: [1],
  opacity: 1,
};

export default class {
  constructor(gl, obj, mat = null) {
    this.gl = gl;
    // gl.LINES // gl.TRIANGLES // gl.LINE_STRIP // gl.LINE_LOOP
    this.modeDessin = this.gl.TRIANGLES;
    // STATIC_DRAW -> change pas // DYNAMIC_DRAW -> repete // STREAM_DRAW -> une fois au moins
    this.modeCalcul = this.gl.STATIC_DRAW;

    this.materialProps = {};
    this.steps = this.getSteps(obj, mat); // position: 3 / normale: 3 / texture: 2, ambiant: 3 ...
    const points = this.getPoints(obj, mat);
    this.stride = 0;
    Object.entries(this.steps).forEach((step) => {
      if (step[1] !== null) this.stride += step[1];
    });

    this.vbo = this.gl.createBuffer();
    this.count = points.length / this.stride;

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(points),
      this.modeCalcul,
    );
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
  }

  enable(program) {
    this.gl.useProgram(program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);

    let decalage = 0;
    Object.entries(this.steps).forEach((entry) => {
      const [type, step] = entry;
      if (
        program.locations[type] !== undefined &&
        program.locations[type] !== -1
      ) {
        this.gl.enableVertexAttribArray(program.locations[type]);
        this.gl.vertexAttribPointer(
          program.locations[type],
          step,
          this.gl.FLOAT,
          false,
          this.stride * 4,
          decalage * 4,
        );
      }
      if (this.steps[type] !== null) decalage += this.steps[type];
    });
  }

  render(program) {
    this.enable(program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vbo);
    this.gl.drawArrays(this.modeDessin, 0, this.count);
    this.end();
  }

  end() {
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.useProgram(null);
  }

  setModeDessin(mode) {
    this.modeDessin = mode;
  }

  setModeCalcul(mode) {
    this.modeCalcul = mode;
  }

  getSteps(obj, mat = null) {
    const step = { position: 3 };
    if (obj.vt.indices.length > 0) {
      step.texture = 2;
    }
    if (obj.vn.indices.length > 0) {
      step.normale = 3;
    }
    if (mat && obj.mat) {
      Object.keys(obj.mat).forEach((index) => {
        const matName = obj.mat[index];
        const material = mat[matName];
        if (material) {
          Object.keys(material).forEach((type) => {
            if (this.materialProps[type] === undefined) {
              this.materialProps[type] = material[type].length;
            }
          });
        }
      });
    }
    return { ...step, ...this.materialProps };
  }

  getPoints(obj, mat = null) {
    const finalPoints = [];

    obj.v.indices.forEach((indice, indiceIdx) => {
      const vIdx = indice * 3;
      finalPoints.push(obj.v.points[vIdx]);
      finalPoints.push(obj.v.points[vIdx + 1]);
      finalPoints.push(obj.v.points[vIdx + 2]);

      if (obj.vt.indices.length > 0) {
        const vtIdx = obj.vt.indices[indiceIdx] * 2;
        finalPoints.push(obj.vt.points[vtIdx]);
        finalPoints.push(obj.vt.points[vtIdx + 1]);
      }

      if (obj.vn.indices.length > 0) {
        const vnIdx = obj.vn.indices[indiceIdx] * 3;
        finalPoints.push(obj.vn.points[vnIdx]);
        finalPoints.push(obj.vn.points[vnIdx + 1]);
        finalPoints.push(obj.vn.points[vnIdx + 2]);
      }

      if (mat && obj.mat) {
        const currentMatId = Object.keys(obj.mat).findIndex((limit, idx) => {
          const nextLimit = Object.keys(obj.mat)[idx + 1];
          return nextLimit ? indiceIdx >= limit && indiceIdx < nextLimit : true;
        });
        const currentMatName = obj.mat[Object.keys(obj.mat)[currentMatId]];
        Object.keys(this.materialProps).forEach((type) => {
          const values =
            (mat[currentMatName] && mat[currentMatName][type]) ||
            DEFAULT_MAT[type];
          values.forEach((value) => finalPoints.push(value));
        });
      }
    });
    return finalPoints;
  }
}
