import { connect } from "react-redux";

import About from "../components/About";

const mapStateToProps = (state) => ({
  hello: state.content.hello,
  isTouchDevice: state.device.isTouch,
});

export default connect(mapStateToProps)(About);
