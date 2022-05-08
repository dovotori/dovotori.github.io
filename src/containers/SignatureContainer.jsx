import { useSelector } from 'react-redux';
import { useMatch, useLocation } from 'react-router-dom';

import Signature from '../components/Signature';

const SignatureContainer = () => {
  const location = useLocation();
  const match = useMatch(location.pathname);
  const isHome = match.pathname !== '/about';
  const hello = useSelector((state) => state.content.hello.about);
  const isTouchDevice = useSelector((state) => state.device.isTouch);
  return <Signature hello={hello} isTouchDevice={isTouchDevice} isHome={isHome} />;
};

export default SignatureContainer;
