// this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS); // Max Texture nb

// let distribTexIndex = 0;

export default class {
  constructor(gl, config) {
    this.gl = gl;
    this.program = this.gl.createProgram();
    this.setup(config);
  }

  // static resetTexIndex = () => {
  //   distribTexIndex = 0;
  // };

  setup(config) {
    this.creerShader('vertex', config.vertex);
    this.creerShader('fragment', config.fragment);
    this.gl.linkProgram(this.program);
    this.gl.useProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Erreur: ne peux pas lier le shader au program');
      this.gl.deleteProgram(this.program);
      return;
    }
    this.createLocations(config);
    this.gl.useProgram(null);
  }

  creerShader(type, source) {
    const shader = this.gl.createShader(
      type === 'vertex' ? this.gl.VERTEX_SHADER : this.gl.FRAGMENT_SHADER,
    );
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error(`Peux pas compiler ${type} shader: ${this.gl.getShaderInfoLog(shader)}`);
      this.gl.deleteShader(shader);
      return;
    }
    this.gl.attachShader(this.program, shader);
    this.gl.deleteShader(shader);
  }

  createLocations(config) {
    this.program.locations = {};
    config.uniforms.forEach((uniform) => {
      this.program.locations[uniform] = this.gl.getUniformLocation(this.program, uniform);
    });
    config.attributes.forEach((attribute) => {
      this.program.locations[attribute] = this.gl.getAttribLocation(this.program, attribute);
    });
  }

  setProjectionView(camera) {
    this.setMatrix('projection', camera.getProjection().get());
    this.setMatrix('view', camera.getView().get());
  }

  getLocation = (location) => this.program.locations[location] || null;

  setMatrix(location, matrix) {
    const loc = this.getLocation(location);
    if (loc !== null) {
      this.gl.useProgram(this.program);
      if (matrix.length === 16) {
        this.gl.uniformMatrix4fv(loc, false, matrix);
      } else {
        this.gl.uniformMatrix3fv(loc, false, matrix);
      }
      this.gl.useProgram(null);
    }
  }

  setInt(location, bool) {
    const loc = this.getLocation(location);
    if (loc !== null) {
      this.gl.useProgram(this.program);
      this.gl.uniform1i(loc, bool);
      this.gl.useProgram(null);
    }
  }

  setTexture(idx, texture, location) {
    const loc = this.getLocation(location);
    if (loc !== null) {
      this.gl.useProgram(this.program);
      this.gl.activeTexture(this.gl.TEXTURE0 + idx);
      this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
      this.gl.uniform1i(loc, idx);
      this.gl.useProgram(null);
      // distribTexIndex++;
    }
  }

  setFloat(location, value) {
    const loc = this.getLocation(location);
    if (loc !== null) {
      this.gl.useProgram(this.program);
      this.gl.uniform1f(loc, value);
      this.gl.useProgram(null);
    }
  }

  setVector(location, value) {
    const loc = this.getLocation(location);
    if (loc !== null) {
      this.gl.useProgram(this.program);
      switch (value.length) {
        case 3:
          this.gl.uniform3fv(loc, value);
          break;
        case 4:
          this.gl.uniform4fv(loc, value);
          break;
        case 2:
        default:
          this.gl.uniform2fv(loc, value);
          break;
      }
      this.gl.useProgram(null);
    }
  }

  enable() {
    this.gl.useProgram(this.program);
  }

  disable() {
    this.gl.useProgram(null);
  }

  get() {
    return this.program;
  }

  getLocations() {
    return this.program.locations;
  }
}
