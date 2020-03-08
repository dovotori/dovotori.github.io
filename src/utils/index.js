import availablesLang from '../constants/lang';

export const getSelectedCategory = (categories, category) => {
  if (category) {
    return parseInt(
      Object.keys(categories).filter((id) => category === categories[id])[0],
      10,
    );
  }
  return null;
};

export const shouldNotReload = (pathname) => (pathname === '/' || pathname.indexOf('/category/') !== -1 ? 'home' : pathname);

export const isTouchDevice = () => 'ontouchstart' in window
  || navigator.MaxTouchPoints > 0
  || navigator.msMaxTouchPoints > 0;

export const getEnvPath = (path) => `${process.env.ASSET_PATH}${path}`;
export const getTeaserPath = (slug) => getEnvPath(`/img/teasers/${slug}.png`);
export const getProjectImagePath = (slug, idx) => getEnvPath(`/img/${slug}/${slug}-${idx}.jpg`);
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

export const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export const getLocationHash = () => {
  const locationHash = window.location.hash.replace('#', '').toLowerCase();
  return availablesLang.indexOf(locationHash) !== -1 ? locationHash : availablesLang.fr;
};
