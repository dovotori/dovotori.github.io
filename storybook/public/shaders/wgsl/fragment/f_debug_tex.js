export default `
struct FragInput {
  @builtin(position) position: vec4f,
  @location(0) texcoord: vec2f,
};

@group(0) @binding(0) var ourSampler: sampler;
@group(0) @binding(1) var ourTexture: texture_2d<f32>;

@fragment fn f_main(in: FragInput) -> @location(0) vec4f {
  return textureSample(ourTexture, ourSampler, in.texcoord);
}
`;
