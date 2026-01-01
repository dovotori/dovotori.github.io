export const getComputeShader = (
  WORKGROUP_SIZE,
) => `@group(0) @binding(0) var<storage, read> input: array<f32, 7>; // [nbParticles, xMin, xMax, yMin, yMax, zMin, zMax]
@group(0) @binding(1) var<storage, read_write> velocity: array<vec4<f32>>;
@group(0) @binding(2) var<storage, read_write> model: array<mat4x4<f32>>;

// Generic rotation matrix from Euler angles (radians)
// Order: Z (roll), Y (yaw), X (pitch)
fn rotationXYZ(angles: vec3<f32>) -> mat4x4<f32> {
  let cx = cos(angles.x);
  let sx = sin(angles.x);
  let cy = cos(angles.y);
  let sy = sin(angles.y);
  let cz = cos(angles.z);
  let sz = sin(angles.z);

  let rotX = mat4x4<f32>(
    vec4<f32>(1.0, 0.0, 0.0, 0.0),
    vec4<f32>(0.0, cx, -sx, 0.0),
    vec4<f32>(0.0, sx, cx, 0.0),
    vec4<f32>(0.0, 0.0, 0.0, 1.0)
  );

  let rotY = mat4x4<f32>(
    vec4<f32>(cy, 0.0, sy, 0.0),
    vec4<f32>(0.0, 1.0, 0.0, 0.0),
    vec4<f32>(-sy, 0.0, cy, 0.0),
    vec4<f32>(0.0, 0.0, 0.0, 1.0)
  );

  let rotZ = mat4x4<f32>(
    vec4<f32>(cz, -sz, 0.0, 0.0),
    vec4<f32>(sz, cz, 0.0, 0.0),
    vec4<f32>(0.0, 0.0, 1.0, 0.0),
    vec4<f32>(0.0, 0.0, 0.0, 1.0)
  );

  // Combined rotation: rotZ * rotY * rotX
  return rotZ * rotY * rotX;
}

// Extracts Euler angles (YXZ order) from a 4x4 matrix
fn extractEulerYXZ(m: mat4x4<f32>) -> vec3<f32> {
    let m00 = m[0][0];
    let m01 = m[0][1];
    let m02 = m[0][2];
    let m10 = m[1][0];
    let m11 = m[1][1];
    let m12 = m[1][2];
    let m20 = m[2][0];
    let m21 = m[2][1];
    let m22 = m[2][2];

    let y = asin(clamp(-m02, -1.0, 1.0));
    var x: f32;
    var z: f32;

    if (abs(m02) < 0.99999) {
        x = atan2(m12, m22);
        z = atan2(m01, m00);
    } else {
        // Gimbal lock
        x = atan2(-m21, m11);
        z = 0.0;
    }
    return vec3<f32>(x, y, z);
}

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(
    @builtin(global_invocation_id) GlobalInvocationID : vec3<u32>
) {
    var index = GlobalInvocationID.x;
    if(index >= u32(input[0])){
      return;
    }

    var xMin = input[1];
    var xMax = input[2];
    var yMin = input[3];
    var yMax = input[4];
    var zMin = input[5];
    var zMax = input[6];
    var pos = model[index][3];
    var vel = velocity[index];
    
    // change x
    pos.x += vel.x;
    if(pos.x < xMin){
        pos.x = xMin;
        vel.x = -vel.x;
    }else if(pos.x > xMax){
        pos.x = xMax;
        vel.x = -vel.x;
    }
    
    // change y
    pos.y += vel.y;
    if(pos.y < yMin){
        pos.y = yMin;
        vel.y = -vel.y;
    } else if(pos.y > yMax){
        pos.y = yMax;
        vel.y = -vel.y;
    }
    
    // change z
    pos.z += vel.z;
    if(pos.z < zMin){
        pos.z = zMin;
        vel.z = -vel.z;
    }else if(pos.z > zMax){
        pos.z = zMax;
        vel.z = -vel.z;
    }
    
    // update velocity
    velocity[index] = vel;
    
    // update position in model matrix
    model[index][3] = pos;

    // Apply constant rotation around Y axis
    // let curRot = extractEulerYXZ(model[index]);
    let rotMat = rotationXYZ(vec3<f32>(pos[0] * 0.00001, pos[1] * 0.00002, pos[2] * 0.00005)); // rotate around X and Z too
    model[index] = model[index] * rotMat;
}`;
