import { useContext } from "react";
import { StateContext } from "./contexts";

// export const getCategories = () => useSelector((state) => state.content.categories);
// export const getTags = () => useSelector((state) => state.content.tags);
// export const getEntries = () => useSelector((state) => state.content.entries);
// export const getIsTouchDevice = () => useSelector((state) => state.device.isTouch);
// export const getIsDarkMode = () => useSelector((state) => state.device.isDarkMode);
// export const getContentBack = () => useSelector((state) => state.content.back);
// export const getContentPrevious = () => useSelector((state) => state.content.previous);
// export const getContentNext = () => useSelector((state) => state.content.next);
// export const getEntry = (slug) => getEntries().find((entry) => entry.slug === slug) || null;

export const getCategories = () =>
  useContext(StateContext).state.content.categories;
export const getTags = () => useContext(StateContext).state.content.tags;
export const getEntries = () => useContext(StateContext).state.content.entries;
export const getIsTouchDevice = () =>
  useContext(StateContext).state.device.isTouch;
export const getIsDarkMode = () =>
  useContext(StateContext).state.device.isDarkMode;
export const getContentBack = () => useContext(StateContext).state.content.back;
export const getContentPrevious = () =>
  useContext(StateContext).state.content.previous;
export const getContentNext = () => useContext(StateContext).state.content.next;
export const getEntry = (slug) =>
  getEntries().find((entry) => entry.slug === slug) || null;
export const getCategoryId = () =>
  useContext(StateContext).state.device.category;
export const getCvContent = () => useContext(StateContext).state.content.cv;
export const getContent = () => useContext(StateContext).state.content;
export const getlang = () => useContext(StateContext).state.device.lang;
export const getDispatch = () => useContext(StateContext).dispatch;
