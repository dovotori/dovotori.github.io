export default `
struct CameraUniform {
  projection: mat4x4<f32>,
  view: mat4x4<f32>,
};
@group(0) @binding(0)
var<uniform> camera: CameraUniform;

struct VertexInput {
  @location(0) position: vec3<f32>,
}

struct VertexOutput {
  @builtin(position) clip_position: vec4<f32>,
}

@vertex
fn v_main(
  model: VertexInput,
) -> VertexOutput {
  var out: VertexOutput;
  out.clip_position = camera.projection * camera.view * vec4<f32>(model.position, 1.0);
  return out;
}
`;
