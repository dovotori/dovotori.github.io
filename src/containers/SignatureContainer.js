import { connect } from 'react-redux';

import Signature from '../components/Signature';

const mapStateToProps = (state) => ({
  hello: state.content.hello,
  isTouchDevice: state.device.isTouch,
});

export default connect(mapStateToProps)(Signature);
