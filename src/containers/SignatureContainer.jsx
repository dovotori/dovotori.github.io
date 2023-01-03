import { useSelector } from "react-redux";
import { useMatch, useLocation } from "react-router-dom";

import Signature from "../components/Signature";

const SignatureContainer = () => {
  const location = useLocation();
  const match = useMatch(location.pathname);
  const isHome = match.pathname !== "/about";
  const hello = useSelector((state) => state.content.hello.about);
  const text = useSelector((state) => state.content.hello.text);
  const isTouchDevice = useSelector((state) => state.device.isTouch);
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
