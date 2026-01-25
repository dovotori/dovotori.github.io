export default `
struct CameraUniform {
  projection: mat4x4<f32>,
  view: mat4x4<f32>,
  model: mat4x4<f32>,
  position: vec3<f32>,
};

struct VertexUniforms {
  screenDimensions: vec2f,
  particleSize: f32,
  spacing: f32,
  mode: f32,
};

struct VertexOutput {
  @builtin(position) clip_position: vec4f,
  @location(0) color: vec4f
};

@group(0) @binding(0) var<uniform> vertex_uniforms: VertexUniforms;
@group(1) @binding(0) var<uniform> camera: CameraUniform;

@vertex
fn v_main(
  @location(0) vertex_position: vec2f,
  @location(1) color: vec4f,
  @location(2) position: vec3f,
  @location(3) rotation: f32
) -> VertexOutput {
  var out: VertexOutput;

  // TEST FOR 3D // Use the per-instance particle position and apply a small quad offset
  // // computed in screen-space (NDC) so the quad stays the right size on screen.
  // let pixelOffset = vertex_position * vertex_uniforms.particleSize;
  // let ndcOffset = vec2f(
  //     (pixelOffset.x / vertex_uniforms.screenDimensions.x) * 2.0,
  //     (pixelOffset.y / vertex_uniforms.screenDimensions.y) * -2.0
  // );

  // // Transform the particle world position to clip space
  // let scaledPos = position * 10.0;
  // var clip = camera.projection * camera.view * camera.model * vec4f(scaledPos, 1.0);

  // // Add the quad offset in clip-space (multiply by w to account for perspective)
  // let offset = ndcOffset * clip.w;
  // clip = vec4f(clip.x + offset.x, clip.y + offset.y, clip.z, clip.w);
  // out.clip_position = clip;




  if (vertex_uniforms.mode == 0.0 || vertex_uniforms.mode == 2.0) {
    // 2d particle billboard
    out.clip_position = vec4f(vertex_position * vertex_uniforms.particleSize / vertex_uniforms.screenDimensions + position.xy, position.z, 1.0);
  } else {
    // vertical line centered at particle "position.xy" with height = spacing/2
    // convert spacing (pixels) to NDC: spacing_pixels / screenHeight * 2 => simplifies to spacing / screenDimensions.y
    // shorten each line by half
    let lineHalfNDC = (vertex_uniforms.spacing / vertex_uniforms.screenDimensions.y) * 0.5;
    // give the vertical line a small visible width (1 pixel) in NDC
    let widthHalfNDC = 1.0 / vertex_uniforms.screenDimensions.x; // 1 pixel -> NDC half-width
    let offset = vec2f(vertex_position.x * widthHalfNDC, vertex_position.y * lineHalfNDC);

    // rotate around the base (anchor at bottom)
    let s = sin(rotation);
    let c = cos(rotation);
    // base point in local offset space (bottom of the vertical line)
    let base = vec2f(0.0, -lineHalfNDC);
    let local = offset - base;
    let rotatedLocal = vec2f(local.x * c - local.y * s, local.x * s + local.y * c);
    let rotated = rotatedLocal + base;
    out.clip_position = vec4f(position.xy + rotated, position.z, 1.0);
  }
    
  out.color = color;
  return out;
}`;
