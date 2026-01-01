import { WebGPUComputer } from "./gpuComputer";

const sum10wgsl = `
@group(0) @binding(0) var<storage, read> data: array<f32>;
@group(0) @binding(1) var<storage, read_write> result: array<f32>;

// global_id -> thread index
// workgroup_size -> number of threads
// global_invocation_id -> thread id in the group

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

const update1wgsl = `
@group(0) @binding(0) var<storage, read> data: array<f32>;
@group(0) @binding(1) var<storage, read_write> result: array<f32>;

// global_id -> thread index
// workgroup_size -> number of threads
// global_invocation_id -> thread id in the group

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) global_id: vec3<u32>) {
    let index = global_id.x;
    result[index] = data[global_id.x] + 1;
}
`;

export class Compute {
  constructor() {
    this.webGPUComputer = null;
    this.workerGroups = null; // threads
  }

  async init(arrSize = 100) {
    this.webGPUComputer = await WebGPUComputer.init(update1wgsl);

    const data = new Float32Array(Array.from({ length: arrSize }, () => Math.random()));

    this.dataBuffer = this.webGPUComputer.createBuffer(
      data.byteLength,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    );
    this.webGPUComputer.writeToBuffer(this.dataBuffer, data);

    this.workerGroups = data.length;

    this.resultBuffer = this.webGPUComputer.createBuffer(
      Math.ceil(this.workerGroups) * 4,
      GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_SRC,
    );
    this.bindGroup = this.webGPUComputer.createBindGroup([this.dataBuffer, this.resultBuffer]);

    // convert result to js
    this.readBuffer = this.webGPUComputer.createBuffer(
      Math.ceil(this.workerGroups) * 4,
      GPUBufferUsage.MAP_READ | GPUBufferUsage.COPY_DST,
    );
  }

  run() {
    const startTime = performance.now();
    this.webGPUComputer.run(
      [this.bindGroup],
      this.resultBuffer,
      this.readBuffer,
      this.workerGroups,
    );

    // const result = new Float32Array(this.readBuffer.getMappedRange());

    // readBuffer.mapAsync(GPUMapMode.READ);
    // this.webGPUComputer.writeToBuffer(this.dataBuffer, result);
    // this.readBuffer.unmap();

    console.log("gpu result time ms", performance.now() - startTime);
    // return result;
  }
}

export async function testHeavyCompute() {
  const arrSize = 100000;
  let data = new Float32Array(Array.from({ length: arrSize }, () => Math.random()));

  // GPU run
  // multiple pass to sum a big quantity of data
  const startTime = performance.now();
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

  console.log("gpu result time ms", performance.now() - startTime, data);
}
