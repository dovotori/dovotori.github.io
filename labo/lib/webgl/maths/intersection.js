// rayOrigin: The origin of the ray (Vector3)
// rayDirection: The direction of the ray (Vector3)
// planePoint: A point on the plane (Vector3)

import Vec3 from './Vec3';

// planeNormal: The normal of the plane (Vector3)
export function intersectRayWithPlane(rayOrigin, rayDirection, planePoint, planeNormal) {
  // Compute the dot product of the plane normal and ray direction
  const dotProduct = planeNormal.dot(rayDirection);

  // If dotProduct is 0, the ray is parallel to the plane
  if (dotProduct === 0) {
    console.error('dotProduct is 0, the ray is parallel to the plane');
    return null; // No intersection
  }

  // Compute the vector from the ray's origin to a point on the plane
  console.log({ planePoint, rayOrigin });
  if (!planePoint || !rayOrigin) {
    console.error('Missing planePoint or rayOrigin');
    return null;
  }
  const rayToPlane = new Vec3(planePoint.x, planePoint.y, planePoint.z).minus(rayOrigin);

  // Calculate the value of t where the ray intersects the plane
  const t = rayToPlane.dot(planeNormal) / dotProduct;

  // If t is positive, the intersection point is in the direction of the ray
  if (t < 0) {
    return null; // Intersection is behind the ray's origin
  }

  // Compute the intersection point
  const intersectionPoint = new Vec3(rayDirection.x, rayDirection.y, rayDirection.z)
    .multiplyNumber(t)
    .add(rayOrigin);

  return intersectionPoint;
}
