export default `
struct FragInput {
  @location(0) color: vec3f,
};

@fragment
fn f_main(input: FragInput) -> @location(0) vec4f {
  return vec4f(input.color, 1);
}
`;
