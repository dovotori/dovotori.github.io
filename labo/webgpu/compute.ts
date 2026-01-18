import { WebGPUComputer } from "../lib/webgpucompute";

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

export async function testHeavyCompute() {
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
