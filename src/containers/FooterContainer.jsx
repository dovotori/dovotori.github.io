import { useDispatch, useSelector } from 'react-redux';

import Footer from '../components/Footer';
import { toggleTheme, setLang } from '../actions/device';

export default () => {
  const dispatch = useDispatch();
  const darkMode = useSelector(state => state.content.darkMode);
  const lightMode = useSelector(state => state.content.lightMode);
  const texts = {
    darkMode,
    lightMode,
  };
  const dispatchToggleTheme = () => dispatch(toggleTheme());
  const dispatchSetLang = (lang) => () => {
    dispatch(setLang(lang));
  };
  return <Footer
    isDarkMode={useSelector(state => state.device.isDarkMode)}
    lang={useSelector(state => state.device.lang)}
    texts={texts}
    toggleTheme={dispatchToggleTheme}
    setLang={dispatchSetLang}
  />;
};
