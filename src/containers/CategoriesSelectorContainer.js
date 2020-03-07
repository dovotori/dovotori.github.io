import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import CategoriesSelector from '../components/CategoriesSelector';
import { getSelectedCategory } from '../utils';

const mapStateToProps = (state, props) => ({
  selected: getSelectedCategory(
    state.content.categories,
    props.match.params.slug,
  ),
  categories: state.content.categories,
  isTouchDevice: state.device.isTouch,
});

export default withRouter(connect(mapStateToProps)(CategoriesSelector));
