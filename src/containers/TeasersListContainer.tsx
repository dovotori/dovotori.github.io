import TeasersList from "../components/TeasersList";
import { getCategoryId, getEntries, getIsTouchDevice } from "../selectors";

export default () => {
  const stateEntries = getEntries();
  const isTouchDevice = getIsTouchDevice();
  const categoryId = getCategoryId();
  const entries =
    categoryId == null
      ? stateEntries
      : stateEntries.filter((entry) => entry.category === categoryId);
  return <TeasersList entries={entries} isTouchDevice={isTouchDevice} />;
};
