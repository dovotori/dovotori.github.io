import PerlinNoise from "../lib/utils/perlinNoise";

export const computeFlow = `
  // preserve per-particle rotation stored in velocities[index].w
  var rotation = velocities[index].w;

  // rotate clockwise by a small delta each dispatch
  let delta = 0.02; // radians per dispatch
  // compute time-varying noise contribution
  let PI = 3.141592653589793;
  let p2 = position.xy * 10.0 + vec2f(100.0, 100.0);
  let tnoise = fbm(p2 + vec2f(time * 0.2, time * 0.1));
  let noiseAmp = 0.2; // influence of noise on rotation
  rotation = rotation - delta + (tnoise - 0.5) * noiseAmp;
  // wrap around to keep in [-PI, PI]
  if (rotation < -PI) {
    rotation = rotation + 2.0 * PI;
  } else if (rotation > PI) {
    rotation = rotation - 2.0 * PI;
  }

  var direction = mass.position - position;

  newPosition = vec4(position, 1.0);
  newVelocity = vec4(velocity, rotation);
`;

export const wglsPerlinNoise = `
fn hash(p: vec2f) -> f32 {
  return fract(sin(dot(p, vec2f(127.1, 311.7))) * 43758.5453123);
}

fn noise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let a = hash(i);
  let b = hash(i + vec2f(1.0, 0.0));
  let c = hash(i + vec2f(0.0, 1.0));
  let d = hash(i + vec2f(1.0, 1.0));
  let u = f * f * (vec2f(3.0, 3.0) - 2.0 * f);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

fn fbm(p0: vec2f) -> f32 {
  var v = 0.0;
  var amp = 0.5;
  var p = p0;
  for (var i: u32 = 0u; i < 4u; i = i + 1u) {
    v = v + amp * noise(p);
    p = p * 2.0 + vec2f(5.2, 1.3);
    amp = amp * 0.5;
  }
  return v;
}
`;

export const buildFlowData = (particulesCount, canvasSize) => {
  const positionBufferData = new Float32Array(particulesCount * 4);
  const positionArrayStride = Float32Array.BYTES_PER_ELEMENT * 4;
  const velocityBufferData = new Float32Array(particulesCount * 4);
  const velocityArrayStride = Float32Array.BYTES_PER_ELEMENT * 4;
  const colorArrayStride = Uint8Array.BYTES_PER_ELEMENT * 4; // 4 bytes per color component
  const colorBufferData = new Uint8Array(4 * particulesCount);

  // Place particles on a 2D grid that fills the canvas.
  // Compute grid size (cols x rows) preserving canvas aspect ratio.
  const count = particulesCount;
  const canvasW = canvasSize.width || 1;
  const canvasH = canvasSize.height || 1;
  const aspect = canvasW / canvasH;
  const cols = Math.ceil(Math.sqrt(count * aspect));
  const rows = Math.ceil(count / cols);

  for (let idx = 0; idx < count; idx++) {
    const col = idx % cols;
    const row = Math.floor(idx / cols);

    // normalized [0..1] inside the grid cell, centered
    const u = (col + 0.5) / cols;
    const v = (row + 0.5) / rows;

    // convert to NDC space [-1..1], with +Y up
    const ndcX = u * 2 - 1;
    const ndcY = 1 - v * 2;

    const i = idx * 4;
    positionBufferData[i] = ndcX;
    positionBufferData[i + 1] = ndcY;
    positionBufferData[i + 2] = 0; // z
    positionBufferData[i + 3] = 1; // w
  }

  //  for (let i = 0; i < positionBufferData.length; i += 4) {
  //       positionBufferData[i] = Math.random() * 2 - 1;
  //       positionBufferData[i + 1] = Math.random() * 2 - 1;
  //       positionBufferData[i + 2] = Math.random() * 2 - 1;
  //       positionBufferData[i + 3] = 1;
  //  }

  // Use Perlin noise to compute a coherent initial rotation per-particle
  const noise = new PerlinNoise(64, false); // generated noise, size 64
  // frequency controls feature size; larger -> more variation
  const freq = 200 / Math.min(cols, rows);
  const rotationScale = 1.0; // 1.0 => full [-PI..PI]

  for (let idx = 0, i = 0; idx < particulesCount; idx += 1, i += 4) {
    // small random velocity for motion
    velocityBufferData[i] = Math.random() * 0.002 - 0.001;
    velocityBufferData[i + 1] = Math.random() * 0.002 - 0.001;
    velocityBufferData[i + 2] = Math.random() * 0.002 - 0.001;

    // compute grid coords used earlier
    const col = idx % cols;
    const row = Math.floor(idx / cols);

    // fractal (3-octave) noise
    let n = 0.0;
    let amp = 1.0;
    let f = freq;
    let totalAmp = 0.0;
    for (let o = 0; o < 3; o++) {
      // sample noise using normalized grid coords scaled by noise size
      const sx = (col / cols) * noise.size * f;
      const sy = (row / rows) * noise.size * f;
      n += noise.get(sx, sy) * amp;
      totalAmp += amp;
      amp *= 0.5;
      f *= 2.0;
    }
    n /= totalAmp; // normalize to [0..1]

    // map noise to angle in radians [-PI..PI]
    const angle = (n * 2.0 - 1.0) * Math.PI * rotationScale;

    // store a random rotation angle (radians) in the 4th component
    // velocityBufferData[i + 3] = 0;
    velocityBufferData[i + 3] = angle;
  }

  // COLORS

  for (let idx = 0, i = 0; idx < particulesCount; idx += 1, i += 4) {
    colorBufferData[i] = 0;
    // base random channels
    const baseG = Math.floor(Math.random() * 256);
    const baseB = Math.floor(Math.random() * 256);

    // sample coherent noise for this particle to vary color nuance
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const sx = (col / cols) * noise.size;
    const sy = (row / rows) * noise.size;
    const n = noise.get(sx, sy); // [0..1]

    // map noise to a small delta in [-30..30] and apply to G/B channels
    const delta = (n * 2 - 1) * 30;
    const g = Math.min(255, Math.max(0, Math.round(baseG + delta)));
    const b = Math.min(255, Math.max(0, Math.round(baseB + delta)));

    colorBufferData[i + 1] = g;
    colorBufferData[i + 2] = b;
    colorBufferData[i + 3] = 128;
  }

  return {
    positionBufferData,
    positionArrayStride,
    velocityBufferData,
    velocityArrayStride,
    colorBufferData,
    colorArrayStride,
  };
};
