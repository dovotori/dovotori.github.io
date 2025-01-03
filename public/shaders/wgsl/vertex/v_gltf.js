export default `
struct CameraUniform {
  projection: mat4x4<f32>,
  view: mat4x4<f32>,
  model: mat4x4<f32>,
  position: vec3<f32>,
};
@group(0) @binding(0)
var<uniform> camera: CameraUniform;
@group(0) @binding(1)
var<uniform> shadowProjection: mat4x4<f32>;

struct TransformUniform {
  model: mat4x4<f32>,
  normal_matrix: mat3x3<f32>,
};
@group(1) @binding(0)
var<uniform> transform: TransformUniform;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normale: vec3<f32>,
  @location(2) texture: vec2<f32>,
  // @location(3) tangent: vec4<f32>,
}

struct VertexOutput {
  @builtin(position) clip_position: vec4<f32>,
  @location(0) world_position: vec3f,
  @location(1) world_normal: vec3f,
  @location(2) texture: vec2f,
  @location(3) camera_position: vec3f,
  @location(4) shadow_pos: vec3<f32>,
}

@vertex
fn v_main(
  in: VertexInput,
) -> VertexOutput {
  var out: VertexOutput;
  var world_position: vec4<f32> = transform.model * vec4<f32>(in.position, 1.0);

  out.world_position = world_position.xyz;
  out.world_normal = normalize(transform.normal_matrix * in.normale); // normalize is important to have correct normal

  out.clip_position = camera.projection * camera.view * camera.model * world_position;
  out.texture = in.texture;
  out.camera_position = camera.position;

  var posFromLight: vec4<f32> = shadowProjection * camera.model * world_position;
  // Convert shadowPos XY to (0, 1) to fit texture UV
  out.shadow_pos = vec3<f32>(posFromLight.xy * vec2<f32>(0.5, -0.5) + vec2<f32>(0.5, 0.5), posFromLight.z);

  return out;
}
`;
