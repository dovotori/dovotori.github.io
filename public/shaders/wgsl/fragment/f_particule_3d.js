export default `
@binding(1) @group(0) var ourSampler: sampler;
@binding(2) @group(0) var ourTexture: texture_cube<f32>;

@fragment
fn f_main(
    @location(0) fragUV: vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
    @location(2) fragNormal: vec3<f32>
) -> @location(0) vec4<f32> {
    var tex = textureSample(ourTexture, ourSampler, vec3<f32>(fragUV, -1.0));
    return tex;
    // return fragPosition;
}
`;
