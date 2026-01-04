export default `
@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;
@group(0) @binding(2) var<uniform> threshold: f32;
@group(0) @binding(3) var<uniform> uGlow_ThresholdKnee: f32;

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

@fragment
fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
  let color = textureSample(myTexture, mySampler, uv);
  let brightness = max(max(color.r, color.g), color.b);

  // Soft-knee threshold using smoothstep
  let bloomFactor = smoothstep(threshold - uGlow_ThresholdKnee, threshold + uGlow_ThresholdKnee, brightness);
  // return vec4<f32>(color.rgb * bloomFactor, color.a * bloomFactor);
  // return vec4<f32>(uGlow_ThresholdKnee,0.0,0.0,1.0); // debug

  if (brightness > 0.8) {
    return vec4<f32>(1.0, 1.0, 1.0, 1.0);
  } else {
    return vec4<f32>(0.0, 0.0, 0.0, 0.0);
  } 
}
`;
