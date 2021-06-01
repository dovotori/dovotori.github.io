import { useEffect } from 'react';

import { Redirect } from 'react-router-dom';
import { Locales } from '../constants/locales';

export default ({ location: { pathname }, setLang }) => {
  useEffect(() => {
    console.log(pathname);
    if (pathname === '/en') {
      setLang(Locales.EN);
    } else {
      setLang(Locales.JP);
    }
  }, []);
  return <Redirect to="/" />;
};
