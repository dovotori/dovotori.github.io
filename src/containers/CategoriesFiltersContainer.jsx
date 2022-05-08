import { useParams } from 'react-router-dom';

import CategoriesFilters from '../components/CategoriesFilters';
import { getSelectedCategory } from '../utils';
import { getCategories, getEntries } from '../selectors';

export default () => {
  const params = useParams();
  const categories = getCategories();
  const entries = getEntries();
  const categoryIds = entries.reduce((acc, cur) => ({ ...acc, [cur.category]: true }), {});
  const filterCategories = Object.keys(categoryIds).reduce(
    (acc, cur) => ({ ...acc, [cur]: categories[cur] }),
    {}
  );
  return (
    <CategoriesFilters
      selected={getSelectedCategory(categories, params.slug)}
      categories={filterCategories}
    />
  );
};
