import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { setLang } from '../actions/device';
import { getDispatch } from '../selectors';

import { Locales } from '../constants/locales';

const haveLangRedirect = (str, lang) => str.indexOf(lang) !== -1;
const getRedirect = (str) => (str.length > 3 ? str.slice(3, str.length) : '/');

export default () => {
  const location = useLocation();
  const dispatch = getDispatch();
  useEffect(() => {
    if (haveLangRedirect(location.pathname, '/fr')) {
      dispatch(setLang(Locales.FR));
    } else if (haveLangRedirect(location.pathname, '/jp')) {
      dispatch(setLang(Locales.JP));
    } else {
      dispatch(setLang(Locales.EN));
    }
  }, []);
  return <Navigate to={getRedirect(location.pathname)} />;
};
