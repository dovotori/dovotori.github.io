export default `
// Percentage Closer Filtering (PCF) for smooth shadow transitions
fn pcfShadow(
  depthMapTexture: texture_depth_2d,
  depthMapSampler: sampler_comparison,
  shadowPos: vec3<f32>,
  bias: f32,
  sampleRadius: i32
) -> f32 {
  var shadow: f32 = 0.0;
  let size = f32(textureDimensions(depthMapTexture).x);
  let range = i32(ceil(f32(sampleRadius) / 2.0));
  
  for (var y: i32 = -range; y <= range; y = y + 1) {
    for (var x: i32 = -range; x <= range; x = x + 1) {
      let offset = vec2<f32>(f32(x) / size, f32(y) / size);
      shadow += textureSampleCompare(
        depthMapTexture,
        depthMapSampler,
        shadowPos.xy + offset,
        shadowPos.z - bias
      );
    }
  }
  
  let sampleCount = f32((range * 2 + 1) * (range * 2 + 1));
  return shadow / sampleCount;
}

// Simple Poisson disk sampling for better PCF distribution (reduces banding artifacts)
fn pcfShadowPoisson(
  depthMapTexture: texture_depth_2d,
  depthMapSampler: sampler_comparison,
  shadowPos: vec3<f32>,
  bias: f32
) -> f32 {
  var shadow: f32 = 0.0;
  let size = f32(textureDimensions(depthMapTexture).x);
  let texelSize = 1.0 / size;
  
  // Poisson disk pattern - 16 samples
  let poissonDisk = array(
    vec2(-0.94201624, -0.39906216),
    vec2(0.94558609, -0.76890725),
    vec2(-0.094184101, -0.92938870),
    vec2(0.34495938, 0.29387760),
    vec2(-0.91588581, 0.45771432),
    vec2(-0.70002182, 0.66666667),
    vec2(0.71735185, 0.96995504),
    vec2(-0.13399252, 0.58212221),
    vec2(0.10746987, -0.10954915),
    vec2(-0.13027789, -0.04625736),
    vec2(-0.35775623, -0.64541109),
    vec2(-0.11751663, -0.90477552),
    vec2(0.56143409, 0.29387760),
    vec2(-0.42262618, -0.05308550),
    vec2(0.96995504, -0.71735185),
    vec2(0.37459856, 0.58212221)
  );
  
  for (var i: i32 = 0; i < 16; i = i + 1) {
    let offset = poissonDisk[i] * texelSize * 2.0;
    shadow += textureSampleCompare(
      depthMapTexture,
      depthMapSampler,
      shadowPos.xy + offset,
      shadowPos.z - bias
    );
  }
  
  return shadow / 16.0;
}
`;
