export default `
@group(0) @binding(0) var samplerTex: sampler;
@group(0) @binding(1) var colorTex: texture_2d<f32>;
@group(0) @binding(2) var normalTex: texture_2d<f32>;
@group(0) @binding(3) var depthTex: texture_depth_multisampled_2d;

struct VSOutput {
  @builtin(position) position: vec4f,
  @location(0) texcoord: vec2f,
};

@vertex fn v_main(
  @builtin(vertex_index) vertexIndex : u32,
) -> VSOutput {
  let pos = array(
    vec2f(-1.0, -1.0),
    vec2f(-1.0,  3.0),
    vec2f( 3.0, -1.0),
  );

  var vsOutput: VSOutput;
  let xy = pos[vertexIndex];
  vsOutput.position = vec4f(xy, 0.0, 1.0);
  vsOutput.texcoord = xy * vec2f(0.5, -0.5) + vec2f(0.5);
  return vsOutput;
}

fn read_depth_msaa(tex: texture_depth_multisampled_2d, p: vec2<i32>, samples: u32) -> f32 {
  var acc = 0.0;
  for (var i = 0u; i < samples; i = i + 1u) {
    acc += textureLoad(tex, p, i);
  }
  return acc / max(1.0, f32(samples));
}

@fragment fn f_main(fsInput: VSOutput) -> @location(0) vec4f {
  let uv = fsInput.texcoord;
  let color = textureSample(colorTex, samplerTex, uv);

  let dimsU = textureDimensions(depthTex);
  let dims = vec2<f32>(dimsU);
  let inv = 1.0 / dims;
  let px = vec2<i32>(uv * dims);
  let samples = textureNumSamples(depthTex);

  let centerDepth = read_depth_msaa(depthTex, px, samples);
  let centerNormalRaw = textureSample(normalTex, samplerTex, uv).xyz;
  let centerNormal = normalize(centerNormalRaw * 2.0 - vec3<f32>(1.0));

  let offsets = array<vec2<f32>, 8>(
    vec2<f32>( 1.0,  0.0),
    vec2<f32>(-1.0,  0.0),
    vec2<f32>( 0.0,  1.0),
    vec2<f32>( 0.0, -1.0),
    vec2<f32>( 1.0,  1.0),
    vec2<f32>(-1.0,  1.0),
    vec2<f32>( 1.0, -1.0),
    vec2<f32>(-1.0, -1.0),
  );

  let radiusPx = 2.0;
  let bias = 0.0015;
  let strength = 1.1;
  let blendAmount = 1.0;

  var occlusion = 0.0;
  for (var i = 0u; i < 8u; i = i + 1u) {
    let offset = offsets[i] * inv * radiusPx;
    let suv = clamp(uv + offset, vec2<f32>(0.0), vec2<f32>(1.0));
    let spx = vec2<i32>(suv * dims);

    let sampleDepth = read_depth_msaa(depthTex, spx, samples);
    let sampleNormalRaw = textureSample(normalTex, samplerTex, suv).xyz;
    let sampleNormal = normalize(sampleNormalRaw * 2.0 - vec3<f32>(1.0));

    let normalWeight = max(dot(centerNormal, sampleNormal), 0.0);
    let depthDelta = centerDepth - sampleDepth;
    let depthOcc = smoothstep(bias, bias * 4.0, depthDelta);

    occlusion += depthOcc * normalWeight;
  }

  let ao = clamp(1.0 - (occlusion / 8.0) * strength, 0.2, 1.0);
  let aoColor = color.rgb * ao;
  let finalColor = mix(color.rgb, aoColor, blendAmount);
  return vec4f(finalColor, color.a);
}
`;
