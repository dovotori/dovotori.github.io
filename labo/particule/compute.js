export const computeShader = (WORKGROUP_SIZE) => `struct Mass {
    position: vec3f,
    factor: f32,
    mode: f32,
};

@group(0) @binding(0) var<storage, read_write> positions: array<vec4f>;
@group(0) @binding(1) var<storage, read_write> velocities: array<vec4f>; 
@group(0) @binding(2) var<uniform> mass: Mass;

@compute @workgroup_size(${WORKGROUP_SIZE})
fn main(@builtin(global_invocation_id) global_id: vec3u) {
    let index = global_id.x;
    let position = positions[index].xyz;
    var velocity = velocities[index].xyz;

    var massVec = mass.position.xyz - position;
    var massDist = max(0.01, dot(massVec, massVec));

    var acceleration: vec3f;
    if (mass.mode == 1.0) {
      // repel mode
      acceleration = -mass.factor * normalize(massVec) / massDist;
    } else {
      // attract mode
      acceleration = mass.factor * normalize(massVec) / massDist;
    }

    velocity += acceleration;
    velocity *= 0.8;

    var newPosition = position + velocity;

    if (newPosition.x < -1.0) {
      // reflect across -1 boundary
      newPosition.x = -2.0 - newPosition.x;
      velocity.x = -velocity.x;
    } else if (newPosition.x > 1.0) {
      // reflect across +1 boundary
      newPosition.x = 2.0 - newPosition.x;
      velocity.x = -velocity.x;
    }
    if (newPosition.y < -1.0) {
      newPosition.y = -2.0 - newPosition.y;
      velocity.y = -velocity.y;
    } else if (newPosition.y > 1.0) {
      newPosition.y = 2.0 - newPosition.y;
      velocity.y = -velocity.y;
    }

    if (newPosition.z < -1.0) {
      newPosition.z = -2.0 - newPosition.z;
      velocity.z = -velocity.z;
    } else if (newPosition.z > 1.0) {
      newPosition.z = 2.0 - newPosition.z;
      velocity.z = -velocity.z;
    }

    positions[index] = vec4f(newPosition, 1);
    velocities[index] = vec4f(velocity, 0);
}`;
