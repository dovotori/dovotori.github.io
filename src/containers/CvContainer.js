import { connect } from "react-redux";

import Cv from "../components/Cv";

const mapStateToProps = (state) => ({
  jobs: state.content.cv.jobs,
  formation: state.content.cv.formation,
  skills: state.content.cv.skills,
  chart: state.content.cv.chart,
  hobbies: state.content.cv.hobbies,
  isTouchDevice: state.device.isTouch,
});

export default connect(mapStateToProps)(Cv);
