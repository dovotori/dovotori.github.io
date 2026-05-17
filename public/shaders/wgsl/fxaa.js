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

fn alphaMask(a: f32, cutoff: f32) -> f32 {
  return select(0.0, 1.0, a >= cutoff);
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

  let alphaCutoff = 0.45;
  let aM  = alphaMask(cM.a, alphaCutoff);
  let aN  = alphaMask(cN.a, alphaCutoff);
  let aS  = alphaMask(cS.a, alphaCutoff);
  let aW  = alphaMask(cW.a, alphaCutoff);
  let aE  = alphaMask(cE.a, alphaCutoff);
  let aNW = alphaMask(cNW.a, alphaCutoff);
  let aNE = alphaMask(cNE.a, alphaCutoff);
  let aSW = alphaMask(cSW.a, alphaCutoff);
  let aSE = alphaMask(cSE.a, alphaCutoff);

  // Premultiplied colours for alpha-aware luma.
  let pmM  = cM.rgb  * aM;
  let pmN  = cN.rgb  * aN;
  let pmS  = cS.rgb  * aS;
  let pmW  = cW.rgb  * aW;
  let pmE  = cE.rgb  * aE;
  let pmNW = cNW.rgb * aNW;
  let pmNE = cNE.rgb * aNE;
  let pmSW = cSW.rgb * aSW;
  let pmSE = cSE.rgb * aSE;

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
  let aMin = min(aM, min(min(min(aN, aS), min(aW, aE)),
                         min(min(aNW, aNE), min(aSW, aSE))));
  let aMax = max(aM, max(max(max(aN, aS), max(aW, aE)),
                         max(max(aNW, aNE), max(aSW, aSE))));
  let alphaEdge = aMax - aMin;

  // Build blur direction from Sobel gradient, boosted near alpha cutouts.
  var dir = vec2<f32>(-gy, gx);
  let dirReduce = max(
    (lumaNW + lumaNE + lumaSW + lumaSE) * (0.25 * (1.0 / 8.0)),
    1.0 / 128.0,
  );
  let rcpDirMin = 1.0 / (min(abs(dir.x), abs(dir.y)) + dirReduce);
  let alphaBoost = 1.0 + alphaEdge * 6.0;
  dir = clamp(dir * rcpDirMin * alphaBoost, vec2<f32>(-12.0), vec2<f32>(12.0)) * inv;

  // 8-tap gather along the edge direction in premultiplied space (4 near + 4 wide).
  let s0 = textureSample(myTexture, mySampler, uv + dir * (-3.0/8.0));
  let s1 = textureSample(myTexture, mySampler, uv + dir * (-1.0/8.0));
  let s2 = textureSample(myTexture, mySampler, uv + dir * ( 1.0/8.0));
  let s3 = textureSample(myTexture, mySampler, uv + dir * ( 3.0/8.0));
  let s4 = textureSample(myTexture, mySampler, uv + dir * (-7.0/8.0));
  let s5 = textureSample(myTexture, mySampler, uv + dir * (-5.0/8.0));
  let s6 = textureSample(myTexture, mySampler, uv + dir * ( 5.0/8.0));
  let s7 = textureSample(myTexture, mySampler, uv + dir * ( 7.0/8.0));

  let a0 = alphaMask(s0.a, alphaCutoff);
  let a1 = alphaMask(s1.a, alphaCutoff);
  let a2 = alphaMask(s2.a, alphaCutoff);
  let a3 = alphaMask(s3.a, alphaCutoff);
  let a4 = alphaMask(s4.a, alphaCutoff);
  let a5 = alphaMask(s5.a, alphaCutoff);
  let a6 = alphaMask(s6.a, alphaCutoff);
  let a7 = alphaMask(s7.a, alphaCutoff);

  // Near-tap average (inner 4).
  let pmA = 0.25 * (s0.rgb*a0 + s1.rgb*a1 + s2.rgb*a2 + s3.rgb*a3);
  let aA  = 0.25 * (a0 + a1 + a2 + a3);

  // Wide-tap average (all 8).
  let pmB = pmA * 0.5 + 0.125 * (
    s4.rgb*a4 + s5.rgb*a5 + s6.rgb*a6 + s7.rgb*a7
  );
  let aB = aA * 0.5 + 0.125 * (a4 + a5 + a6 + a7);

  // Fall back to near-tap if wide-tap overshoots luma range.
  let lumaB = luma(pmB);
  let useFallback = lumaB < lumaMin || lumaB > lumaMax;
  let finalPm = select(pmB, pmA, useFallback);
  let finalA  = select(aB,  aA,  useFallback);

  // Blend smoothly where alpha edges are strong; preserve original elsewhere.
  let edgeBlend = smoothstep(0.001, 0.08, alphaEdge);
  let lumaEdge  = smoothstep(0.0,  0.5,  lumaMax - lumaMin);
  let blendAmt  = clamp(max(edgeBlend, lumaEdge) * 1.35, 0.0, 1.0);
  let outPm = mix(pmM, finalPm, blendAmt);
  let outA  = mix(cM.a, finalA, blendAmt);

  let keep   = select(0.0, 1.0, cM.a > 0.0);
  let outRgb = safeUnpremul(outPm, outA) * keep;
  return vec4<f32>(outRgb, outA * keep);
}
`;
