export default `
struct CameraUniform {
  projection: mat4x4<f32>,
  view: mat4x4<f32>,
  model: mat4x4<f32>,
  position: vec3<f32>,
};

@group(0) @binding(0)
var<uniform> camera: CameraUniform;

struct TransformUniform {
  model: mat4x4<f32>,
  normal_matrix: mat3x3<f32>,
  color_picking: vec4<f32>,
};

@group(1) @binding(0)
var<uniform> transform: TransformUniform;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normale: vec3<f32>,
  @location(2) texture: vec2<f32>,
  @location(3) faceColor: f32,
}

struct VertexOutput {
  @builtin(position) clip_position: vec4<f32>,
  @location(0) color_picking: vec4f,
}

@vertex
fn v_main(
  in: VertexInput,
) -> VertexOutput {
  var out: VertexOutput;
  var world_position: vec4<f32> = transform.model * vec4<f32>(in.position, 1.0);

  out.color_picking = transform.color_picking;

  out.clip_position = camera.projection * camera.view * camera.model * world_position;

  return out;
}
`;
