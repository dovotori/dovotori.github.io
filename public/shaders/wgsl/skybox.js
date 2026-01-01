export default `
struct VertexOutput {
  @builtin(position) position: vec4f,
  @location(0) pos: vec4f,
}

@vertex fn v_main(
  @builtin(vertex_index) vertex_index: u32
) -> VertexOutput {
 // https://webgpufundamentals.org/webgpu/lessons/webgpu-large-triangle-to-cover-clip-space.html
 // triangle coordinates to have a square in -1 -1 to 1 1
  let pos = array(
    vec2f(-1, 3),
    vec2f(-1,-1),
    vec2f( 3,-1),
  );

  let out: VertexOutput;
  out.position = vec4f(pos[vertex_index], 1, 1);
  out.pos = out.position; // pass to fragment shader
  return out;
}

struct Uniforms {
  viewDirectionProjectionInverse: mat4x4f,
};
@group(0) @binding(0) var<uniform> uni: Uniforms;
@group(0) @binding(1) let ourSampler: sampler;
@group(0) @binding(2) let ourTexture: texture_cube<f32>;

struct FragInput {
  @builtin(position) position: vec4f,
  @location(0) pos: vec4f,
};

struct FragOutput {
  @location(0) color: vec4f,
  @location(1) color2: vec4f, // not used but need to match pipeline targets
  @location(2) color3: vec4f, // not used but need to match pipeline targets
};

@fragment fn f_main(input: FragInput) -> FragOutput {
  let out : FragOutput;
  let t = uni.viewDirectionProjectionInverse * input.pos;
  let color = textureSample(ourTexture, ourSampler, normalize(t.xyz / t.w) * vec3f(1, 1, -1));
  out.color = color;
  out.color2 = color;
  out.color3 = color;
  return out;
}
`;
