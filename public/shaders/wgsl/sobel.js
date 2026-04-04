export default `
@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;
@group(0) @binding(2) var depthMapTexture: texture_depth_multisampled_2d;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  let pos = array<vec2<f32>, 3>(
    vec2<f32>(-1.0, -1.0),
    vec2<f32>(-1.0,  3.0),
    vec2<f32>( 3.0, -1.0),
  );

  let uv = array<vec2<f32>, 3>(
    vec2<f32>(0.0, 1.0),
    vec2<f32>(0.0, -1.0),
    vec2<f32>(2.0, 1.0),
  );

  var output: VertexOutput;
  output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  output.uv = uv[vertexIndex];
  return output;
}

fn read_depth_msaa(tex: texture_depth_multisampled_2d, p: vec2<i32>, samples: u32) -> f32 {
  var acc = 0.0;
  for (var i = 0u; i < samples; i = i + 1u) {
    acc += textureLoad(tex, p, i);
  }
  return acc / max(1.0, f32(samples));
}

fn make_kernel_depth(
  tex: texture_depth_multisampled_2d,
  coord: vec2<f32>
) -> array<f32, 9> {
  let dims = textureDimensions(tex);
  let px = vec2<i32>(coord * vec2<f32>(dims));
  let sampleCount = textureNumSamples(tex);

  var n: array<f32, 9>;

  n[0] = read_depth_msaa(tex, px + vec2<i32>(-1, -1), sampleCount);
  n[1] = read_depth_msaa(tex, px + vec2<i32>( 0, -1), sampleCount);
  n[2] = read_depth_msaa(tex, px + vec2<i32>( 1, -1), sampleCount);
  n[3] = read_depth_msaa(tex, px + vec2<i32>(-1,  0), sampleCount);
  n[4] = read_depth_msaa(tex, px,                 sampleCount);
  n[5] = read_depth_msaa(tex, px + vec2<i32>( 1,  0), sampleCount);
  n[6] = read_depth_msaa(tex, px + vec2<i32>(-1,  1), sampleCount);
  n[7] = read_depth_msaa(tex, px + vec2<i32>( 0,  1), sampleCount);
  n[8] = read_depth_msaa(tex, px + vec2<i32>( 1,  1), sampleCount);

  return n;
}

@fragment
fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
  var color = textureSample(myTexture, mySampler, uv);

  var nd: array<f32, 9> = make_kernel_depth(depthMapTexture, uv);
  let sobel_h = nd[2] + 2.0 * nd[5] + nd[8] - nd[0] - 2.0 * nd[3] - nd[6];

  let sobel_v = nd[0] + 2.0 * nd[1] + nd[2] - nd[6] - 2.0 * nd[7] - nd[8];

  let sobel = sqrt(sobel_h * sobel_h + sobel_v * sobel_v);

  // var THICKNESS: f32 = 1.0;
  // let edge = 1.0 - clamp(sobel * 50.0, 0.0, 1.0); // scale is scene-dependent

  let thickness = 50.0;   // uniform
  let strength  = 1.0;
  let edge = 1.0 - clamp(sobel * thickness * strength, 0.0, 1.0);

  if (edge < 0.1) {
  color = vec4<f32>(vec3<f32>(edge), 1.0);
  }

  return color;

}
`;

// read texel coords from the sampled depth texture
// let dims: vec2<u32> = textureDimensions(depthMapTexture);
// let coordsF: vec2<f32> = vec2<f32>(uv.x * f32(dims.x), uv.y * f32(dims.y));
// let coordsI: vec2<i32> = vec2<i32>(i32(floor(coordsF.x)), i32(floor(coordsF.y)));
// let depthTexel: vec4<f32> = textureLoad(depthMapTexture, coordsI, 0);
// let depthVal: f32 = depthTexel.r;
// let depthCol: vec3<f32> = vec3<f32>(1.0 - depthVal, 1.0 - depthVal, 1.0 - depthVal);
// return vec4<f32>(depthCol, 1.0);
