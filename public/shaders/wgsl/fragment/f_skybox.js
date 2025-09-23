export default `
struct Uniforms {
  viewDirectionProjectionInverse: mat4x4f,
};
@group(0) @binding(0) var<uniform> uni: Uniforms;
@group(0) @binding(1) var ourSampler: sampler;
@group(0) @binding(2) var ourTexture: texture_cube<f32>;

struct FragInput {
  @builtin(position) position: vec4f,
  @location(0) pos: vec4f,
};

@fragment fn f_main(input: FragInput) -> @location(0) vec4f {
  let t = uni.viewDirectionProjectionInverse * input.pos;
  return textureSample(ourTexture, ourSampler, normalize(t.xyz / t.w) * vec3f(1, 1, -1));
}
`;
