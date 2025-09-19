import Camera from '../lib/webgl/cameras/Camera';
import Mat4 from '../lib/webgl/maths/Mat4.js';
import { CubeTexture } from '../lib/webgl/webgpu/CubeTexture.js';
import PipelineTextures from '../lib/webgl/webgpu/PipelineTextures.js';
import WebgpuScene from '../lib/webgl/webgpu/WebgpuScene.js';

const WORKGROUP_SIZE = 256; // 1 - 256 // depend on computer limitations
const NUM_WORKGROUPS = 10;
const NUM_PARTICLES = WORKGROUP_SIZE * NUM_WORKGROUPS;
const PARTICLE_SIZE = 40;
const SPEED = 10.0;

const computeShader = `@group(0) @binding(0) var<storage, read> input: array<f32, 7>; // [nbParticles, xMin, xMax, yMin, yMax, zMin, zMax]
@group(0) @binding(1) var<storage, read_write> velocity: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> model: array<mat4x4<f32>>;

// Generic rotation matrix from Euler angles (radians)
// Order: Z (roll), Y (yaw), X (pitch)
fn rotationXYZ(angles: vec3<f32>) -> mat4x4<f32> {
  let cx = cos(angles.x);
  let sx = sin(angles.x);
  let cy = cos(angles.y);
  let sy = sin(angles.y);
  let cz = cos(angles.z);
  let sz = sin(angles.z);

  let rotX = mat4x4<f32>(
    vec4<f32>(1.0, 0.0, 0.0, 0.0),
    vec4<f32>(0.0, cx, -sx, 0.0),
    vec4<f32>(0.0, sx, cx, 0.0),
    vec4<f32>(0.0, 0.0, 0.0, 1.0)
  );

  let rotY = mat4x4<f32>(
    vec4<f32>(cy, 0.0, sy, 0.0),
    vec4<f32>(0.0, 1.0, 0.0, 0.0),
    vec4<f32>(-sy, 0.0, cy, 0.0),
    vec4<f32>(0.0, 0.0, 0.0, 1.0)
  );

  let rotZ = mat4x4<f32>(
    vec4<f32>(cz, -sz, 0.0, 0.0),
    vec4<f32>(sz, cz, 0.0, 0.0),
    vec4<f32>(0.0, 0.0, 1.0, 0.0),
    vec4<f32>(0.0, 0.0, 0.0, 1.0)
  );

  // Combined rotation: rotZ * rotY * rotX
  return rotZ * rotY * rotX;
}

// Extracts Euler angles (YXZ order) from a 4x4 matrix
fn extractEulerYXZ(m: mat4x4<f32>) -> vec3<f32> {
    let m00 = m[0][0];
    let m01 = m[0][1];
    let m02 = m[0][2];
    let m10 = m[1][0];
    let m11 = m[1][1];
    let m12 = m[1][2];
    let m20 = m[2][0];
    let m21 = m[2][1];
    let m22 = m[2][2];

    var y = asin(clamp(-m02, -1.0, 1.0));
    var x: f32;
    var z: f32;

    if (abs(m02) < 0.99999) {
        x = atan2(m12, m22);
        z = atan2(m01, m00);
    } else {
        // Gimbal lock
        x = atan2(-m21, m11);
        z = 0.0;
    }
    return vec3<f32>(x, y, z);
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(
    @builtin(global_invocation_id) GlobalInvocationID : vec3<u32>
) {
    var index = GlobalInvocationID.x;
    if(index >= u32(input[0])){
      return;
    }

    var xMin = input[1];
    var xMax = input[2];
    var yMin = input[3];
    var yMax = input[4];
    var zMin = input[5];
    var zMax = input[6];
    var pos = model[index][3];
    var vel = velocity[index];
    
    // change x
    pos.x += vel.x;
    if(pos.x < xMin){
        pos.x = xMin;
        vel.x = -vel.x;
    }else if(pos.x > xMax){
        pos.x = xMax;
        vel.x = -vel.x;
    }
    
    // change y
    pos.y += vel.y;
    if(pos.y < yMin){
        pos.y = yMin;
        vel.y = -vel.y;
    } else if(pos.y > yMax){
        pos.y = yMax;
        vel.y = -vel.y;
    }
    
    // change z
    pos.z += vel.z;
    if(pos.z < zMin){
        pos.z = zMin;
        vel.z = -vel.z;
    }else if(pos.z > zMax){
        pos.z = zMax;
        vel.z = -vel.z;
    }
    
    // update velocity
    velocity[index] = vel;
    
    // update position in model matrix
    model[index][3] = pos;

    // Apply constant rotation around Y axis
    // let curRot = extractEulerYXZ(model[index]);
    let rotMat = rotationXYZ(vec3<f32>(pos[0] * 0.00001, pos[1] * 0.00002, pos[2] * 0.00005)); // rotate around X and Z too
    model[index] = model[index] * rotMat;
}`;

export default class Scene extends WebgpuScene {
  constructor(context, config) {
    super(context, config);

    const { width, height } = config.canvas;
    this.canvasSize = { width, height };

    this.camera = new Camera(config.camera);
    this.camera.perspective(width, height);

    this.model = new Mat4();

    this.textures = new PipelineTextures();
  }

  async setupAssets(assets) {
    const { programs } = await super.setupAssets(assets);

    const device = this.context.getDevice();

    this.textures.setup(device, this.context.getCanvasFormat(), this.canvasSize, 'depth24plus');

    const computeShaderModule = device.createShaderModule({
      code: computeShader,
      label: 'Compute Shader',
    });

    this.computePipeline = device.createComputePipeline({
      layout: 'auto',
      label: 'Compute Pipeline',
      compute: {
        module: computeShaderModule,
        entryPoint: 'main',
      },
    });

    /////////////////////////////////////////////

    const gltfPrimitive = Array.from(assets.gltfs.cube.get('meshes').get(0).primitives)[0];
    this.indexCount = gltfPrimitive.indexCount;

    // create vertex buffer
    this.vertexBuffer = device.createBuffer({
      label: 'GPUBuffer store vertex',
      size: gltfPrimitive.bufferVertex.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.vertexBuffer, 0, gltfPrimitive.bufferVertex);
    this.indexBuffer = device.createBuffer({
      label: 'GPUBuffer store index',
      size: gltfPrimitive.bufferIndex.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.indexBuffer, 0, gltfPrimitive.bufferIndex);

    const modelBuffer = device.createBuffer({
      label: 'GPUBuffer store MAX model matrix',
      size: Float32Array.BYTES_PER_ELEMENT * 4 * 4 * NUM_PARTICLES, // mat4x4 x float32 x MAX
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const velocityBuffer = device.createBuffer({
      label: 'GPUBuffer store MAX velocity',
      size: Float32Array.BYTES_PER_ELEMENT * 4 * NUM_PARTICLES, // 4 position x float32 x MAX
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    const inputBuffer = device.createBuffer({
      label: 'GPUBuffer store input vars',
      size: Float32Array.BYTES_PER_ELEMENT * 7, // float32 * 7
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });

    // setup once
    const uniformBufferSize = (4 + 4 * 4) * Float32Array.BYTES_PER_ELEMENT; // mat4 + vec4
    const uniformBuffer = device.createBuffer({
      label: 'uniforms',
      size: uniformBufferSize,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const uniformValues = new Float32Array(uniformBufferSize / 4);
    const array = [
      this.config.camera.position.x,
      this.config.camera.position.y,
      this.config.camera.position.z,
      0,
      ...this.camera.getViewProjection().get(),
    ];
    uniformValues.set(array);
    device.queue.writeBuffer(uniformBuffer, 0, uniformValues);

    this.model.identity();

    /////////////////////////////////////////////
    //////////// CUBE TEXTURES //////////////////
    /////////////////////////////////////////////

    // const faceSize = 128;
    // const faceCanvases = [
    //   { faceColor: '#F00', textColor: '#0FF', text: '+X' },
    //   { faceColor: '#FF0', textColor: '#00F', text: '-X' },
    //   { faceColor: '#0F0', textColor: '#F0F', text: '+Y' },
    //   { faceColor: '#0FF', textColor: '#F00', text: '-Y' },
    //   { faceColor: '#00F', textColor: '#FF0', text: '+Z' },
    //   { faceColor: '#F0F', textColor: '#0F0', text: '-Z' },
    // ].map((faceInfo) => generateFace(faceSize, faceInfo));
    const faceCanvases = [
      assets.textures['pos-x'],
      assets.textures['neg-x'],
      assets.textures['pos-y'],
      assets.textures['neg-y'],
      assets.textures['pos-z'],
      assets.textures['neg-z'],
    ];

    const cubeTexture = new CubeTexture(this.context);
    cubeTexture.createTextureFromSources(device, faceCanvases, {
      // mips: true,
      flipY: false,
    });
    // cubeTexture.createOne(device, faceCanvases);

    /////////////////////////////////////////////
    //////////////// DATA ///////////////////////
    /////////////////////////////////////////////

    const inputArray = new Float32Array([NUM_PARTICLES, -500, 500, -250, 250, -500, 500]); // count, xmin/max, ymin/max, zmin/max
    const modelArray = new Float32Array(NUM_PARTICLES * 4 * 4);
    const velocityArray = new Float32Array(NUM_PARTICLES * 4);
    for (let i = 0; i < NUM_PARTICLES; i++) {
      const x = Math.random() * 1000 - 500;
      const y = Math.random() * 500 - 250;
      const z = Math.random() * 1000 - 500;

      const modelMatrix = new Mat4();
      modelMatrix.identity();
      modelMatrix.scale((PARTICLE_SIZE / 2) * Math.random() + 10);
      modelMatrix.translate(x, y, z);
      modelArray.set(modelMatrix.get(), i * 4 * 4);

      velocityArray[i * 4 + 0] = (Math.random() - 0.5) * SPEED; // x
      velocityArray[i * 4 + 1] = (Math.random() - 0.5) * SPEED; // y
      velocityArray[i * 4 + 2] = (Math.random() - 0.5) * SPEED; // z
      velocityArray[i * 4 + 3] = 1; // w
    }
    device.queue.writeBuffer(velocityBuffer, 0, velocityArray);
    device.queue.writeBuffer(modelBuffer, 0, modelArray);
    device.queue.writeBuffer(inputBuffer, 0, inputArray);

    /////////////////////////////////////////////
    ////////////// RENDER PIPELINE //////////////
    /////////////////////////////////////////////

    this.renderPipeline = await device.createRenderPipelineAsync({
      label: 'Render Pipeline',
      layout: 'auto',
      vertex: {
        module: programs.v_particule_3d.get(),
        entryPoint: 'v_main',
        buffers: [
          {
            arrayStride: 8 * 4, // 3 position 2 uv,
            attributes: [
              {
                // position
                shaderLocation: 0,
                offset: 0,
                format: 'float32x3',
              },
              {
                // normal
                shaderLocation: 1,
                offset: 3 * 4,
                format: 'float32x3',
              },
              {
                // uv
                shaderLocation: 2,
                offset: 6 * 4,
                format: 'float32x2',
              },
            ],
          },
        ],
      },
      fragment: {
        module: programs.f_particule_3d.get(),
        entryPoint: 'f_main',
        targets: [
          {
            format: this.context.getCanvasFormat(),
          },
        ],
      },
      multisample: {
        count: 4,
      },
      primitive: {
        topology: 'triangle-list',
        // Culling backfaces pointing away from the camera
        cullMode: 'back',
      },
      // Enable depth testing since we have z-level positions
      // Fragment closest to the camera is rendered in front
      depthStencil: {
        depthWriteEnabled: true,
        depthCompare: 'less',
        format: this.textures.getDepthFormat(),
      },
    });

    // create a bindGroup for renderPass
    this.renderGroup = device.createBindGroup({
      label: 'Group for renderPass',
      layout: this.renderPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: modelBuffer,
          },
        },
        { binding: 1, resource: { buffer: uniformBuffer } },
        { binding: 2, resource: cubeTexture.getSampler(device) },
        { binding: 3, resource: cubeTexture.getView() },
      ],
    });

    // create bindGroup for computePass
    this.computeGroup = device.createBindGroup({
      label: 'Group for computePass',
      layout: this.computePipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: inputBuffer,
          },
        },
        {
          binding: 1,
          resource: {
            buffer: velocityBuffer,
          },
        },
        {
          binding: 2,
          resource: {
            buffer: modelBuffer,
          },
        },
      ],
    });

    this.computePassDescriptor = {
      label: 'Compute Pass description',
    };

    this.resize(this.canvasSize);
  }

  resize(size) {
    this.canvasSize = size;
    const device = this.context.getDevice();

    this.renderPassDescriptor = {
      colorAttachments: [
        {
          view: null,
          resolveTarget: this.context.getCurrentTexture().createView(),
          clearValue: { r: 0, g: 0, b: 0, a: 0 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
      depthStencilAttachment: {
        view: null,
        depthClearValue: 1.0,
        depthLoadOp: 'clear',
        depthStoreOp: 'store',
      },
    };

    this.textures.resize(device, this.context.getCanvasFormat(), size);
  }

  update() {
    super.update();

    this.model.identity();
    this.model.rotate(this.time, 0, 1, 0);
    this.model.multiply(this.camera.getViewProjection());

    // update render pass descriptor texture views
    const currentView = this.context.getCurrentTexture().createView();
    const renderTargetView = this.textures.getRenderTargetView();
    const depthTextureView = this.textures.getDepthTextureView();
    this.renderPassDescriptor.colorAttachments[0].resolveTarget = currentView;
    this.renderPassDescriptor.colorAttachments[0].view = renderTargetView;
    this.renderPassDescriptor.depthStencilAttachment.view = depthTextureView;
  }

  render() {
    super.render();

    const device = this.context.getDevice();

    const commandEncoder = device.createCommandEncoder();

    const computePass = commandEncoder.beginComputePass(this.computePassDescriptor);
    computePass.setPipeline(this.computePipeline);
    computePass.setBindGroup(0, this.computeGroup);
    computePass.dispatchWorkgroups(NUM_WORKGROUPS); // Math.ceil(NUM_PARTICLES / WORKGROUP_SIZE)
    computePass.end();

    const renderPass = commandEncoder.beginRenderPass(this.renderPassDescriptor);
    renderPass.setPipeline(this.renderPipeline);
    renderPass.setVertexBuffer(0, this.vertexBuffer);
    renderPass.setIndexBuffer(this.indexBuffer, 'uint16');
    renderPass.setBindGroup(0, this.renderGroup);
    renderPass.drawIndexed(this.indexCount, NUM_PARTICLES);

    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
  }

  destroy() {
    super.destroy();
  }
}
