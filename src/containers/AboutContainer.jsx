import { useSelector } from 'react-redux';

import About from '../components/About';

const mapStateToProps = (state) => ({
  hello: state.content.hello,
  isTouchDevice: state.device.isTouch,
});

const Container = () => {
  const { hello, isTouchDevice } = useSelector(mapStateToProps);
  return <About hello={hello} isTouchDevice={isTouchDevice} />;
};

export default Container;
