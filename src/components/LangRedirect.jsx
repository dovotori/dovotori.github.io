import { useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLang } from "../actions/device";

import { Locales } from "../constants/locales";

const haveLangRedirect = (str, lang) => str.indexOf(lang) !== -1;
const getRedirect = (str) => (str.length > 3 ? str.slice(3, str.length) : "/");

export default () => {
  const location = useLocation();
  const dispatch = useDispatch();
  useEffect(() => {
    if (haveLangRedirect(location.pathname, "/fr")) {
      dispatch(setLang(Locales.FR));
    } else if (haveLangRedirect(location.pathname, "/jp")) {
      dispatch(setLang(Locales.JP));
    } else {
      dispatch(setLang(Locales.EN));
    }
  }, []);
  return <Navigate to={getRedirect(location.pathname)} />;
};
