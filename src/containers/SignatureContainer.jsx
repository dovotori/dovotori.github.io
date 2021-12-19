import { useSelector } from 'react-redux';
import { useRouteMatch } from 'react-router-dom';

import Signature from '../components/Signature';

const SignatureContainer = () => {
  const match = useRouteMatch();
  const isHome = match.path !== '/about';
  const hello = useSelector((state) => state.content.hello.about);
  const isTouchDevice = useSelector((state) => state.device.isTouch);
  return <Signature hello={hello} isTouchDevice={isTouchDevice} isHome={isHome} />;
};

export default SignatureContainer;
