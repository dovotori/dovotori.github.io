import availablesLang from '../constants/locales';

export const getSelectedCategory = (categories, category) => {
  if (category) {
    const match = Object.keys(categories).filter((id) => category === categories[id].slug)[0];
    return match ? parseInt(match, 10) : null;
  }
  return null;
};

export const isTouchDevice = () =>
  'ontouchstart' in window || navigator.MaxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

export const getEnvPath = (path) => `${process.env.ASSET_PATH}${path}`;
export const getTeaserPath = (slug) => getEnvPath(`/img/teasers/${slug}.png`);
export const getProjectImagePath = (slug, idx) => getEnvPath(`/img/${slug}/${slug}-${idx}.jpg`);

export const getColorType = (category) => {
  switch (category) {
    case 1:
      return 0;
    case 2:
      return 2;
    case 0:
    default:
      return 1;
  }
};

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const getLocationHash = () => {
  const locationHash = window.location.hash.replace('#', '').toLowerCase();
  return availablesLang.map((l) => l.id).indexOf(locationHash) !== -1 ? locationHash : null;
};

export const parseCsv = (string) => {
  const lines = string.split('\n');
  const keys = lines.shift().split(',');
  return lines.map((line) => {
    const l = line.split(',');
    return keys.reduce(
      (acc, cur, index) => ({
        ...acc,
        [cur]: l[index] !== '' ? l[index] : null,
      }),
      {},
    );
  });
};

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

export const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
};

export const storage = {
  setItem: (key, value) => {
    try {
      if (key && value !== null && value !== undefined) {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.debug("Can't access session storage");
    }
  },
  getItem: (key) => {
    let item = null;
    try {
      item = sessionStorage.getItem(key);
    } catch (e) {
      console.debug("Can't access session storage");
    }
    return item !== null && item !== undefined ? JSON.parse(item) : null;
  },
};

export const chunkArray = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
    arr.slice(i * size, i * size + size),
  );

export const timeout = (ms) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
