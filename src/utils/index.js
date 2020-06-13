import availablesLang from "../constants/locales";

export const getSelectedCategory = (categories, category) => {
  if (category) {
    return parseInt(
      Object.keys(categories).filter((id) => category === categories[id])[0],
      10
    );
  }
  return null;
};

export const shouldNotReload = (pathname) =>
  pathname === "/" || pathname.indexOf("/category/") !== -1 ? "home" : pathname;

export const isTouchDevice = () =>
  "ontouchstart" in window ||
  navigator.MaxTouchPoints > 0 ||
  navigator.msMaxTouchPoints > 0;

export const getEnvPath = (path) => `${process.env.ASSET_PATH}${path}`;
export const getTeaserPath = (slug) => getEnvPath(`/img/teasers/${slug}.png`);
export const getProjectImagePath = (slug, idx) =>
  getEnvPath(`/img/${slug}/${slug}-${idx}.jpg`);
export const getHtmlPath = (slug) => getEnvPath(`/html/${slug}.html`);

export const getColorType = (category) => {
  switch (category) {
    default:
    case 0:
      return 1;
    case 1:
      return 0;
    case 2:
      return 2;
  }
};

export const capitalize = (string) =>
  string.charAt(0).toUpperCase() + string.slice(1);

export const getLocationHash = () => {
  const locationHash = window.location.hash.replace("#", "").toLowerCase();
  return availablesLang.map((l) => l.id).indexOf(locationHash) !== -1
    ? locationHash
    : null;
};

export const parseCsv = (string) => {
  const lines = string.split("\n");
  const keys = lines.shift().split(",");
  return lines.map((line) => {
    const l = line.split(",");
    return keys.reduce(
      (acc, cur, index) => ({
        ...acc,
        [cur]: l[index] !== "" ? l[index] : null,
      }),
      {}
    );
  });
};

export const mapFromRange = (valeur, minRef, maxRef, minDest, maxDest) => {
  let result =
    minDest + ((valeur - minRef) * (maxDest - minDest)) / (maxRef - minRef);
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
      console.debug("can't access session storage");
    }
  },
  getItem: (key) => {
    let item = null;
    try {
      item = sessionStorage.getItem(key);
    } catch (e) {
      console.debug("can't access session storage");
    }
    return item !== null && item !== undefined ? JSON.parse(item) : null;
  },
};

export const chunkArray = (arr, size) =>
Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
  arr.slice(i * size, i * size + size)
);
