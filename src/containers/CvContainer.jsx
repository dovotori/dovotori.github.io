import { useSelector } from "react-redux";

import Cv from "../components/Cv";

export default () => (
  <Cv
    jobs={useSelector((state) => state.content.cv.jobs)}
    formation={useSelector((state) => state.content.cv.formation)}
    skills={useSelector((state) => state.content.cv.skills)}
    chart={useSelector((state) => state.content.cv.chart)}
    hobbies={useSelector((state) => state.content.cv.hobbies)}
    isTouchDevice={useSelector((state) => state.device.isTouch)}
  />
);
