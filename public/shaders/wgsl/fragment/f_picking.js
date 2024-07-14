export default `
struct FragInput {
  @location(0) color_picking: vec4f,
};

@fragment
fn f_main(in: FragInput) -> @location(0) vec4f {
  // return in.color_picking;
  return vec4(in.color_picking.xyz, 1.0);
}
`;
