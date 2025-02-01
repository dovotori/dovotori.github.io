import { useSelector } from 'react-redux';

export const getCategories = () => useSelector((state) => state.content.categories);
export const getTags = () => useSelector((state) => state.content.tags);
export const getEntries = () => useSelector((state) => state.content.entries);
export const getIsTouchDevice = () => useSelector((state) => state.device.isTouch);
export const getIsDarkMode = () => useSelector((state) => state.device.isDarkMode);
export const getContentBack = () => useSelector((state) => state.content.back);
export const getContentPrevious = () => useSelector((state) => state.content.previous);
export const getContentNext = () => useSelector((state) => state.content.next);

export const getEntry = (slug) => getEntries().filter((entry) => entry.slug === slug)[0] || null;
