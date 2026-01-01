export default `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) texcoord: vec2f,
};

@vertex fn v_main(
  @builtin(vertex_index) vertexIndex : u32
) -> VertexOutput {
  let pos = array(
    // 1st triangle
    vec2f(0.0, 0.0),  // center
    vec2f(1.0, 0.0),  // right, center
    vec2f(0.0, 1.0),  // center, top

    // 2st triangle
    vec2f(0.0, 1.0),  // center, top
    vec2f(1.0, 0.0),  // right, center
    vec2f(1.0, 1.0),  // right, top
  );

  let out: VertexOutput;
  let xy = pos[vertexIndex];
  out.position = vec4f(xy, 0.0, 1.0);
  out.texcoord = xy;
  return out;
}
`;
