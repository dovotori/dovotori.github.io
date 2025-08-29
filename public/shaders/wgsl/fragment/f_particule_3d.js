export default `
@binding(1) @group(0) var ourSampler: sampler;
// @binding(2) @group(0) var ourTexture: texture_2d<f32>;
@binding(2) @group(0) var ourTexture: texture_cube<f32>;

@fragment
fn f_main(
    @location(0) fragUV: vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
    @location(2) fragNormal: vec3<f32>
) -> @location(0) vec4<f32> {
    // var tex = textureSample(ourTexture, ourSampler, fragUV);
    var tex = textureSample(ourTexture, ourSampler, fragNormal);
    return tex;
    // return vec4<f32>(fragNormal, 1.0);
    // return vec4<f32>(fragUV, 0.0, 1.0);
}
`;
