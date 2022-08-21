import { useSelector } from 'react-redux';

import TeasersList from '../components/TeasersList';
import { getEntries, getIsTouchDevice } from '../selectors';

export default () => {
  const stateEntries = getEntries();
  const isTouchDevice = getIsTouchDevice();
  const categoryId = useSelector((state) => state.device.category);
  const entries =
    categoryId === -1
      ? stateEntries
      : stateEntries.filter((entry) => entry.category === categoryId);
  return <TeasersList entries={entries} isTouchDevice={isTouchDevice} />;
};
