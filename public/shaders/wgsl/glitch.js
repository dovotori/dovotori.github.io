export default `
@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> time: f32;
@group(0) @binding(3) var<uniform> speed: f32; // 0 - 1 speed
@group(0) @binding(4) var<uniform> delta: f32; // 0 - 1 glitch amount

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  let pos = array<vec2<f32>, 3>(
    vec2f(-1.0, -1.0),
    vec2f(-1.0,  3.0),
    vec2f( 3.0, -1.0),
  );

  let uv = array<vec2<f32>, 3>(
    vec2<f32>(0.0, 1.0),
    vec2<f32>(0.0,  -1.0),
    vec2<f32>(2.0,  1.0),
  );

  var output: VertexOutput;
  output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  output.uv = uv[vertexIndex];
  return output;
}

// return 1 if v inside 1d range
fn insideRange(v: f32, bottom: f32, top: f32) -> f32 {
  return step(bottom, v) - step(top, v);
}

fn rand(n: vec2<f32>) -> f32 {
  return fract(sin(dot(n.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

fn randomRange(seed: vec2<f32>, min: f32, max: f32) -> f32 {
	return min + rand(seed) * (max - min);
}

@fragment
fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
  var t = floor(time * speed * 60.0);    
  var outCol = textureSample(myTexture, mySampler, uv);
    
  // randomly offset slices horizontally — limit to 5% of width scaled by delta
  var maxOffset = delta * 0.09;
  const LIMIT =  2.0;
  
  var sliceMask = 0.0;
  for (var i = 0.0; i < LIMIT; i += 1.0) {
    var sliceY = rand(vec2(t , 2345.0 + i));
    var sliceH = rand(vec2(t , 9035.0 + i)) * 0.12;
    var hOffset = randomRange(vec2(t , 9625.0 + i), -maxOffset, maxOffset);
    var uvOff = uv;
    uvOff.x += hOffset;
    // sample both original and offset unconditionally, then blend using a mask
    var sampleOff = textureSample(myTexture, mySampler, uvOff);
    // handle slice wrapping (prevent mask from becoming negative)
    var topRaw = sliceY + sliceH;
    var mask = 0.0;
    if (topRaw <= 1.0) {
      mask = insideRange(uv.y, sliceY, topRaw);
    } else {
      // slice wraps past 1.0: combine bottom..1.0 and 0.0..(topRaw-1.0)
      mask = insideRange(uv.y, sliceY, 1.0) + insideRange(uv.y, 0.0, topRaw - 1.0);
      mask = min(mask, 1.0);
    }
    outCol = outCol * (1.0 - mask) + sampleOff * mask;
    // accumulate mask so we know if this uv was inside any slice
    sliceMask = max(sliceMask, mask);
  }
    
  // do slight offset on one entire channel
  // stronger per-channel color separation applied only inside slices
  // ensure a visible minimum color offset and amplify it inside slices
  var baseColOffset = max(delta / 6.0, 0.03);
  var boostFactor = 8.0; // larger -> more separation inside slices
  var effectiveOffset = baseColOffset * (1.0 + sliceMask * (boostFactor - 1.0));

  // reduce vertical (Y) offset: scale down Y component and lower Y multipliers
  var yScale = 0.01;
  var colOffset = vec2(
    randomRange(vec2(t , 9545.0), -effectiveOffset, effectiveOffset),
    randomRange(vec2(t , 7205.0), -effectiveOffset * yScale, effectiveOffset * yScale)
  );

  // offset each channel in different directions for a visible RGB split
  var sampledR = textureSample(myTexture, mySampler, uv + colOffset * vec2(0.1, 0.06)).r;
  var sampledG = textureSample(myTexture, mySampler, uv + colOffset * vec2(-0.02, 0.05)).g;
  var sampledB = textureSample(myTexture, mySampler, uv + colOffset * vec2(0.015, -0.016)).b;

  outCol.r = outCol.r * (1.0 - sliceMask) + sampledR * sliceMask;
  outCol.g = outCol.g * (1.0 - sliceMask) + sampledG * sliceMask;
  outCol.b = outCol.b * (1.0 - sliceMask) + sampledB * sliceMask;
  return vec4<f32>(outCol);
}
`;
