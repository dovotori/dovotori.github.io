import Camera from '../lib/webgl/cameras/Camera';
import Mat4 from '../lib/webgl/maths/Mat4.js';
import { generateFace } from '../lib/webgl/utils/generateFace.js';
import { CubeTexture } from '../lib/webgl/webgpu/CubeTexture.js';
import PipelineTextures from '../lib/webgl/webgpu/PipelineTextures.js';
import WebgpuScene from '../lib/webgl/webgpu/WebgpuScene.js';
import * as box from './box';

const WORKGROUP_SIZE = 256; // 1 - 256 // depend on computer limitations
const NUM_WORKGROUPS = 10;
const NUM_PARTICLES = WORKGROUP_SIZE * NUM_WORKGROUPS;
const PARTICLE_SIZE = 40;

const computeShader = `@group(0) @binding(0) var<storage, read> input: array<f32, 7>;
@group(0) @binding(1) var<storage, read_write> velocity: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> modelView: array<mat4x4<f32>>;
@group(0) @binding(3) var<uniform> projection : mat4x4<f32>;
@group(0) @binding(4) var<storage, read_write> mvp : array<mat4x4<f32>>;

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
    var pos = modelView[index][3];
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
    
    // update position in modelView matrix
    modelView[index][3] = pos;
    
    // update mvp
    mvp[index] = projection * modelView[index];
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

    console.log(assets.gltfs.sphere);

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

    // create vertex buffer
    this.vertexBuffer = device.createBuffer({
      label: 'GPUBuffer store vertex',
      size: box.vertex.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.vertexBuffer, 0, box.vertex);
    this.indexBuffer = device.createBuffer({
      label: 'GPUBuffer store index',
      size: box.index.byteLength,
      usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
    });
    device.queue.writeBuffer(this.indexBuffer, 0, box.index);

    const modelBuffer = device.createBuffer({
      label: 'GPUBuffer store MAX model matrix',
      size: Float32Array.BYTES_PER_ELEMENT * 4 * 4 * NUM_PARTICLES, // mat4x4 x float32 x MAX
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    });
    this.projectionBuffer = device.createBuffer({
      label: 'GPUBuffer store camera projection',
      size: Float32Array.BYTES_PER_ELEMENT * 4 * 4, // mat4x4 x float32
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
    const mvpBuffer = device.createBuffer({
      label: 'GPUBuffer store MAX MVP',
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

    // setup camera once
    device.queue.writeBuffer(
      this.projectionBuffer,
      0,
      new Float32Array(this.camera.getViewProjection().get()),
    );

    this.model.identity();

    /////////////////////////////////////////////
    //////////// CUBE TEXTURES //////////////////
    /////////////////////////////////////////////

    const faceSize = 128;
    const faceCanvases = [
      { faceColor: '#F00', textColor: '#0FF', text: '+X' },
      { faceColor: '#FF0', textColor: '#00F', text: '-X' },
      { faceColor: '#0F0', textColor: '#F0F', text: '+Y' },
      { faceColor: '#0FF', textColor: '#F00', text: '-Y' },
      { faceColor: '#00F', textColor: '#FF0', text: '+Z' },
      { faceColor: '#F0F', textColor: '#0F0', text: '-Z' },
    ].map((faceInfo) => generateFace(faceSize, faceInfo));

    this.cubeTexture = new CubeTexture(this.context);
    this.cubeTexture.createTextureFromSources(device, faceCanvases, {
      // mips: true,
      flipY: false,
    });
    // this.cubeTexture.createOne(device, faceCanvases, 1);

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
      modelMatrix.scale(PARTICLE_SIZE);
      modelMatrix.translate(x, y, z);
      modelArray.set(modelMatrix.get(), i * 4 * 4);

      velocityArray[i * 4 + 0] = Math.random() - 0.5; // x
      velocityArray[i * 4 + 1] = Math.random() - 0.5; // y
      velocityArray[i * 4 + 2] = Math.random() - 0.5; // z
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
            buffer: mvpBuffer,
          },
        },
        { binding: 1, resource: this.cubeTexture.getSampler(device) },
        { binding: 2, resource: this.cubeTexture.getView() },
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
        {
          binding: 3,
          resource: {
            buffer: this.projectionBuffer,
          },
        },
        {
          binding: 4,
          resource: {
            buffer: mvpBuffer,
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

    const device = this.context.getDevice();
    device.queue.writeBuffer(this.projectionBuffer, 0, new Float32Array(this.model.get()));

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
    renderPass.drawIndexed(box.indexCount, NUM_PARTICLES);

    renderPass.end();

    device.queue.submit([commandEncoder.finish()]);
  }

  destroy() {
    super.destroy();
  }
}
