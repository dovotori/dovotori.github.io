// this.gl.getParameter(this.gl.MAX_COMBINED_TEXTURE_IMAGE_UNITS); // Max Texture nb

export default class {
  constructor(gl, config) {
    this.gl = gl;
    this.program = this.gl.createProgram();
    this.setup(config);
  }

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
      type === 'vertex' ? this.gl.VERTEX_SHADER : this.gl.FRAGMENT_SHADER
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

  setMatrix(location, matrix) {
    this.gl.useProgram(this.program);
    if (matrix.length === 16) {
      this.gl.uniformMatrix4fv(this.program.locations[location], false, matrix);
    } else {
      this.gl.uniformMatrix3fv(this.program.locations[location], false, matrix);
    }
    this.gl.useProgram(null);
  }

  setInt(location, bool) {
    this.gl.useProgram(this.program);
    this.gl.uniform1i(this.program.locations[location], bool);
    this.gl.useProgram(null);
  }

  setTexture(idx, texture, location) {
    // console.log(
    //   idx,
    //   this.gl.getParameter(this.gl.ACTIVE_TEXTURE),
    //   this.gl.TEXTURE0 + idx
    // );
    this.gl.useProgram(this.program);
    this.gl.activeTexture(this.gl.TEXTURE0 + idx);
    this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
    this.gl.uniform1i(this.program.locations[location], idx);
    this.gl.useProgram(null);
  }

  setFloat(location, value) {
    this.gl.useProgram(this.program);
    this.gl.uniform1f(this.program.locations[location], value);
    this.gl.useProgram(null);
  }

  setVector(location, value) {
    this.gl.useProgram(this.program);
    switch (value.length) {
      default:
      case 2:
        this.gl.uniform2fv(this.program.locations[location], value);
        break;
      case 3:
        this.gl.uniform3fv(this.program.locations[location], value);
        break;
      case 4:
        this.gl.uniform4fv(this.program.locations[location], value);
        break;
    }
    this.gl.useProgram(null);
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
