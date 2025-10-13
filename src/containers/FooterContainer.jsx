import { setLang, toggleTheme } from '../actions/device';
import Footer from '../components/Footer';
import { getContent, getDispatch, getIsDarkMode, getlang } from '../selectors';

export default () => {
  const dispatch = getDispatch();
  const content = getContent();
  const texts = {
    darkMode: content.darkMode,
    lightMode: content.lightMode,
  };
  const dispatchToggleTheme = () => dispatch(toggleTheme());
  const dispatchSetLang = (lang) => () => {
    dispatch(setLang(lang));
  };
  return (
    <Footer
      isDarkMode={getIsDarkMode()}
      lang={getlang()}
      texts={texts}
      toggleTheme={dispatchToggleTheme}
      setLang={dispatchSetLang}
    />
  );
};
