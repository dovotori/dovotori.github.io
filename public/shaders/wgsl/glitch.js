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
    
  // randomly offset slices horizontally
  var maxOffset = delta / 2.0;
  const LIMIT =  2.0;
  
  for (var i = 0.0; i < LIMIT; i += 1.0) {
    var sliceY = rand(vec2(t , 2345.0 + i));
    var sliceH = rand(vec2(t , 9035.0 + i)) * 0.25;
    var hOffset = randomRange(vec2(t , 9625.0 + i), -maxOffset, maxOffset);
    var uvOff = uv;
    uvOff.x += hOffset;
    // sample both original and offset unconditionally, then blend using a mask
    var sampleOff = textureSample(myTexture, mySampler, uvOff);
    var mask = insideRange(uv.y, sliceY, fract(sliceY + sliceH));
    outCol = outCol * (1.0 - mask) + sampleOff * mask;
  }
    
  // do slight offset on one entire channel
  var maxColOffset = delta / 6.0;
  var rnd = rand(vec2(t , 9545.0));
  var colOffset = vec2(randomRange(vec2(t , 9545.0), -maxColOffset,maxColOffset), randomRange(vec2(t , 7205.0), -maxColOffset,maxColOffset));
  if (rnd < 0.33) {
    outCol.r = textureSample(myTexture, mySampler, uv + colOffset).r;  
  } else if (rnd < 0.66){
    outCol.g = textureSample(myTexture, mySampler, uv + colOffset).g;  
  } else {
    outCol.b = textureSample(myTexture, mySampler, uv + colOffset).b;  
  }
  return vec4<f32>(outCol);
}
`;
