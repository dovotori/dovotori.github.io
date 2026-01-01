export default `
struct CameraUniform {
    projection: mat4x4<f32>,
    view: mat4x4<f32>,
};
@group(1) @binding(0) // 1.
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
    let out: VertexOutput;
    out.clip_position = camera.projection * camera.view * vec4<f32>(model.position, 1.0); // 2.
    return out;
}

@fragment
fn f_main() -> @location(0) vec4f {
  return vec4f(1, 0, 0, 1);
}
`;
