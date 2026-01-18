export default `
struct MaterialUniform {
  baseColorFactor: vec4f,
  emissiveFactor: vec3f,
  roughnessFactor: f32,
  metallicFactor: f32,
};

@group(2) @binding(0) var<uniform> material : MaterialUniform;
@group(2) @binding(1) var baseColorSampler: sampler;
@group(2) @binding(2) var baseColorTexture: texture_2d<f32>;
@group(2) @binding(3) var<uniform> lightPos: vec3f;
@group(2) @binding(4) var depthMapSampler: sampler_comparison;
@group(2) @binding(5) var depthMapTexture: texture_depth_2d;

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
  @location(4) shadow_pos: vec3<f32>,
  @location(5) picking_color: vec4<f32>,
  // @location(6) face_color: f32,
};

struct FragOutput {
  @location(0) color: vec4f,
  @location(1) normal: vec4f,
  @location(2) depth: vec4f,
};

@fragment
fn f_main(in: FragInput) -> FragOutput {
  var color = material.baseColorFactor;

  let baseColorTex = textureSample(baseColorTexture, baseColorSampler, in.texture);
  // if it is not the red 1 pixel texture we display the texture
  if (!all(baseColorTex == vec4(1.0, 0.0, 0.0, 1.0))) {
    color = baseColorTex;
  }

  var countLights = number_of_lights();

  let ambient_strength = 0.1;
  let view_dir = normalize(in.camera_position - in.world_position);
  
  var result: vec3<f32> = vec3(0., 0., 0.);

  for(var i: u32 = 0; i < countLights; i++) {
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


 // SHADOW
  let diffuse: f32 = max(dot(normalize(lightPos.xyz), in.world_normal), 0.0);
  var shadow : f32 = 0.0;
  // apply Percentage-closer filtering (PCF)
  // sample nearest 9 texels to smooth result
  let size = f32(textureDimensions(depthMapTexture).x);
  for (var y : i32 = -1 ; y <= 1 ; y = y + 1) {
    for (var x : i32 = -1 ; x <= 1 ; x = x + 1) {
      let offset = vec2<f32>(f32(x) / size, f32(y) / size);
      shadow = shadow + textureSampleCompare(
        depthMapTexture, 
        depthMapSampler,
        in.shadow_pos.xy + offset, 
        in.shadow_pos.z - 0.005  // apply a small bias to avoid acne
      );
    }
  }
  shadow = shadow / 9.0;
  // ambient + diffuse * shadow
  let lightFactor = min(0.3 + shadow * diffuse, 1.0);
  result *= lightFactor;


  // let shadow: f32 = textureSampleCompare(depthMapTexture, depthMapSampler, in.shadow_pos.xy, in.shadow_pos.z - .01);

  // result = color.xyz;
  // result = vec3(in.texture, 0.0);
  // result = in.world_normal;

  // result = vec3(in.face_color);
  // result = in.picking_color.xyz;

  var out: FragOutput;
  out.color = vec4(result, 1.0);
  out.normal = vec4(result, 1.0);
  out.depth = vec4(result, 1.0);
  return out;
}
`;
