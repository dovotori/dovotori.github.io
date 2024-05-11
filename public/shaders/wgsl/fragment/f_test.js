export default `
struct FragInput {
  @location(0) cell: vec2f,
};

@fragment
fn f_main(input: FragInput) -> @location(0) vec4f {
  return vec4f(input.cell, 0, 1);
}
`
