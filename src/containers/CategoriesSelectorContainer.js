import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import CategoriesSelector from "../components/CategoriesSelector";
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
    categories: filterCategories,
    isTouchDevice: state.device.isTouch,
  };
};

export default withRouter(connect(mapStateToProps)(CategoriesSelector));
