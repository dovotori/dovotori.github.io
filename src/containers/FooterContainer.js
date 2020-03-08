import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Footer from '../components/Footer';
import { toggleTheme } from '../actions/device';

const mapStateToProps = (state) => ({
  isDarkMode: state.device.isDarkMode,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({ toggleTheme }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
