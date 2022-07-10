import { useEffect } from 'react';
import {
  useLocation,
  Navigate
} from 'react-router-dom';

import { Locales } from '../constants/locales';

export default ({ setLang }) => {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname === '/fr') {
      setLang(Locales.FR);
    } else if (location.pathname === '/jp') {
      setLang(Locales.JP);
    } else {
      setLang(Locales.EN);
    }
  }, []);
  return <Navigate to="/" />;
};
