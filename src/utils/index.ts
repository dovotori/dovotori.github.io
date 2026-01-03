import type { CategoryId, Locale, MyContent } from "src/types";
import availablesLang from "../constants/locales";

export const getSelectedCategory = (
  categories: MyContent["categories"],
  category: CategoryId,
): CategoryId | null => {
  if (category) {
    const match = Object.keys(categories).filter((id) => category === categories[id].slug)[0];
    return match ? (parseInt(match, 10) as CategoryId) : null;
  }
  return null;
};

export const isTouchDevice = (): boolean =>
  "ontouchstart" in window || navigator.maxTouchPoints > 0;

export const getEnvPath = (path: string) => `${process.env.ASSET_PATH}${path}`;
export const getTeaserPath = (slug: string) => getEnvPath(`/img/teasers/${slug}.webp`);
export const getProjectImagePath = (slug: string, idx: number) =>
  getEnvPath(`/img/${slug}/${slug}-${idx}.avif`);

export const getColorType = (category: CategoryId) => {
  switch (category) {
    case 1:
      return 0;
    case 2:
      return 2;
    default:
      return 1;
  }
};

export const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1);

export const getLocationHash = () => {
  const locationHash = window.location.hash.replace("#", "").toLowerCase() as Locale;
  return availablesLang.map((l) => l.id).indexOf(locationHash) !== -1 ? locationHash : null;
};

export const parseCsv = (string: string) => {
  const lines = string.split("\n");
  const keys = lines.shift().split(",");
  return lines.map((line) => {
    const l = line.split(",");
    return keys.reduce(
      (acc, cur, index) => ({
        ...acc,
        [cur]: l[index] !== "" ? l[index] : null,
      }),
      {},
    );
  });
};

export const mapFromRange = (
  valeur: number,
  minRef: number,
  maxRef: number,
  minDest: number,
  maxDest: number,
) => {
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
  setItem: (key: string, value: unknown) => {
    try {
      if (key && value !== null && value !== undefined) {
        sessionStorage.setItem(key, JSON.stringify(value));
      }
    } catch (e) {
      console.debug("Can't access session storage", e);
    }
  },
  getItem: (key: string) => {
    let item = null;
    try {
      item = sessionStorage.getItem(key);
    } catch (e) {
      console.debug("Can't access session storage", e);
    }
    return item !== null && item !== undefined ? JSON.parse(item) : null;
  },
};

export const timeout = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export function secureRandomInt(max: number) {
  const r = crypto.getRandomValues(new Uint32Array(1))[0] / 0xffffffff;
  return Math.floor(r * max);
}
