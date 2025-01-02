// based on http://blog.andreaskahler.com/2009/06/creating-icosphere-mesh-in-code.html
// https://dev.to/ndesmic/webgl-3d-engine-from-scratch-part-6-procedural-sphere-generation-29bf

import {
  inverseLerp,
  latLngToCartesian,
  QUARTER_TURN,
  TWO_PI,
} from "../../../utils/numbers";

export default (density) => {
  const radsPerUnit = Math.PI / density;
  const sliceVertCount = density * 2;

  // positions and UVs
  const positions = [];
  const uvs = [];
  let latitude = -Math.PI / 2;
  // latitude
  for (let i = 0; i <= density; i++) {
    const v = inverseLerp(-QUARTER_TURN, QUARTER_TURN, -latitude);
    let longitude = 0;
    // middle rings need extra vert for end U value
    const vertLength = sliceVertCount + (i > 0 && i < density ? 1 : 0);
    // longitude
    for (let j = 0; j < vertLength; j++) {
      positions.push(latLngToCartesian([1, latitude, longitude]));
      uvs.push([inverseLerp(0, TWO_PI, longitude), v]);
      longitude += radsPerUnit;
    }
    latitude += radsPerUnit;
  }

  // triangles
  const triangles = [];
  let ringStartP = 0;
  for (let ring = 0; ring < density; ring++) {
    // start at first ring
    const vertexBump = ring > 0 ? 1 : 0;
    for (let sliceVert = 0; sliceVert < sliceVertCount; sliceVert++) {
      const thisP = ringStartP + sliceVert;
      const nextP = ringStartP + sliceVert + 1;
      const nextRingP = thisP + sliceVertCount + vertexBump;
      const nextRingNextP = nextP + sliceVertCount + vertexBump;

      if (ring === 0) {
        triangles.push([thisP, nextRingNextP, nextRingP]);
      }
      if (ring === density - 1) {
        triangles.push([thisP, nextP, nextRingP]);
      }
      if (ring > 0 && ring < density - 1 && density > 2) {
        triangles.push([thisP, nextRingNextP, nextRingP]);
        triangles.push([thisP, nextP, nextRingNextP]);
      }
    }
    if (ring === 0) {
      ringStartP += sliceVertCount;
    } else {
      ringStartP += sliceVertCount + 1;
    }
  }

  return {
    position: positions.flat(),
    indices: triangles.flat(),
    texture: uvs.flat(),
    normale: positions.flat(),
  };
};
