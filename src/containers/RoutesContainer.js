import { connect } from "react-redux";

import Routes from "../components/Routes";

const mapStateToProps = (state) => ({
  isTouchDevice: state.device.isTouch,
});

export default connect(mapStateToProps)(Routes);
