import TextureFbo from "../textures/TextureFbo";
import TextureDepth from "../textures/TextureDepth";

export default class {
  constructor(
    gl,
    width = 1024,
    height = 1024,
    useDepth = false,
    extension = null,
    attachmentIdx = 0
  ) {
    this.gl = gl;
    this.buffer = this.gl.createFramebuffer();
    this.buffer.width = width;
    this.buffer.height = height;
    this.clearColor = [0, 0, 0, 0];

    this.setup(useDepth, extension, attachmentIdx);
  }

  setup(useDepth = false, extension = null, attachmentIdx = 0) {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.buffer);

    const attachement =
      extension !== null
        ? extension.COLOR_ATTACHMENT0_WEBGL + attachmentIdx
        : this.gl.COLOR_ATTACHMENT0;

    this.texture = new TextureFbo(
      this.gl,
      this.buffer.width,
      this.buffer.height
    );
    this.texture.setup();
    this.gl.framebufferTexture2D(
      this.gl.FRAMEBUFFER,
      attachement,
      this.gl.TEXTURE_2D,
      this.texture.get(),
      0
    );

    if (useDepth) {
      console.log("+++ ERROR LOAD DEPTH", useDepth, attachmentIdx);
      this.depthTexture = new TextureDepth(
        this.gl,
        this.buffer.width,
        this.buffer.height
      );
      this.depthTexture.setup();
      this.gl.framebufferTexture2D(
        this.gl.FRAMEBUFFER,
        this.gl.DEPTH_ATTACHMENT,
        this.gl.TEXTURE_2D,
        this.depthTexture.get(),
        0
      );
    }

    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }

  resize(box) {
    this.buffer.width = box.width;
    this.buffer.height = box.height;
    this.setup();
  }

  start() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.buffer);
    this.gl.viewport(0, 0, this.buffer.width, this.buffer.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  end() {
    this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
  }

  get() {
    return this.buffer;
  }

  getTexture() {
    return this.texture;
  }

  getDepthTexture() {
    return this.depthTexture;
  }

  setClearColor(r, v, b, a) {
    this.clearColor = [r, v, b, a];
  }
}
