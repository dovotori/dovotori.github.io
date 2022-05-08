import { useParams } from 'react-router-dom';

import TeasersList from '../components/TeasersList';
import { getSelectedCategory } from '../utils';
import { getCategories, getEntries, getIsTouchDevice } from '../selectors';

export default () => {
  const params = useParams();
  const categories = getCategories();
  const stateEntries = getEntries();
  const isTouchDevice = getIsTouchDevice();
  const categoryId = getSelectedCategory(categories, params.slug);
  const entries =
    categoryId === null
      ? stateEntries
      : stateEntries.filter((entry) => entry.category === categoryId);
  return <TeasersList entries={entries} isTouchDevice={isTouchDevice} />;
};
