import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { setLang } from '../actions/device';
import LangRedirect from '../components/LangRedirect';

const mapDispatchToProps = (dispatch) => bindActionCreators({ setLang }, dispatch);

export default connect(null, mapDispatchToProps)(LangRedirect);
