export default `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) pos: vec4f,
}

@vertex fn v_main(
  @builtin(vertex_index) vertex_index: u32
) -> VertexOutput {
 // https://webgpufundamentals.org/webgpu/lessons/webgpu-large-triangle-to-cover-clip-space.html
 // triangle coordinates to have a square in -1 -1 to 1 1
  let pos = array(
    vec2f(-1, 3),
    vec2f(-1,-1),
    vec2f( 3,-1),
  );

  var out: VertexOutput;
  out.position = vec4f(pos[vertex_index], 1, 1);
  out.pos = out.position; // pass to fragment shader
  return out;
}
`;
