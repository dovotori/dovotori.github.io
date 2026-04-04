export default `
struct VertexIn {
  @location(0) position: vec3f,
  @location(1) distance: f32,
};

struct Matrices {
  projection: mat4x4f,
  view: mat4x4f,
  model: mat4x4f,
};

@group(0) @binding(1) var<uniform> matrices: Matrices;

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) distance: f32,
};

@vertex
fn v_main(in: VertexIn) -> VertexOut {
  var out: VertexOut;
  out.position = matrices.projection * matrices.view * matrices.model * vec4f(in.position, 1.0);
  out.distance = in.distance;
  return out;
}
`;
