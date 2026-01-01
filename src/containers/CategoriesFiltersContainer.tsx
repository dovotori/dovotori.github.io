import type { CategoryId } from "src/types";
import { setCategory } from "../actions/device";
import CategoriesFilters from "../components/CategoriesFilters";
import { getCategories, getCategoryId, getDispatch } from "../selectors";

export default () => {
  const dispatch = getDispatch();
  const categories = getCategories();
  const categoryId = getCategoryId();

  const onClick = (cat: CategoryId) => () => {
    dispatch(setCategory(cat));
  };

  return (
    <CategoriesFilters selected={categoryId} categories={categories} onClickCategory={onClick} />
  );
};
