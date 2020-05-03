import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import Footer from "../components/Footer";
import { toggleTheme, setLang } from "../actions/device";

const mapStateToProps = (state) => ({
  isDarkMode: state.device.isDarkMode,
  texts: {
    darkMode: state.content.darkMode,
    lightMode: state.content.lightMode,
  },
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators({ toggleTheme, setLang }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Footer);
