export default `struct VertexUniforms {
    screenDimensions: vec2f,
    particleSize: f32
};

struct VertexOutput {
    @builtin(position) clipPosition: vec4f,
    @location(0) color: vec4f
};

@group(0) @binding(0) var<uniform> vertexUniforms: VertexUniforms;

@vertex
fn v_main(
    @location(0) vertexPosition: vec2f,
    @location(1) color: vec4f,
    @location(2) position: vec3f
) -> VertexOutput {
    let out: VertexOutput;
    out.clipPosition = vec4f(vertexPosition * vertexUniforms.particleSize / vertexUniforms.screenDimensions + position.xy, position.z, 1.0);
    out.color = color;

    return out;
}`;
