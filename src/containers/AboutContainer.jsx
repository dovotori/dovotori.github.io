import { useSelector } from 'react-redux';

import About from '../components/About';

const Container = () => {
  return (
    <About
      hello={useSelector((state) => state.content.hello)}
      isTouchDevice={useSelector((state) => state.device.isTouch)}
    />
  );
};

export default Container;
