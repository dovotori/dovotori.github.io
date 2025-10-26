const MAX_JOINT_MAT = 6;

export default `
struct CameraUniform {
  projection: mat4x4<f32>,
  view: mat4x4<f32>,
  model: mat4x4<f32>,
  position: vec3<f32>,
};
@group(0) @binding(0) var<uniform> camera: CameraUniform;


struct TransformUniform {
  model: mat4x4<f32>,
  normal_matrix: mat3x3<f32>,
};

@group(1) @binding(0) var<uniform> transform: TransformUniform;
@group(1) @binding(1) var<uniform> jointMat: array<mat4x4<f32>, ${MAX_JOINT_MAT}>;

struct VertexInput {
  @location(0) position: vec3<f32>,
  @location(1) normale: vec3<f32>,
  @location(2) texture: vec2<f32>,
  @location(4) joint: vec4<u32>,
  @location(5) weight: vec4<f32>,
  // @location(3) tangent: vec4<f32>,
  // @location(3) faceColor: f32,
}

struct VertexOutput {
  @builtin(position) clip_position: vec4<f32>,
  @location(0) world_position: vec3f,
  @location(1) world_normal: vec3f,
  @location(2) texture: vec2f,
  @location(3) camera_position: vec3f,
  // @location(6) face_color: f32,
}

@vertex fn v_main(
  in: VertexInput,
) -> VertexOutput {
  var skinMat: mat4x4<f32> =
    in.weight.x * jointMat[in.joint.x] +
    in.weight.y * jointMat[in.joint.y] +
    in.weight.z * jointMat[in.joint.z] +
    in.weight.w * jointMat[in.joint.w];

  var out: VertexOutput;
  var world_position: vec4<f32> = transform.model * skinMat * vec4<f32>(in.position, 1.0);

  out.world_position = world_position.xyz;
  out.world_normal = normalize(transform.normal_matrix * in.normale); // normalize is important to have correct normal

  out.clip_position = camera.projection * camera.view * camera.model * world_position;
  out.texture = in.texture;
  out.camera_position = camera.position;

  return out;
}
`;
