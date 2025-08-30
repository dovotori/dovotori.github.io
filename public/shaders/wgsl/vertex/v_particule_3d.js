export default `
struct Uniform {
  eye: vec4f,
  viewProjection: mat4x4<f32>,
};

struct VertexOutput {
    @builtin(position) Position : vec4<f32>,
    @location(0) fragUV : vec2<f32>,
    @location(1) fragPosition: vec4<f32>,
    @location(2) fragNormal: vec3<f32>,
    @location(3) worldPosition: vec3<f32>,
    @location(4) worldNormal: vec3<f32>
};

@binding(0) @group(0) var<storage, read> model : array<mat4x4<f32>>;
@binding(1) @group(0) var<uniform> uni: Uniform;

@vertex
fn v_main(
    @builtin(instance_index) index : u32,
    @location(0) position : vec4<f32>,
    @location(1) normal : vec3<f32>,
    @location(2) uv : vec2<f32>
) -> VertexOutput {
    var output : VertexOutput;
    output.Position = uni.viewProjection * model[index] * position;
    output.fragPosition = 0.5 * (position + vec4<f32>(1.0, 1.0, 1.0, 1.0));
    // output.fragNormal = normalize(position.xyz); // for cube map
    output.fragNormal = normalize(normal.xyz); // for cube map
    output.worldPosition = (model[index] * position).xyz;
    output.worldNormal = (model[index] * vec4f(normal, 0)).xyz;
    output.fragUV = uv;
    return output;
}`;
