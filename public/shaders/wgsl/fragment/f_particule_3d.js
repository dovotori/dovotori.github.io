export default `
struct Uniform {
  eye: vec4f,
  viewProjection: mat4x4<f32>,
};

struct FragOutput {
  @location(0) color: vec4f,
  @location(1) normal: vec4f,
  @location(2) depth: vec4f,
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
) -> FragOutput {
 // reflect
    var norm = normalize(worldNormal);
    var eyeToSurfaceDir = normalize(worldPosition - uni.eye.xyz);
    var direction = reflect(eyeToSurfaceDir, norm);
    var tex = textureSample(ourTexture, ourSampler, direction * vec3f(1, 1, -1));

    // var tex = textureSample(ourTexture, ourSampler, fragUV);
    // var tex = textureSample(ourTexture, ourSampler, fragNormal);

    var out: FragOutput;
    out.color = tex;
    out.normal = vec4(fragNormal, 1.0);
    out.depth = vec4(vec3(fragPosition.z / fragPosition.w), 1.0); // linearize depth

    return out;

    // var specAverage = tex.r * 0.333 + tex.g * 0.333 + tex.b * 0.333;
    // tex = vec4<f32>(vec3<f32>(specAverage), 1.0);
    // var rgb = vec3<f32>(0.0, 0.0, 0.0);
    // return mix(vec4<f32>(rgb, 1.0), tex, 0.5);

    // return vec4<f32>(worldPosition, 1.0);
    // return vec4<f32>(worldNormal, 1.0);
    // return vec4<f32>(uni.eye.xyz, 1.0);
    // return vec4<f32>(fragUV, 0.0, 1.0);
}
`;
