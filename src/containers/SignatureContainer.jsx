import { useLocation, useMatch } from "react-router-dom";
import Signature from "../components/Signature";
import { getContent, getIsTouchDevice } from "../selectors";

const SignatureContainer = () => {
  const location = useLocation();
  const match = useMatch(location.pathname);
  const isHome = match.pathname !== "/about";
  const content = getContent();
  const hello = content.hello.about;
  const text = content.hello.text;
  const isTouchDevice = getIsTouchDevice();
  return (
    <Signature
      hello={hello}
      isTouchDevice={isTouchDevice}
      isHome={isHome}
      text={text}
    />
  );
};

export default SignatureContainer;
