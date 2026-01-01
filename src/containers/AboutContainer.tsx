import About from "../components/About";
import { getContent, getContentBack, getIsTouchDevice } from "../selectors";

const Container = () => {
  return (
    <About
      description={getContent().hello.description}
      isTouchDevice={getIsTouchDevice()}
      back={getContentBack()}
    />
  );
};

export default Container;
