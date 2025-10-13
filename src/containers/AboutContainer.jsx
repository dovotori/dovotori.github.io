import About from "../components/About";
import { getContent, getContentBack, getIsTouchDevice } from "../selectors";

const Container = () => {
  return (
    <About
      hello={getContent().hello}
      isTouchDevice={getIsTouchDevice()}
      back={getContentBack()}
    />
  );
};

export default Container;
