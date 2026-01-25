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




  if (vertex_uniforms.mode == 0.0) {
    // 2d particle billboard
    out.clip_position = vec4f(vertex_position * vertex_uniforms.particleSize / vertex_uniforms.screenDimensions + position.xy, position.z, 1.0);
  } else if (vertex_uniforms.mode == 1.0) {
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
  } else {
    // 2d particle triangle oriented by 'rotation'.
    // Map quad vertex positions to triangle vertices so triangle-strip renders a single triangle:
    // vertex_position: (-1,-1) -> bottom-left, (1,-1) -> bottom-right, (-1,1) and (1,1) -> top-center (duplicate)
    // convert pixel half-size to NDC half-size: (pixels/viewport) * 2 * 0.5 => pixels / viewport
    let halfW = vertex_uniforms.particleSize / vertex_uniforms.screenDimensions.x;
    let halfH = vertex_uniforms.particleSize / vertex_uniforms.screenDimensions.y;
    var localOffset = vec2f(0.0, 0.0);
    if (vertex_position.x < 0.0 && vertex_position.y < 0.0) {
      // bottom-left (full width)
      localOffset = vec2f(-halfW, -halfH);
    } else if (vertex_position.x > 0.0 && vertex_position.y < 0.0) {
      // bottom-right noticeably narrower to emphasize direction
      localOffset = vec2f(halfW * 0.1, -halfH);
    } else {
      // top center (tip) smaller in Y to make triangle pointed
      localOffset = vec2f(0.0, halfH * 0.8);
    }
    // rotate offset so the triangle's tip points along the velocity angle.
    // rotation is atan2(vel.y, vel.x) (0 = +X). Our local triangle points up (+Y)
    // so rotate by (rotation - PI/2) to align the tip with the velocity direction.
    let rot = rotation - 1.57079632679;
    let s = sin(rot);
    let c = cos(rot);
    let rotated = vec2f(localOffset.x * c - localOffset.y * s, localOffset.x * s + localOffset.y * c);
    out.clip_position = vec4f(position.xy + rotated, position.z, 1.0);
  }
    
  out.color = color;
  return out;
}`;
