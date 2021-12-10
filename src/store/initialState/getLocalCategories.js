import { CAT_DESIGN, CAT_CODE, CAT_BLOG } from '../../constants/categories';
import { Locales } from '../../constants/locales';

const categories = {
  [CAT_DESIGN]: {
    slug: 'design',
    label: { [Locales.FR]: 'design', [Locales.EN]: 'design', [Locales.JP]: 'デザイン' },
  },
  [CAT_CODE]: {
    slug: 'code',
    label: { [Locales.FR]: 'code', [Locales.EN]: 'code', [Locales.JP]: 'コーディング' },
  },
  [CAT_BLOG]: {
    slug: 'blog',
    label: { [Locales.FR]: 'blog', [Locales.EN]: 'blog', [Locales.JP]: 'ブログ' },
  },
};

export default (locale) =>
  [CAT_DESIGN, CAT_CODE, CAT_BLOG].reduce((acc, cur) => {
    return {
      ...acc,
      [cur]: { slug: categories[cur].slug, label: categories[cur].label[locale] },
    };
  }, {});
