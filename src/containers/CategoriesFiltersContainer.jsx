import { setCategory } from '../actions/device';
import CategoriesFilters from '../components/CategoriesFilters';
import { getCategories, getCategoryId, getDispatch, getEntries } from '../selectors';

export default () => {
  const dispatch = getDispatch();
  const categories = getCategories();
  const entries = getEntries();
  const categoryIds = entries.reduce((acc, cur) => ({ ...acc, [cur.category]: true }), {});
  const categoryId = getCategoryId();
  const filterCategories = Object.keys(categoryIds).reduce(
    (acc, cur) => ({ ...acc, [cur]: categories[cur] }),
    {},
  );

  const onClick = (cat) => () => {
    dispatch(setCategory(parseInt(cat, 10)));
  };

  return (
    <CategoriesFilters
      selected={categoryId}
      categories={filterCategories}
      onClickCategory={onClick}
    />
  );
};
