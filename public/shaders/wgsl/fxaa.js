export default `
@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var myTexture: texture_2d<f32>;

struct VertexOutput {
  @builtin(position) position: vec4<f32>,
  @location(0) uv: vec2<f32>,
};

@vertex
fn vs_main(@builtin(vertex_index) vertexIndex: u32) -> VertexOutput {
  let pos = array<vec2<f32>, 3>(
    vec2f(-1.0, -1.0),
    vec2f(-1.0,  3.0),
    vec2f( 3.0, -1.0),
  );

  let uv = array<vec2<f32>, 3>(
    vec2<f32>(0.0, 1.0),
    vec2<f32>(0.0, -1.0),
    vec2<f32>(2.0, 1.0),
  );

  var output: VertexOutput;
  output.position = vec4<f32>(pos[vertexIndex], 0.0, 1.0);
  output.uv = uv[vertexIndex];
  return output;
}

fn luma(c: vec3<f32>) -> f32 {
  return dot(c, vec3<f32>(0.299, 0.587, 0.114));
}

fn safeUnpremul(pm: vec3<f32>, a: f32) -> vec3<f32> {
  let denom = max(a, 0.0001);
  return pm / denom;
}

@fragment
fn fs_main(@location(0) uv: vec2<f32>) -> @location(0) vec4<f32> {
  let dims = vec2<f32>(textureDimensions(myTexture));
  let inv = 1.0 / dims;

  // Full 3x3 neighbourhood — 9 taps for accurate gradient direction.
  //   NW  N  NE
  //   W   M   E
  //   SW  S  SE
  let cM  = textureSample(myTexture, mySampler, uv);
  let cN  = textureSample(myTexture, mySampler, uv + vec2<f32>( 0.0, -1.0) * inv);
  let cS  = textureSample(myTexture, mySampler, uv + vec2<f32>( 0.0,  1.0) * inv);
  let cW  = textureSample(myTexture, mySampler, uv + vec2<f32>(-1.0,  0.0) * inv);
  let cE  = textureSample(myTexture, mySampler, uv + vec2<f32>( 1.0,  0.0) * inv);
  let cNW = textureSample(myTexture, mySampler, uv + vec2<f32>(-1.0, -1.0) * inv);
  let cNE = textureSample(myTexture, mySampler, uv + vec2<f32>( 1.0, -1.0) * inv);
  let cSW = textureSample(myTexture, mySampler, uv + vec2<f32>(-1.0,  1.0) * inv);
  let cSE = textureSample(myTexture, mySampler, uv + vec2<f32>( 1.0,  1.0) * inv);

  // Premultiplied colours for alpha-aware luma.
  let pmM  = cM.rgb  * cM.a;
  let pmN  = cN.rgb  * cN.a;
  let pmS  = cS.rgb  * cS.a;
  let pmW  = cW.rgb  * cW.a;
  let pmE  = cE.rgb  * cE.a;
  let pmNW = cNW.rgb * cNW.a;
  let pmNE = cNE.rgb * cNE.a;
  let pmSW = cSW.rgb * cSW.a;
  let pmSE = cSE.rgb * cSE.a;

  let lumaM  = luma(pmM);
  let lumaN  = luma(pmN);
  let lumaS  = luma(pmS);
  let lumaW  = luma(pmW);
  let lumaE  = luma(pmE);
  let lumaNW = luma(pmNW);
  let lumaNE = luma(pmNE);
  let lumaSW = luma(pmSW);
  let lumaSE = luma(pmSE);

  // Sobel gradient on full 3x3 for accurate edge direction.
  let gx = (lumaNE + 2.0*lumaE + lumaSE) - (lumaNW + 2.0*lumaW + lumaSW);
  let gy = (lumaSW + 2.0*lumaS + lumaSE) - (lumaNW + 2.0*lumaN + lumaNE);

  // Per-axis luma range for output clamp test.
  let lumaMin = min(lumaM, min(min(min(lumaN, lumaS), min(lumaW, lumaE)),
                              min(min(lumaNW, lumaNE), min(lumaSW, lumaSE))));
  let lumaMax = max(lumaM, max(max(max(lumaN, lumaS), max(lumaW, lumaE)),
                              max(max(lumaNW, lumaNE), max(lumaSW, lumaSE))));

  // Alpha edge strength from full 3x3.
  let aMin = min(cM.a, min(min(min(cN.a, cS.a), min(cW.a, cE.a)),
                           min(min(cNW.a, cNE.a), min(cSW.a, cSE.a))));
  let aMax = max(cM.a, max(max(max(cN.a, cS.a), max(cW.a, cE.a)),
                           max(max(cNW.a, cNE.a), max(cSW.a, cSE.a))));
  let alphaEdge = aMax - aMin;

  // Build blur direction from Sobel gradient, boosted near alpha cutouts.
  var dir = vec2<f32>(-gy, gx);
  let dirReduce = max(
    (lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * (1.0 / 8.0)),
    1.0 / 128.0,
  );
  let rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
  let alphaBoost = 1.0 + alphaEdge * 2.0;
  dir = clamp(dir * rcpDirMin * alphaBoost, vec2<f32>(-8.0), vec2<f32>(8.0)) * inv;

  // 8-tap gather along the edge direction in premultiplied space (4 near + 4 wide).
  let s0 = textureSample(myTexture, mySampler, uv + dir * (-3.0/8.0));
  let s1 = textureSample(myTexture, mySampler, uv + dir * (-1.0/8.0));
  let s2 = textureSample(myTexture, mySampler, uv + dir * ( 1.0/8.0));
  let s3 = textureSample(myTexture, mySampler, uv + dir * ( 3.0/8.0));
  let s4 = textureSample(myTexture, mySampler, uv + dir * (-7.0/8.0));
  let s5 = textureSample(myTexture, mySampler, uv + dir * (-5.0/8.0));
  let s6 = textureSample(myTexture, mySampler, uv + dir * ( 5.0/8.0));
  let s7 = textureSample(myTexture, mySampler, uv + dir * ( 7.0/8.0));

  // Near-tap average (inner 4).
  let pmA = 0.25 * (s0.rgb*s0.a + s1.rgb*s1.a + s2.rgb*s2.a + s3.rgb*s3.a);
  let aA  = 0.25 * (s0.a + s1.a + s2.a + s3.a);

  // Wide-tap average (all 8).
  let pmB = pmA * 0.5 + 0.125 * (
    s4.rgb*s4.a + s5.rgb*s5.a + s6.rgb*s6.a + s7.rgb*s7.a
  );
  let aB = aA * 0.5 + 0.125 * (s4.a + s5.a + s6.a + s7.a);

  // Fall back to near-tap if wide-tap overshoots luma range.
  let lumaB = luma(pmB);
  let useFallback = lumaB < lumaMin || lumaB > lumaMax;
  let finalPm = select(pmB, pmA, useFallback);
  let finalA  = select(aB,  aA,  useFallback);

  // Blend smoothly where alpha edges are strong; preserve original elsewhere.
  let edgeBlend = smoothstep(0.03, 0.25, alphaEdge);
  let lumaEdge  = smoothstep(0.0,  0.5,  lumaMax - lumaMin);
  let blendAmt  = max(edgeBlend, lumaEdge);
  let outPm = mix(pmM, finalPm, blendAmt);
  let outA  = mix(cM.a, finalA, blendAmt);

  let keep   = select(0.0, 1.0, cM.a > 0.0);
  let outRgb = safeUnpremul(outPm, outA) * keep;
  return vec4<f32>(outRgb, outA * keep);
}
`;
