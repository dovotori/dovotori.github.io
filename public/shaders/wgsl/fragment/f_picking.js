export default `
struct FragInput {
  @location(0) color_picking: vec4f,
};

@fragment
fn f_main(in: FragInput) -> @location(0) vec4f {
  // return vec4(in.color_picking.xyz, 1.0);
  // return vec4(0.0, in.color_picking.y * 1000, 0.0, 1.0);
  return in.color_picking;
}
`;
