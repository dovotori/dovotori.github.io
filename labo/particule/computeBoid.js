export const boidUtils = `
  // Boid constants and utility functions
  const MAX_SPEED: f32 = 0.01;
  const MAX_STRENGTH: f32 = 0.1;
  const MASS: f32 = 10.0;
  const RADIUS_SLOWDOWN: f32 = 0.02;
  const RADIUS_SEPERATE: f32 = 0.1;
  const DISTANCE_ALIGN: f32 = 0.3;
  const DISTANCE_COHESION: f32 = 0.5;

  fn limiter(v: vec3f, maxv: f32) -> vec3f {
    let l = length(v);
    if (l > maxv) {
      return v * (maxv / l);
    }
    return v;
  }
`;

export const computeBoid = `
  // Boid-like behavior (separation / alignment / cohesion)
  // particle count stored in settings.particleCount (written from JS as float)
  let n = u32(settings.particleCount);
  var forceSeparation = vec3f(0.0, 0.0, 0.0);
  var cptSeparation: u32 = 0u;
  var forceAlign = vec3f(0.0, 0.0, 0.0);
  var cptAlign: u32 = 0u;
  var forceCohesion = vec3f(0.0, 0.0, 0.0);
  var cptCohesion: u32 = 0u;

  var j: u32 = 0u;
  loop {
    if (j >= n) { break; }
    if (j != u32(index)) {
      let pj = positions[j].xyz;
      let vj = velocities[j].xyz;
      let dvec = pj - position;
      let dist = length(dvec);
      if (dist > 0.0) {
        if (dist < RADIUS_SEPERATE) {
          var ajout = normalize(position - pj);
          ajout = ajout / dist;
          forceSeparation = forceSeparation + ajout;
          cptSeparation = cptSeparation + 1u;
        }
        if (dist < DISTANCE_ALIGN) {
          forceAlign = forceAlign + vj;
          cptAlign = cptAlign + 1u;
        }
        if (dist < DISTANCE_COHESION) {
          forceCohesion = forceCohesion + pj;
          cptCohesion = cptCohesion + 1u;
        }
      }
    }
    j = j + 1u;
  }

  var velocityLocal = velocity;

  // build steering forces
  var sepForce = vec3f(0.0, 0.0, 0.0);
  var aliForce = vec3f(0.0, 0.0, 0.0);
  var cohForce = vec3f(0.0, 0.0, 0.0);

  if (cptSeparation > 0u) {
    let cnt = f32(cptSeparation);
    sepForce = forceSeparation / cnt;
    if (length(sepForce) > 0.0) {
      sepForce = normalize(sepForce) * MAX_SPEED;
      sepForce = limiter(sepForce - velocityLocal, MAX_STRENGTH);
    } else {
      sepForce = vec3f(0.0, 0.0, 0.0);
    }
  }

  if (cptAlign > 0u) {
    let cnt = f32(cptAlign);
    aliForce = forceAlign / cnt;
    if (length(aliForce) > 0.0) {
      aliForce = normalize(aliForce) * MAX_SPEED;
      aliForce = limiter(aliForce - velocityLocal, MAX_STRENGTH);
    } else {
      aliForce = vec3f(0.0, 0.0, 0.0);
    }
  }

  if (cptCohesion > 0u) {
    let cnt = f32(cptCohesion);
    var center = forceCohesion / cnt;
    var desired = center - position;
    if (length(desired) > 0.0) {
      let distToCenter = length(desired);
      var desiredSpeed = MAX_SPEED;
      if (distToCenter < RADIUS_SLOWDOWN) {
        desiredSpeed = MAX_SPEED * (distToCenter / RADIUS_SLOWDOWN);
      }
      desired = normalize(desired) * desiredSpeed;
      cohForce = limiter(desired - velocityLocal, MAX_STRENGTH);
    } else {
      cohForce = vec3f(0.0, 0.0, 0.0);
    }
  }

  // combine, weight separation, apply mass
  var combined = (sepForce * 1.5 + aliForce + cohForce) / MASS;
  velocityLocal = velocityLocal + combined;
  velocityLocal = limiter(velocityLocal, MAX_SPEED);

  var newPos = position + velocityLocal;

  // Wrap around screen edges (toroidal space)
  if (newPos.x < -1.0) {
    newPos.x = 1.0;
  } else if (newPos.x > 1.0) {
    newPos.x = -1.0;
  }
  if (newPos.y < -1.0) {
    newPos.y = 1.0;
  } else if (newPos.y > 1.0) {
    newPos.y = -1.0;
  }
  if (newPos.z < -1.0) {
    newPos.z = 1.0;
  } else if (newPos.z > 1.0) {
    newPos.z = -1.0;
  }

  newPosition = vec4(newPos, 1.0);
  // store orientation angle in the w component so the vertex shader can orient the triangle
  let rot = atan2(velocityLocal.y, velocityLocal.x);
  newVelocity = vec4(velocityLocal, rot);
`;

export const buildBoidData = (particulesCount) => {
  const positionBufferData = new Float32Array(particulesCount * 4);
  const positionArrayStride = Float32Array.BYTES_PER_ELEMENT * 4;
  const velocityBufferData = new Float32Array(particulesCount * 4);
  const velocityArrayStride = Float32Array.BYTES_PER_ELEMENT * 4;
  const colorArrayStride = Uint8Array.BYTES_PER_ELEMENT * 4; // 4 bytes per color component
  const colorBufferData = new Uint8Array(4 * particulesCount);

  for (let i = 0; i < positionBufferData.length; i += 4) {
    positionBufferData[i] = Math.random() * 2 - 1;
    positionBufferData[i + 1] = Math.random() * 2 - 1;
    positionBufferData[i + 2] = Math.random() * 2 - 1;
    positionBufferData[i + 3] = 1;
  }

  for (let i = 0; i < velocityBufferData.length; i += 4) {
    velocityBufferData[i] = Math.random() * 0.002 - 0.001;
    velocityBufferData[i + 1] = Math.random() * 0.002 - 0.001;
    velocityBufferData[i + 2] = Math.random() * 0.002 - 0.001;
    velocityBufferData[i + 3] = 0;
  }

  for (let i = 0; i < colorBufferData.length; i += 4) {
    colorBufferData[i] = 0;
    colorBufferData[i + 1] = Math.floor(Math.random() * 256);
    colorBufferData[i + 2] = Math.floor(Math.random() * 256);
    colorBufferData[i + 3] = 128;
  }

  return {
    positionBufferData,
    positionArrayStride,
    velocityBufferData,
    velocityArrayStride,
    colorBufferData,
    colorArrayStride,
  };
};
