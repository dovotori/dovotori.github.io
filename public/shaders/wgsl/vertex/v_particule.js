export default `
struct CameraUniform {
  projection: mat4x4<f32>,
  view: mat4x4<f32>,
  model: mat4x4<f32>,
  position: vec3<f32>,
};

struct VertexUniforms {
    screenDimensions: vec2f,
    particleSize: f32
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
    @location(2) position: vec3f
) -> VertexOutput {
    var out: VertexOutput;

    // // Use the per-instance particle position and apply a small quad offset
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


    // 2d particle billboard
    out.clip_position = vec4f(vertex_position * vertex_uniforms.particleSize / vertex_uniforms.screenDimensions + position.xy, position.z, 1.0);

    out.color = color;

    return out;
}`;
