import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import TeasersList from "../components/TeasersList";
import { getSelectedCategory } from "../utils";

const mapStateToProps = (state, props) => {
  const categoryId = getSelectedCategory(
    state.content.categories,
    props.match.params.slug
  );
  const { entries } = state.content;
  return {
    entries:
      categoryId === null
        ? entries
        : entries.filter((entry) => entry.category === categoryId),
    isTouchDevice: state.device.isTouch,
  };
};

export default withRouter(connect(mapStateToProps)(TeasersList));
