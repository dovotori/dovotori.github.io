import { useSelector } from "react-redux";

import CategoriesFilters from "../components/CategoriesFilters";
import { getCategories, getEntries } from "../selectors";

export default () => {
  const categories = getCategories();
  const entries = getEntries();
  const categoryIds = entries.reduce(
    (acc, cur) => ({ ...acc, [cur.category]: true }),
    {},
  );
  const categoryId = useSelector((state) => state.device.category);
  const filterCategories = Object.keys(categoryIds).reduce(
    (acc, cur) => ({ ...acc, [cur]: categories[cur] }),
    {},
  );

  return (
    <CategoriesFilters selected={categoryId} categories={filterCategories} />
  );
};
