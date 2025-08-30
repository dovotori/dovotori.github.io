export default `
struct Uniform {
  eye: vec4f,
  viewProjection: mat4x4<f32>,
};

@binding(1) @group(0) var<uniform> uni: Uniform;
@binding(2) @group(0) var ourSampler: sampler;
// @binding(3) @group(0) var ourTexture: texture_2d<f32>;
@binding(3) @group(0) var ourTexture: texture_cube<f32>;

@fragment
fn f_main(
    @location(0) fragUV: vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
    @location(2) fragNormal: vec3<f32>,
    @location(3) worldPosition: vec3<f32>,
    @location(4) worldNormal: vec3<f32>
) -> @location(0) vec4<f32> {
 // reflect
    var norm = normalize(worldNormal);
    var eyeToSurfaceDir = normalize(worldPosition - uni.eye.xyz);
    var direction = reflect(eyeToSurfaceDir, norm);
    var tex = textureSample(ourTexture, ourSampler, direction);

    // var tex = textureSample(ourTexture, ourSampler, fragUV);
    // var tex = textureSample(ourTexture, ourSampler, fragNormal);
    return tex;

    // return vec4<f32>(worldPosition, 1.0);
    // return vec4<f32>(worldNormal, 1.0);
    // return vec4<f32>(uni.eye.xyz, 1.0);
    // return vec4<f32>(fragUV, 0.0, 1.0);
}
`;
