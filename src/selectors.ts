import { useStateCtx } from "./contexts";

export const getCategories = () => useStateCtx().state.content.categories;
export const getTags = () => useStateCtx().state.content.tags;
export const getEntries = () => useStateCtx().state.content.entries;
export const getIsTouchDevice = () => useStateCtx().state.device.isTouch;
export const getIsDarkMode = () => useStateCtx().state.device.isDarkMode;
export const getContentBack = () => useStateCtx().state.content.back;
export const getContentPrevious = () => useStateCtx().state.content.previous;
export const getContentNext = () => useStateCtx().state.content.next;
export const getEntry = (slug) => getEntries().find((entry) => entry.slug === slug) || null;
export const getCategoryId = () => useStateCtx().state.device.category;
export const getCvContent = () => useStateCtx().state.content.cv;
export const getContent = () => useStateCtx().state.content;
export const getlang = () => useStateCtx().state.device.lang;
export const getDispatch = () => useStateCtx().dispatch;
