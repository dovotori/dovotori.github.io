import {
  Program,
  GltfPipeline,
  GltfBindGroups,
  Picking,
  Shadow,
  DebugTexture,
} from "../lib/draw/src/webgpu";
import Camera from "../lib/draw/src/cameras/Camera";
import Mat4 from "../lib/draw/src/maths/Mat4";
import DualQuaternion from "../lib/draw/src/maths/DualQuaternion";
import { DebugPipeline } from "../lib/draw/src/webgpu/DebugPipeline";
import { GltfDb } from "./GltfDb";
import Objectif from "../lib/draw/src/cameras/Objectif";

// to see the color change f_picking with alpha to 1
const DEBUG_PICKING = false;

class Scene {
  constructor(context, config) {
    this.context = context;
    this.config = config;
    this.time = 0;
    const { width, height } = this.config.canvas;
    this.camera = new Camera(config.camera);
    this.camera.perspective(width, height);

    this.canvasSize = { width, height };

    this.model = new Mat4();
    this.model.identity();

    this.gltfPipeline = new GltfPipeline(context, config);
    this.picking = new Picking(context);
    this.shadow = new Shadow(context);
    this.debug = new DebugTexture(context);

    this.lampe = new Objectif(config.lampes[0]);
    this.lampe.lookAt();

    this.debugCube = new DebugPipeline(context);
  }

  setup() {}

  // should create one for each pipeline
  setupCamera(layout, withLight) {
    const device = this.context.getDevice();

    const buffer = device.createBuffer({
      size: Float32Array.BYTES_PER_ELEMENT * (16 * 3 + 4), // 4x4 matrix view + projection + model + vec3,
      usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
    });

    const entries = [
      {
        binding: 0,
        resource: {
          buffer,
        },
      },
    ];

    let bufferLightProj;
    if (withLight) {
      bufferLightProj = device.createBuffer({
        label: "LightProjBuffer",
        size: Float32Array.BYTES_PER_ELEMENT * 16,
        usage: window.GPUBufferUsage.UNIFORM | window.GPUBufferUsage.COPY_DST,
      });

      entries.push({
        binding: 1,
        resource: {
          buffer: bufferLightProj,
        },
      });
    }

    const bindGroup = device.createBindGroup({
      label: "CameraUniforms",
      layout,
      entries,
    });

    return {
      buffer,
      bindGroup,
      bufferLightProj,
    };
  }

  setupLights(layout) {
    const device = this.context.getDevice();

    const size = Float32Array.BYTES_PER_ELEMENT * 8 * this.config.lampes.length; // vec3 * 2 + 1

    const buffer = device.createBuffer({
      size,
      usage: window.GPUBufferUsage.STORAGE | window.GPUBufferUsage.COPY_DST,
    });

    // because it didnt update, we set it directly here
    const array = [];
    this.config.lampes.forEach((lampe) => {
      array.push(lampe.position.x, lampe.position.x, lampe.position.z);
      array.push(...lampe.ambiant);
      array.push(lampe.strength);
    });

    const uniforms = new Float32Array(array);
    // direct setup
    device.queue.writeBuffer(
      buffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength
    );

    const bindGroup = device.createBindGroup({
      label: "LightsUniforms",
      layout,
      entries: [
        {
          binding: 0,
          resource: {
            buffer,
          },
        },
      ],
    });

    return {
      buffer,
      bindGroup,
    };
  }

  async setupAssets(assets) {
    const device = this.context.getDevice();

    const programs = Object.keys(assets.shaders).reduce((acc, cur) => {
      const shader = new Program();
      shader.setup(device, cur, assets.shaders[cur]);
      acc[cur] = shader;
      return acc;
    }, {});

    const firstGltfName = Object.keys(assets.gltfs)[0];
    const gltf = assets.gltfs[firstGltfName];

    console.log({
      assets,
      config: this.config,
      gltf,
    });

    const program = DEBUG_PICKING
      ? {
          vertex: programs.v_picking.get(),
          fragment: programs.f_picking.get(),
        }
      : {
          vertex: programs.v_gltf.get(),
          fragment: programs.f_gltf.get(),
        };

    // SHADOW
    await this.shadow.setup(
      {
        vertex: programs.v_shadow_depth.get(),
      },
      [this.gltfPipeline.getFirstBufferLayout()]
    );

    await this.gltfPipeline.setupDb(new GltfDb("gltf"));
    await this.gltfPipeline.setup(
      gltf,
      program,
      this.canvasSize,
      this.shadow.getShadowMapBindGroupEntries(
        device,
        this.lampe.getPosition()
      ),
      DEBUG_PICKING
    );

    this.uniformCamera = this.setupCamera(
      this.gltfPipeline.getBindGroupLayout(GltfBindGroups.CAMERA),
      true
    );

    if (!DEBUG_PICKING) {
      this.uniformLights = this.setupLights(
        this.gltfPipeline.getBindGroupLayout(GltfBindGroups.LIGHT)
      );
    }

    // PICKING
    await this.picking.setup(
      {
        vertex: programs.v_picking.get(),
        fragment: programs.f_picking.get(),
      },
      this.canvasSize,
      [this.gltfPipeline.getFirstBufferLayout()]
    );

    this.pickingUniformCamera = this.setupCamera(
      this.picking.getBindGroupLayout(GltfBindGroups.CAMERA)
    );

    this.picking.setTransformBindGroups(
      this.gltfPipeline.buildTransformBindGroups(
        this.picking.getBindGroupLayout(GltfBindGroups.TRANSFORM)
      )
    );

    // need ortho, in the position of light
    this.shadowUniformCamera = this.setupCamera(
      this.shadow.getBindGroupLayout(GltfBindGroups.CAMERA)
    );

    this.shadow.setTransformBindGroups(
      this.gltfPipeline.buildTransformBindGroups(
        this.shadow.getBindGroupLayout(GltfBindGroups.TRANSFORM)
      )
    );

    // DEBUG CUBE
    await this.debugCube.setup({
      vertex: programs.v_model_camera.get(),
      fragment: programs.f_simple.get(),
    });
    this.debugUniformCamera = this.setupCamera(
      this.debugCube.getBindGroupLayout(GltfBindGroups.CAMERA)
    );

    const lampePos = this.lampe.getPositionVec3();
    this.debugCube.setTransform(
      lampePos.getX(),
      lampePos.getY(),
      lampePos.getZ()
    );

    this.debug.setup(
      {
        vertex: programs.v_debug_tex.get(),
        fragment: programs.f_debug_tex.get(),
      },
      // this.canvasSize,
      this.shadow.getSize()
    );
    // this.debug.setTexture(this.picking.getColorTexture());
    this.debug.setTexture(this.shadow.getDepthTexture());
  }

  update(time) {
    // const view = this.camera.getView()
    // view.push()
    // view.rotate(time * 0.01, 0, 1, 0)
    // view.pop()

    this.model.identity();
    const quat = new DualQuaternion();
    quat.rotateY(time * 0.0001);
    // quat.rotateX(time * 0.001)
    this.model.multiply(quat.toMatrix4());

    this.gltfPipeline.updateAnimations(time);
  }

  updateCameraUniforms(cameraBuffer, lightProjBuffer) {
    const device = this.context.getDevice();

    const projection = this.camera.getModeProjection().get();
    const view = this.camera.getView().get();

    const uniforms = new Float32Array(16 * 3 + 3); // 16 elements for projection, 16 for view, 16 for model, 3 for camera position
    uniforms.set(projection, 0);
    uniforms.set(view, 16);
    uniforms.set(this.model.get(), 32);
    uniforms.set(this.camera.getPosition(), 48);

    device.queue.writeBuffer(
      cameraBuffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength
    );
    if (lightProjBuffer) {
      const newMat = new Mat4().setFromArray(this.lampe.getView().get()); // need a new one, multiply lampe ortho will directly mutate the matrix
      const uniformsLightProj = new Float32Array(16);
      uniformsLightProj.set(newMat.multiply(this.lampe.getOrtho()).get(), 0);
      device.queue.writeBuffer(
        lightProjBuffer,
        0, // offset
        uniformsLightProj.buffer,
        uniformsLightProj.byteOffset,
        uniformsLightProj.byteLength
      );
    }
  }

  // for shadow
  updateCameraUniformsWithLight(cameraBindBuffer) {
    const device = this.context.getDevice();

    const projection = this.lampe.getOrtho().get();
    const view = this.lampe.getView().get();
    const uniforms = new Float32Array(
      projection.concat(view, this.model.get(), this.lampe.getPosition())
    );
    device.queue.writeBuffer(
      cameraBindBuffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength
    );
  }

  // render() {
  //   this.updateCameraUniforms(this.pickingUniformCamera.buffer);
  //   this.picking.render(
  //     this.pickingUniformCamera.bindGroup,
  //     this.gltfPipeline.getNodes(),
  //     this.gltfPipeline.getAnimations()
  //   );
  // }

  render() {
    const device = this.context.getDevice();

    this.gltfPipeline.update();

    this.renderShadowDepthPass();

    this.updateCameraUniforms(
      this.uniformCamera.buffer,
      this.uniformCamera.bufferLightProj
    );

    const encoder = device.createCommandEncoder({
      label: "GltfCommandEncoder",
    });
    const pass = encoder.beginRenderPass(
      this.gltfPipeline.getRenderPassDescriptor()
    );

    pass.setPipeline(this.gltfPipeline.get());
    // bind group are defined in shader code ex: @group(0) @binding(0)
    pass.setBindGroup(GltfBindGroups.CAMERA, this.uniformCamera.bindGroup);

    if (!DEBUG_PICKING) {
      pass.setBindGroup(GltfBindGroups.LIGHT, this.uniformLights.bindGroup);
    }

    this.gltfPipeline.drawModel(device, pass, DEBUG_PICKING);

    this.updateCameraUniforms(this.debugUniformCamera.buffer);
    this.debugCube.render(pass, this.debugUniformCamera.bindGroup);
    // this.debug.render(pass);

    pass.end();

    // const commandBuffer = this.devide.getEncodeur().finish()
    // device.queue.submit([commandBuffer])
    // Finish the command buffer and immediately submit it.
    device.queue.submit([encoder.finish()]);
  }

  renderShadowDepthPass() {
    this.updateCameraUniformsWithLight(this.shadowUniformCamera.buffer);
    this.shadow.render(
      this.shadowUniformCamera.bindGroup,
      this.gltfPipeline.getDrawNodes(),
      this.gltfPipeline.getAnimations()
    );
  }

  resize(size) {
    this.canvasSize = size;
    this.gltfPipeline.resize(size);
    this.picking.resize(size);
  }

  onMouseClick = async (e) => {
    this.updateCameraUniforms(this.pickingUniformCamera.buffer);
    // TODO to fix the first call is late
    await this.picking.pick(
      e.pos,
      this.pickingUniformCamera.bindGroup,
      this.gltfPipeline.getDrawNodes(),
      this.gltfPipeline.getAnimations()
    );
    const pickingColor = await this.picking.pick(
      e.pos,
      this.pickingUniformCamera.bindGroup,
      this.gltfPipeline.getDrawNodes(),
      this.gltfPipeline.getAnimations()
    );

    const { node, pos, matrix } =
      await this.gltfPipeline.getByPickColor(pickingColor);
    console.log({ pickingColor, node, pos, matrix });
    if (pos && matrix) {
      const proj = this.camera.getProjection();
      const view = this.camera.getView();
      const model = this.model;
      let fMat = new Mat4();
      fMat.setFromArray(proj.get());
      fMat.multiply(view);
      fMat.multiply(model);
      fMat.multiply(matrix);
      pos.multiplyMatrix(fMat);
      this.debugCube.setTransform(pos.getX(), pos.getY(), pos.getZ());
    }
  };
}

export default Scene;
