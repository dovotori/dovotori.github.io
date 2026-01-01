import Cv from "../components/Cv";
import { getCvContent, getIsTouchDevice } from "../selectors";

export default () => {
  const cv = getCvContent();
  return (
    <Cv
      jobs={cv.jobs}
      formation={cv.formation}
      skills={cv.skills}
      hobbies={cv.hobbies}
      isTouchDevice={getIsTouchDevice()}
    />
  );
};
