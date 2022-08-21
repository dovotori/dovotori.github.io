import { useDispatch, useSelector } from 'react-redux';

import CategoriesFilters from '../components/CategoriesFilters';
import { getCategories, getEntries } from '../selectors';
import { setCategory } from '../actions/device';

export default () => {
  const dispatch = useDispatch();
  const categories = getCategories();
  const entries = getEntries();
  const categoryIds = entries.reduce((acc, cur) => ({ ...acc, [cur.category]: true }), {});
  const categoryId = useSelector((state) => state.device.category);
  const filterCategories = Object.keys(categoryIds).reduce(
    (acc, cur) => ({ ...acc, [cur]: categories[cur] }),
    {}
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
