export default `
@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> direction: vec2<f32>; // (1,0)=horizontal, (0,1)=vertical
@group(0) @binding(3) var<uniform> texelSize: vec2<f32>;
@group(0) @binding(4) var<uniform> radius: f32;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  var pos = array<vec2<f32>, 3>(
    vec2f(-1.0, -1.0),
    vec2f(-1.0,  3.0),
    vec2f( 3.0, -1.0),
  );

  var uv = array<vec2<f32>, 3>(
    vec2<f32>(0.0, 1.0),
    vec2<f32>(0.0,  -1.0),
    vec2<f32>(2.0,  1.0),
  );

  var output: VertexOutput;
  output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  output.uv = uv[vertexIndex];
  return output;
}

@fragment
fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
  // Clamp radius to a reasonable integer range (e.g., 1 to 8)
  let r = clamp(i32(radius), 1, 8);

  // Precomputed weights for a 9-tap Gaussian kernel (for radius up to 4)
  let weights = array<f32, 9>(
    0.016216, 0.054054, 0.121622, 0.194594, 0.227027, 0.194594, 0.121622, 0.054054, 0.016216
  );
  let offsets = array<f32, 9>(
    -4.0, -3.0, -2.0, -1.0, 0.0, 1.0, 2.0, 3.0, 4.0
  );

  var color = vec4<f32>(0.0);
  var total = 0.0;

  // Center index for weights/offsets
  let center = 4;

  // Use only taps within the current radius
  for (var i = -r; i <= r; i = i + 1) {
    let idx = i + center;
    let offset = direction * offsets[idx] * texelSize;
    color = color + textureSample(myTexture, mySampler, uv + offset) * weights[idx];
    total = total + weights[idx];
  }

  return color / total;
  // return vec4<f32>(direction, 0.0, 1.0); // debug
}
`;
