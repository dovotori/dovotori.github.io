export const degToRad = (deg) => (Math.PI * deg) / 180;

export const radToDeg = (rad) => (180 * rad) / Math.PI;

export const random = (min, max) => Math.random() * (max - min) + min;

export const mapFromRange = (valeur, minRef, maxRef, minDest, maxDest) => {
  let result = minDest + ((valeur - minRef) * (maxDest - minDest)) / (maxRef - minRef);
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
