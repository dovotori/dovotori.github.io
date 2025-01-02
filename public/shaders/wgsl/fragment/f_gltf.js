export default `
struct CameraUniform {
  projection: mat4x4<f32>,
  view: mat4x4<f32>,
  model: mat4x4<f32>,
  position: vec3<f32>,
};
@group(0) @binding(0)
var<uniform> camera: CameraUniform;

struct MaterialUniform {
  baseColorFactor: vec4f,
  emissiveFactor: vec3f,
  roughnessFactor: f32,
  metallicFactor: f32,
};

@group(2) @binding(0) var<uniform> material : MaterialUniform;
@group(2) @binding(1) var baseColorSampler: sampler;
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;

struct PointLight {
  position: vec3f, 
  color: vec3f, 
  intensity: f32,
};
@group(3) @binding(0) var<storage> lights: array<PointLight>;

fn number_of_lights() -> u32 {
  return arrayLength(&lights);
}

struct FragInput {
  @location(0) world_position: vec3f,
  @location(1) world_normal: vec3f,
  @location(2) texture: vec2f,
};

@fragment
fn f_main(in: FragInput) -> @location(0) vec4f {
  var color = material.baseColorFactor;
  var countLights = number_of_lights();

  let ambient_strength = 0.1;
  let view_dir = normalize(camera.position - in.world_position);
  
  var result: vec3<f32> = vec3(0., 0., 0.);

  for(var i: u32 = 0; i < countLights; i++) {
    let light = lights[i];
    let ambient_color = light.color * ambient_strength;
    let light_dir = normalize(light.position - in.world_position);
    let half_dir = normalize(view_dir + light_dir);
    
    let diffuse_strength = max(dot(in.world_normal, light_dir), 0.0);
    let diffuse_color = light.color * diffuse_strength;

    let specular_strength = pow(max(dot(in.world_normal, half_dir), 0.0), 32.0);
    let specular_color = specular_strength * light.color;

    result += (ambient_color + diffuse_color + specular_color) * color.xyz;
  }

  result /= vec4(f32(countLights)).xyz;

  // result = color.xyz;

  // result = textureSample(baseColorTexture, baseColorSampler, in.texture).xyz;
  // result = vec3(in.texture, 0.0);
  // result = in.world_normal;

  return vec4(result, 1.0);
}
`;
