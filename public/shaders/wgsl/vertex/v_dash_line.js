export default `
struct VertexIn {
  @location(0) position: vec2f,
  @location(1) distance: f32,
};

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) distance: f32,
};

@vertex
fn v_main(in: VertexIn) -> VertexOut {
  var out: VertexOut;
  out.position = vec4f(in.position, 0.0, 1.0);
  out.distance = in.distance;
  return out;
}
`;
