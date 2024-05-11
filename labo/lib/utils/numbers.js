export const degToRad = (deg) => (Math.PI * deg) / 180;

export const radToDeg = (rad) => (180 * rad) / Math.PI;

export const random = (min, max) => Math.random() * (max - min) + min;

export const mapFromRange = (valeur, minRef, maxRef, minDest, maxDest) => {
  let result =
    minDest +
    ((valeur - minRef) * (maxDest - minDest)) / (maxRef - minRef || 1);
  if (result < Math.min(minDest, maxDest)) {
    result = Math.min(minDest, maxDest);
  }
  if (result > Math.max(minDest, maxDest)) {
    result = Math.max(minDest, maxDest);
  }
  return result;
};

export const signe = (valeur) => {
  if (valeur === 0) return 0;
  if (valeur > 0) return 1;
  return -1;
};

export const nearestNextPowerOf2 = (n) => {
  let v = n;
  v--;
  v |= v >> 1;
  v |= v >> 2;
  v |= v >> 4;
  v |= v >> 8;
  v |= v >> 16;
  v++;
  return v;
};

export const fract = (x) => x - Math.floor(x);

export const mix = (x, y, a) => x * (1 - a) + y * a;

export const TWO_PI = Math.PI * 2;
export const QUARTER_TURN = Math.PI / 2;

export const inverseLerp = (start, end, value) =>
  (value - start) / (end - start);

export const normalizeAngle = (angle) => {
  if (angle < 0) {
    return TWO_PI - (Math.abs(angle) % TWO_PI);
  }
  return angle % TWO_PI;
};

export const latLngToCartesian = ([radius, lat, lng]) => {
  const nlng = -lng + Math.PI / 2;
  return [
    radius * Math.cos(lat) * Math.cos(nlng),
    radius * Math.sin(lat),
    radius * -Math.cos(lat) * Math.sin(nlng),
  ];
};

export const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};
