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
    // preserve per-particle rotation stored in velocities[index].w
    var rotation = velocities[index].w;

    // rotate clockwise by a small delta each dispatch
    let delta = 0.02; // radians per dispatch
    rotation = rotation - delta;
    // wrap around to keep in [-PI, PI]
    let PI = 3.141592653589793;
    if (rotation < -PI) {
        rotation = rotation + 2.0 * PI;
    }

    var direction = mass.position - position;

    var newPosition = position;

    positions[index] = vec4f(newPosition, 1);
    velocities[index] = vec4f(velocity, rotation);
}`;
