import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CategoriesFilters from "../components/CategoriesFilters";
import { getSelectedCategory } from "../utils";

const mapStateToProps = (state, props) => {
  const { entries, categories } = state.content;
  const categoryIds = entries.reduce(
    (acc, cur) => ({ ...acc, [cur.category]: true }),
    {}
  );
  const filterCategories = Object.keys(categoryIds).reduce(
    (acc, cur) => ({ ...acc, [cur]: categories[cur] }),
    {}
  );
  return {
    selected: getSelectedCategory(categories, props.match.params.slug),
    categories: filterCategories
  };
};

export default withRouter(connect(mapStateToProps)(CategoriesFilters));
