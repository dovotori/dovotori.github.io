import { connect } from 'react-redux';

import Cv from '../components/Cv';

const mapStateToProps = (state) => ({
  jobs: state.content.cv.jobs,
  formation: state.content.cv.formation,
  skills: state.content.cv.skills,
  hobbies: state.content.cv.hobbies,
  isTouchDevice: state.device.isTouch,
});

export default connect(mapStateToProps)(Cv);
