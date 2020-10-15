import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import TeasersList from '../components/TeasersList';
import { getSelectedCategory } from '../utils';

const mapStateToProps = (state, props) => {
  const categoryId = getSelectedCategory(state.content.categories, props.match.params.slug);
  const { entries: stateEntries } = state.content;
  const entries =
    categoryId === null
      ? stateEntries
      : stateEntries.filter((entry) => entry.category === categoryId);
  return {
    entries,
    isTouchDevice: state.device.isTouch,
  };
};

export default withRouter(connect(mapStateToProps)(TeasersList));
