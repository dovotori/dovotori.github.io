export default `
struct FragOutput {
  @location(0) color: vec4f,
  @location(1) normal: vec4f,
  // @location(2) depth: vec4f,
};

@fragment
fn f_main(@location(0) color: vec4f) -> FragOutput {
  var out: FragOutput;
  out.color = vec4f(color.rgb * color.a, color.a);
  out.normal = vec4f(color.rgb * color.a, color.a);
  // out.depth = vec4f(color.rgb * color.a, color.a);
  return out;
} 
`;
