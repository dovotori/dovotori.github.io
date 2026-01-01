export default `
struct MaterialUniform {
  baseColorFactor: vec4f,
  emissiveFactor: vec3f,
  roughnessFactor: f32,
  metallicFactor: f32,
};

@group(2) @binding(0) var<uniform> material : MaterialUniform;
@group(2) @binding(1) let baseColorSampler: sampler;
@group(2) @binding(2) let baseColorTexture: texture_2d<f32>;

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
  @location(3) camera_position: vec3f,
  @location(4) debug_color: vec4f,
};

@fragment fn f_main(in: FragInput) -> @location(0) vec4f {
  let color = material.baseColorFactor;

  let baseColorTex = textureSample(baseColorTexture, baseColorSampler, in.texture);
  // if it is not the red 1 pixel texture we display the texture
  if (!all(baseColorTex == vec4(1.0, 0.0, 0.0, 1.0))) {
    color = baseColorTex;
  }

  let countLights = number_of_lights();

  let ambient_strength = 0.1;
  let view_dir = normalize(in.camera_position - in.world_position);
  
  let result: vec3<f32> = vec3(0., 0., 0.);

  for(let i: u32 = 0; i < countLights; i++) {
    let light = lights[i];
    let ambient_color = light.color * light.intensity;
    
    let light_dir = normalize(light.position - in.world_position);
    let half_dir = normalize(view_dir + light_dir);
    
    let diffuse_strength = max(dot(in.world_normal, light_dir), 0.0);
    let diffuse_color = light.color * diffuse_strength;

    let specular_strength = pow(max(dot(in.world_normal, half_dir), 0.0), 32.0);
    let specular_color = specular_strength * light.color;

    result += (ambient_color + diffuse_color + specular_color) * color.xyz;
  }

  result /= vec4(f32(countLights)).xyz;

  return vec4(result, 1.0);
  // return vec4(in.debug_color.xyz, 1.0);
}
`;
