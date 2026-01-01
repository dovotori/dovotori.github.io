export default class {
  constructor(gl, data) {
    this.gl = gl;
    if (data) {
      this.create(data);
    }
    this.extension = gl.getExtension("ANGLE_instanced_arrays");
  }

  create(data) {
    const {
      locationKey,
      type,
      values,
      count,
      componentType,
      size,
      modeCalcul,
      isInstancing = false,
    } = data;

    const bufferType = type !== "SCALAR" ? this.gl.ARRAY_BUFFER : this.gl.ELEMENT_ARRAY_BUFFER;
    this.vbo = this.gl.createBuffer();
    this.gl.bindBuffer(bufferType, this.vbo);
    this.gl.bufferData(bufferType, values, modeCalcul);
    this.gl.bindBuffer(bufferType, null);
    this.size = size;
    this.count = count;
    this.componentType = componentType;
    this.bufferType = bufferType;
    this.locationKey = locationKey;
    this.isInstancing = isInstancing;
  }

  enable(program) {
    const { locationKey, vbo, componentType, size, bufferType, isInstancing = false } = this;
    if (locationKey === "indices") {
      this.gl.bindBuffer(bufferType, vbo);
    } else {
      const location = program.locations[locationKey];
      if (location !== undefined && location !== -1) {
        this.gl.bindBuffer(bufferType, vbo);
        this.gl.enableVertexAttribArray(location);
        this.gl.vertexAttribPointer(location, size, componentType, false, 0, 0);
        if (isInstancing) {
          this.extension.vertexAttribDivisorANGLE(location, 1);
        }
      }
    }
  }

  start(program) {
    this.gl.useProgram(program);
  }

  end() {
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.useProgram(null);
  }

  update(data) {
    this.gl.bindBuffer(this.bufferType, this.vbo);
    this.gl.bufferSubData(this.bufferType, 0, new Float32Array(data));
    this.gl.bindBuffer(this.bufferType, null);
  }

  render(_program, modeDessin) {
    if (this.locationKey === "indices") {
      this.gl.drawElements(modeDessin, this.count, this.componentType, 0);
    } else {
      this.gl.drawArrays(modeDessin, 0, this.count);
    }
  }

  renderInstancing(_program, modeDessin, instanceCount) {
    // need draw buffers support
    if (this.locationKey === "indices") {
      this.extension.drawElementsInstancedANGLE(
        modeDessin,
        this.count,
        this.gl.UNSIGNED_SHORT,
        0,
        instanceCount,
      );
    } else {
      this.extension.drawArraysInstancedANGLE(
        modeDessin,
        0, // offset
        this.count, // num vertices per instance
        instanceCount, // num instances
      );
    }
  }

  getCount() {
    return this.count;
  }
}
