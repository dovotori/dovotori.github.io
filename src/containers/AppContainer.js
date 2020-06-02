import { connect } from "react-redux";

import App from "../components/App";

const mapStateToProps = (state) => ({
  isDarkMode: state.device.isDarkMode,
});

export default connect(mapStateToProps)(App);
