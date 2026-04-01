export default `
struct DashUniforms {
  color: vec4f,
  dash: vec4f, // x=dashSize, y=gapSize, z=offset
};

@group(0) @binding(0) var<uniform> uniforms: DashUniforms;

@fragment
fn f_main(@location(0) distance: f32) -> @location(0) vec4f {
  let cycle = max(0.0001, uniforms.dash.x + uniforms.dash.y);
  let localDistance = (distance + uniforms.dash.z) % cycle;

  if (localDistance > uniforms.dash.x) {
    discard;
  }

  return uniforms.color;
}
`;
