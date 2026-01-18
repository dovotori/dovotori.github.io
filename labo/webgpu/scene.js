import DualQuaternion from "../lib/utils/maths/DualQuaternion";
import { intersectRayWithPlane } from "../lib/utils/maths/intersection";
import Mat4 from "../lib/utils/maths/Mat4";
import Vec3 from "../lib/utils/maths/Vec3";
import Vec4 from "../lib/utils/maths/Vec4";
import { DebugTexture, GltfBindGroups, GltfPipeline, Picking, Shadow } from "../lib/webgpu";
import WebgpuSceneCamera from "../lib/webgpu/WebgpuSceneCamera";
// import { DebugPipeline } from '../lib/webgpu/DebugPipeline';
import { GltfDb } from "./GltfDb";

// to see the color change f_picking with alpha to 1
const DEBUG_PICKING = false;

export default class Scene extends WebgpuSceneCamera {
  constructor(context, config) {
    super(context, config);
    this.time = 0;
    const { width, height } = config.canvas;
    this.camera.perspective(width, height);

    this.canvasSize = { width, height };

    this.gltfPipeline = new GltfPipeline(context, config);
    this.picking = new Picking(context);
    this.shadow = new Shadow(context);
    this.debug = new DebugTexture(context);

    // this.debugCube = new DebugPipeline(context);
  }

  async setupAssets(assets) {
    const { programs } = await super.setupAssets(assets);
    const device = this.context.getDevice();

    const firstGltfName = Object.keys(assets.gltfs)[0];
    const gltf = assets.gltfs[firstGltfName];

    console.log({
      assets,
      config: this.config,
      gltf,
    });

    const program = {
      vertex: programs.v_gltf.get(),
      fragment: programs.f_gltf.get(),
    };

    // SHADOW
    await this.shadow.setup(
      {
        vertex: programs.v_shadow_depth.get(),
      },
      [this.gltfPipeline.getFirstBufferLayout()],
    );

    await this.gltfPipeline.setupDb(new GltfDb("gltf"));
    await this.gltfPipeline.setup(
      gltf,
      program,
      this.canvasSize,
      this.shadow.getShadowMapBindGroupEntries(device, this.lampe.getPosition()),
      DEBUG_PICKING,
    );
    this.cameraBuffers = this.setupCamera(
      this.gltfPipeline.getBindGroupLayout(GltfBindGroups.CAMERA),
      true,
    );

    this.uniformLights = this.setupLights(
      this.gltfPipeline.getBindGroupLayout(GltfBindGroups.LIGHT),
    );

    // PICKING
    await this.picking.setup(
      {
        vertex: programs.v_picking.get(),
        fragment: programs.f_picking.get(),
      },
      this.canvasSize,
      [this.gltfPipeline.getFirstBufferLayout()],
    );

    this.pickingUniformCamera = this.setupCamera(
      this.picking.getBindGroupLayout(GltfBindGroups.CAMERA),
    );

    this.picking.setTransformBindGroups(
      this.gltfPipeline.buildTransformBindGroups(
        this.picking.getBindGroupLayout(GltfBindGroups.TRANSFORM),
      ),
    );

    // need ortho, in the position of light
    this.shadowUniformCamera = this.setupCamera(
      this.shadow.getBindGroupLayout(GltfBindGroups.CAMERA),
    );

    this.shadow.setTransformBindGroups(
      this.gltfPipeline.buildTransformBindGroups(
        this.shadow.getBindGroupLayout(GltfBindGroups.TRANSFORM),
      ),
    );

    // DEBUG CUBE
    // await this.debugCube.setup({
    //   vertex: programs.v_model_camera.get(),
    //   fragment: programs.f_simple.get(),
    // });
    // this.debugUniformCamera = this.setupCamera(
    //   this.debugCube.getBindGroupLayout(GltfBindGroups.CAMERA),
    // );

    // const lampePos = this.lampe.getPositionVec3();
    // this.debugCube.setTransform(
    //   lampePos.getX(),
    //   lampePos.getY(),
    //   lampePos.getZ()
    // );

    // billboard mesh 20 node 44
    // this.debugCube.setTransform(
    //   -0.4425056576728821,
    //   1.8546216487884521,
    //   -0.8446273803710938,
    // );

    this.debug.setup(
      {
        vertex: programs.v_debug_tex.get(),
        fragment: programs.f_debug_tex.get(),
      },
      // this.canvasSize,
      this.shadow.getSize(),
    );
    // this.debug.setTexture(this.picking.getColorTexture());
    this.debug.setTexture(this.shadow.getDepthTexture());

    // await testHeavyCompute();
  }

  update(time) {
    // const view = this.camera.getView()
    // view.push()
    // view.rotate(time * 0.01, 0, 1, 0)
    // view.pop()

    this.model.identity();
    const quat = new DualQuaternion();
    quat.rotateY(time * 0.0001);
    // quat.rotateX(time * 0.001);
    this.model.multiply(quat.toMatrix4());

    this.gltfPipeline.updateAnimations(time);
  }

  // for shadow
  updateCameraUniformsWithLight(cameraBindBuffer) {
    const device = this.context.getDevice();

    const projection = this.lampe.getOrtho().get();
    const view = this.lampe.getView().get();
    const uniforms = new Float32Array(
      projection.concat(view, this.model.get(), this.lampe.getPosition()),
    );
    device.queue.writeBuffer(
      cameraBindBuffer,
      0,
      uniforms.buffer,
      uniforms.byteOffset,
      uniforms.byteLength,
    );
  }

  render() {
    const device = this.context.getDevice();

    this.gltfPipeline.update();

    this.renderShadowDepthPass();

    this.updateCameraUniforms(this.cameraBuffers);

    const encoder = device.createCommandEncoder({
      label: "GltfCommandEncoder",
    });
    const pass = encoder.beginRenderPass(this.gltfPipeline.getRenderPassDescriptor());

    pass.setPipeline(this.gltfPipeline.get());
    // bind group are defined in shader code ex: @group(0) @binding(0)
    pass.setBindGroup(GltfBindGroups.CAMERA, this.cameraBuffers.bindGroup);

    pass.setBindGroup(GltfBindGroups.LIGHT, this.uniformLights.bindGroup);

    this.gltfPipeline.drawModel(device, pass, DEBUG_PICKING);

    // this.updateCameraUniforms(this.debugUniformCamera.buffer);
    // this.debugCube.render(pass, this.debugUniformCamera.bindGroup);
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
      this.gltfPipeline.getAnimations(),
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
      this.gltfPipeline.getAnimations(),
    );
    const pickingColor = await this.picking.pick(
      e.pos,
      this.pickingUniformCamera.bindGroup,
      this.gltfPipeline.getDrawNodes(),
      this.gltfPipeline.getAnimations(),
    );

    const { positions, matrix } = await this.gltfPipeline.getByPickColor(pickingColor);

    const mousePosRel = {
      x: (e.pos.x / e.size.width) * 2 - 1,
      y: (e.pos.y / e.size.height) * 2 - 1,
    };

    const proj = this.camera.getProjection();
    const view = this.camera.getView();
    const invProjMat = new Mat4().setFromArray(proj.get()).inverse();
    const invViewMat = new Mat4().setFromArray(view.get()).inverse();

    const rayClip = new Vec4(mousePosRel.x, mousePosRel.y, -1, 1);
    const rayEye = rayClip.multiplyMatrix(invProjMat);
    rayEye.set(rayEye.getX(), rayEye.getY(), -1, 0);

    const rayWorld = rayEye.multiplyMatrix(invViewMat).normalise();

    // console.log({ node, mousePosRel, rayWorld });

    if (positions && matrix) {
      // let fMat = new Mat4().setFromArray(matrix.get()).multiply(this.model);
      // fMat.setFromArray(this.model.get()); //.multiply(matrix);
      const _pos = positions[0];

      const p1 = new Vec3(positions[1][0], positions[1][1], positions[1][2]);
      const p2 = new Vec3(positions[2][0], positions[2][1], positions[2][2]);
      const normal = new Vec3(positions[0][0], positions[0][1], positions[0][2]).computeNormal(
        p1,
        p2,
      );

      const _intersectionPoint = intersectRayWithPlane(
        this.camera.getPositionVec3(),
        new Vec3(rayWorld.getX(), rayWorld.getY(), rayWorld.getZ()),
        p1,
        normal,
      );
      // console.log({ pos, normal, intersectionPoint });
      // this.debugCube.setTransform(
      //   intersectionPoint.getX(),
      //   intersectionPoint.getY(),
      //   intersectionPoint.getZ(),
      // );
    }
  };
}

const sum10wgsl = `
@group(0) @binding(0) var<storage, read> data: array<f32>;
@group(0) @binding(1) var<storage, read_write> result: array<f32>;

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    let sum: f32 = 0;
    for (let i = index * 10; i < (index + 1) * 10; i++) {
        sum += data[i];
    }

    result[index] = sum;
}
`;

async function _testHeavyCompute() {
  const arrSize = 100000;
  let data = new Float32Array(Array.from({ length: arrSize }, () => Math.random()));

  // CPU to verify
  let startTime = performance.now();
  const checkData = data.reduce((previousValue, currentValue) => previousValue + currentValue);
  console.log("cpu result time", performance.now() - startTime, checkData);

  // GPU run
  startTime = performance.now();
  const webGPUComputer = await WebGPUComputer.init(sum10wgsl);
  while (data.length > 1) {
    const dataBuffer = webGPUComputer.createBuffer(
      data.byteLength,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    );
    webGPUComputer.writeToBuffer(dataBuffer, data);

    const resultBuffer = webGPUComputer.createBuffer(
      Math.ceil(data.length / 10) * 4,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    );
    const bindGroup = webGPUComputer.createBindGroup([dataBuffer, resultBuffer]);

    const readBuffer = webGPUComputer.createBuffer(
      Math.ceil(data.length / 10) * 4,
      GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    );

    webGPUComputer.run([bindGroup], resultBuffer, readBuffer, data.length / 10);

    await readBuffer.mapAsync(GPUMapMode.READ);
    data = new Float32Array(readBuffer.getMappedRange());
  }

  console.log("gpu result time", performance.now() - startTime, data);
}
